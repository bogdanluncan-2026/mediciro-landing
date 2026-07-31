/**
 * Capturi de ecran pentru ghidurile de utilizare.
 *
 *   node capture_screens.mjs admin
 *   node capture_screens.mjs doctor frontdesk
 *   node capture_screens.mjs            (toate rolurile, pe rand)
 *
 * Deschide un browser VIZIBIL si asteapta sa te autentifici tu, inclusiv cu codul din aplicatia de
 * autentificare. Dupa ce apesi Enter in terminal, parcurge singur ecranele si salveaza imaginile in
 * public/screenshots/<rol>/.
 *
 * De ce asa: conturile de personal au autentificare in doi pasi, deci un script nu poate intra singur.
 * Alternativa ar fi fost sa injectam un jeton de sesiune, dar atunci un secret ar fi trecut prin
 * conversatie si ar fi expirat oricum in 15 minute.
 *
 * Imaginile se fac la scale 2, adica 2560 px latime pentru un viewport de 1280 — text clar in PDF.
 * Adresa de e-mail a contului se inlocuieste in pagina inainte de fiecare captura: ghidurile ajung
 * publice si nu are ce cauta acolo o adresa personala.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const BASE = process.env.MEDIRO_URL ?? 'http://localhost:5173';
const OUT = 'public/screenshots';

/**
 * Date reale care nu au ce cauta in ghidurile publice. Numele complete se inlocuiesc INAINTE de
 * variantele scurte, altfel "Zaha" ar taia jumatate din "Adriana Zaha" si ar ramane un hibrid.
 *
 * Faptul ca o persoana are o programare la o clinica este in sine o informatie de sanatate, deci
 * pacientii reali din baza de test nu pot aparea intr-un document publicat.
 */
const REDACTIONS = [
  [/mediro2026\+test-admin@gmail\.com/g, 'admin@clinica.ro'],
  [/mediro2026\+[a-z0-9.+-]*@gmail\.com/g, 'utilizator@clinica.ro'],
  [/asistentdemo@yopmail\.com/g, 'asistent@centru.ro'],
  [/Copilul Lui Zaha/gi, 'Mihai Popescu'],
  [/Adriana Zaha/gi, 'Ioana Popescu'],
  [/Marian Dragomir/gi, 'Elena Radu'],
  [/Dragomir/g, 'Radu'],
  [/Zaha/g, 'Popescu'],
  // Numele si prenumele pacientilor sunt randate in noduri de text separate, deci regulile pe nume
  // complet nu prind — de aceea si variantele scurte, aplicate dupa cele lungi.
  [/Adriana/g, 'Ioana'],
  [/Luncan/g, 'Popescu'],
  [/Bogdan/g, 'Ion'],
  // Fara plus: regula de mai sus prinde doar aliasurile, nu si adresa de baza.
  [/mediro2026@gmail\.com/g, 'utilizator@clinica.ro'],

  // Numele de test arata a baza de date, nu a clinica. Le inlocuim cu nume verosimile, ca ghidul sa fie
  // credibil. Ordinea conteaza: intai sirurile lungi, altfel cele scurte le rup in doua.
  [/Test Programare Incrucisata/g, 'Elena Marinescu'],
  [/Test Pacient fara tel/g, 'Alina Georgescu'],
  [/Programare Manuala/g, 'Sorin Matei'],
  [/Test Programare/g, 'Andrei Ionescu'],
  [/Test overlap 2/gi, 'Cristina Dumitru'],
  [/Test Overlap/gi, 'Radu Constantin'],
  [/Test Patient/g, 'Mihai Stan'],
  [/Test welcome/gi, 'Diana Voicu'],
  [/test test/g, 'Ana Barbu'],
  [/Dr\. Test Cardiolog/g, 'Dr. Mihaela Dobre'],
  [/Test Cardiolog/g, 'Mihaela Dobre'],
  [/Dr\. Test Admin/g, 'Dr. Andrei Ionescu'],
  [/Test Admin/g, 'Andrei Ionescu'],
  [/Test Medgen/g, 'Radu Popa'],
  [/Pshiho Center Test/g, 'Centrul Medical Aurora'],
  [/Viva Med Test/g, 'Clinica Viva Med'],
  // Celule care contin DOAR cuvantul de test: ancorate, ca sa nu atingem "Clinica Viva Med" sau
  // etichetele din interfata care contin acelasi cuvant.
  [/^\s*Pacient Centru\s*$/, 'Georgescu'],
  [/^\s*Pacient\s*$/, 'Ionescu'],
  [/^\s*Trei\s*$/, 'Marinescu'],
  [/^\s*Test 2\s*$/, 'Andrei'],
  [/^\s*Test 3\s*$/, 'Elena'],
  [/^\s*Test\s*$/, 'Cristina'],
];

/**
 * CNP-urile se blureaza, nu se inlocuiesc. Chiar daca cele din baza de test sunt generate, un cod de 13
 * cifre care arata valid nu are ce cauta intr-un document public — iar un text inlocuit poate fi
 * confundat cu unul real. Blurul se aplica pe pixeli, inainte de captura, deci nu se poate reconstitui.
 */

/**
 * Ecranele fiecarui rol. `wait` este un selector dupa care stim ca pagina s-a incarcat cu date, nu doar
 * ca a raspuns; fara el prindem des scheletul gol. `act` face pasii suplimentari (deschis un modal etc).
 */
const SHOTS = {
  admin: [
    { name: '01-dashboard', url: '/dashboard', wait: 'text=Informații clinică' },
    { name: '02-doctori', url: '/doctors', wait: 'h1' },
    { name: '03-lista-programari', url: '/appointments', wait: 'h1', width: 1600 },
    { name: '04-calendar', url: '/admin/calendar', wait: 'h1', width: 1600 },
    { name: '05-agenda-clinicii', url: '/admin/clinic-agenda', wait: 'h1', width: 1700 },
    { name: '06-centre-tratament', url: '/treatment-centers', wait: 'h1' },
    { name: '07-pacienti-centru', url: '/admin/center-patients', wait: 'h1' },
    { name: '08-setari', url: '/settings', wait: 'h1' },
    {
      name: '09-setari-agenda', url: '/settings', wait: 'h1',
      act: async (page) => {
        const el = page.locator('text=Agenda comună a clinicii').first();
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(400);
      },
    },
    { name: '10-facturare', url: '/billing', wait: 'h1' },
  ],
  frontdesk: [
    { name: '01-dashboard', url: '/frontdesk/dashboard', wait: 'h1' },
    { name: '02-calendar', url: '/frontdesk/calendar', wait: 'h1' },
    { name: '03-programari', url: '/frontdesk/appointments', wait: 'h1' },
    { name: '04-pacienti', url: '/frontdesk/patients', wait: 'h1' },
  ],
  doctor: [
    { name: '01-dashboard', url: '/doctor/dashboard', wait: 'h1' },
    { name: '02-programarile-mele', url: '/doctor/appointments', wait: 'h1' },
    { name: '03-programul-meu', url: '/doctor/schedule', wait: 'h1' },
    { name: '04-agenda-clinicii', url: '/doctor/clinic-agenda', wait: 'h1' },
    { name: '05-sesiune-instant', url: '/doctor/instant-launch', wait: 'h1' },
    { name: '06-rapoarte', url: '/doctor/instant-reports', wait: 'h1' },
    { name: '07-profil', url: '/doctor/profile', wait: 'h1' },
  ],
  assistant: [
    { name: '01-sesiunile-mele', url: '/assistant', wait: 'h1' },
  ],
  patient: [
    { name: '01-dashboard', url: '/patient/dashboard', wait: 'h1' },
    { name: '02-programare-noua', url: '/patient/new-appointment', wait: 'h1' },
    { name: '03-notificari', url: '/patient/notifications', wait: 'h1' },
    { name: '04-profil', url: '/patient/profile', wait: 'h1' },
  ],
};

/** Adresele-substitut pe care le punem chiar noi raman lizibile: sunt deja anonime. */
const PLACEHOLDER_CONTACTS = ['admin@clinica.ro', 'utilizator@clinica.ro', 'asistent@centru.ro'];

/**
 * Blureaza CNP-uri, telefoane si adrese de e-mail inainte de captura.
 *
 * Blur, nu inlocuire: un numar inlocuit tot arata a data reala, iar cititorul nu poate sti ca e inventat.
 * Blurul e evident ca redactare si nu se poate reconstitui din imagine.
 *
 * Se scaneaza toate elementele fara copii. O lista scurta de etichete parea suficienta, dar rata exact
 * celulele care contau.
 */
async function blurSensitive(page, placeholders) {
  return page.evaluate((safe) => {
    const patterns = [
      /\d{13}/,                       // CNP
      /(\+4)?0\d{9}/,                 // telefon romanesc
      /[\w.+-]+@[\w-]+\.[\w.]+/,      // e-mail
    ];
    let blurred = 0;
    for (const el of document.querySelectorAll('*')) {
      if (el.children.length !== 0) continue;
      const text = (el.textContent || '').trim();
      if (!text || safe.includes(text)) continue;
      if (patterns.some((re) => re.test(text))) {
        el.style.setProperty('filter', 'blur(6px)', 'important');
        el.style.userSelect = 'none';
        blurred++;
      }
    }
    // Campurile de formular tin datele in `value`, nu ca text in pagina, deci bucla de mai sus nu le
    // vede. Profilul pacientului isi arata telefonul si CNP-ul exact asa.
    for (const field of document.querySelectorAll("input, textarea")) {
      const value = (field.value || "").trim();
      if (!value || safe.includes(value)) continue;
      if (patterns.some((re) => re.test(value))) {
        field.style.setProperty("filter", "blur(6px)", "important");
        blurred++;
      }
    }
    return blurred;
  }, placeholders);
}

/**
 * Inlocuieste numele care arata a date de test cu nume verosimile.
 *
 * Regulile pe nume complet nu ajung: prenumele si numele sunt randate in noduri separate, iar o
 * potrivire partiala lasa hibrizi de tipul "Cristina Programare Incrucisata". Aici inlocuim continutul
 * INTREGII celule si tinem minte corespondenta, ca acelasi pacient sa aiba acelasi nume pe toate
 * ecranele — altfel ghidul pare incoerent de la o imagine la alta.
 *
 * Restrans la celule de tabel: butoanele si etichetele interfetei contin aceleasi cuvinte
 * ("Programare noua") si nu trebuie atinse.
 */
async function prettifyNames(page, nameMap) {
  const updated = await page.evaluate((known) => {
    const POOL = ['Elena Marinescu', 'Andrei Ionescu', 'Cristina Dumitru', 'Radu Constantin',
                  'Alina Georgescu', 'Mihai Stan', 'Diana Voicu', 'Sorin Matei', 'Ana Barbu',
                  'George Pavel', 'Irina Neagu', 'Vlad Dobre'];
    const testish = /\b(test|overlap|programare|pacient|manual|welcome|patient)\b/i;
    // Datele de contact NU se ating aici: o adresa ca "pacient1@test.com" contine cuvantul "test"
    // si ar fi inlocuita cu un nume, transformand coloana de e-mail intr-una de nume. Ele se blureaza
    // separat, imediat dupa acest pas.
    const contact = /@|[0-9]{9}/;
    const map = new Map(Object.entries(known));
    for (const cell of document.querySelectorAll('td')) {
      if (cell.children.length !== 0) continue;
      const text = (cell.textContent || '').trim();
      if (!text || text.length > 40 || contact.test(text) || !testish.test(text)) continue;
      if (!map.has(text)) map.set(text, POOL[map.size % POOL.length]);
      cell.textContent = map.get(text);
    }
    return Object.fromEntries(map);
  }, nameMap);
  Object.assign(nameMap, updated);
}


async function redact(page) {
  await page.evaluate((rules) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      for (const [pattern, flags, replacement] of rules) {
        const re = new RegExp(pattern, flags);
        if (node.nodeValue && re.test(node.nodeValue)) {
          node.nodeValue = node.nodeValue.replace(re, replacement);
        }
      }
    }
    // Aceleasi reguli si peste campurile de formular, altfel titlul paginii arata numele inlocuit,
    // iar campul de dedesubt il arata pe cel original.
    for (const field of document.querySelectorAll("input, textarea")) {
      for (const [pattern, flags, replacement] of rules) {
        const re = new RegExp(pattern, flags);
        if (field.value && re.test(field.value)) field.value = field.value.replace(re, replacement);
      }
    }
  }, REDACTIONS.map(([re, replacement]) => [re.source, re.flags, replacement]));
}

async function captureRole(page, role, nameMap) {
  const dir = `${OUT}/${role}`;
  await mkdir(dir, { recursive: true });

  for (const shot of SHOTS[role]) {
    try {
      // Ecranele cu tabele largi (agenda, calendarul) au nevoie de mai multa latime, altfel coloanele
      // se inghesuie. Restul raman la 1280: o captura mai lata inseamna text mai mic in PDF.
      await page.setViewportSize({ width: shot.width ?? 1280, height: shot.height ?? 800 });
      await page.goto(BASE + shot.url, { waitUntil: 'networkidle', timeout: 20000 });
      if (shot.wait) await page.waitForSelector(shot.wait, { timeout: 10000 }).catch(() => {});
      if (shot.act) await shot.act(page);
      await page.waitForTimeout(600);          // lasa animatiile sa se aseze
      await redact(page);
      await prettifyNames(page, nameMap);
      // Blurul se aplica de doua ori: React re-randeaza dupa ce modificam DOM-ul si sterge stilurile
      // puse direct pe element. A doua trecere e imediat inainte de captura, cand arborele s-a asezat.
      await blurSensitive(page, PLACEHOLDER_CONTACTS);
      await page.waitForTimeout(400);
      const blurred = await blurSensitive(page, PLACEHOLDER_CONTACTS);
      console.log(`    [${blurred} date sensibile blurate]`);
      const path = `${dir}/${shot.name}.png`;
      await page.screenshot({ path });
      console.log(`  ${path}`);
    } catch (err) {
      // Un ecran inaccesibil (rol fara acces, ruta redenumita) nu trebuie sa opreasca restul.
      console.warn(`  ! ${shot.name}: ${err.message.split('\n')[0]}`);
    }
  }
}

const roles = process.argv.slice(2).filter((r) => SHOTS[r]);
if (process.argv.length > 2 && roles.length === 0) {
  console.error(`Roluri valide: ${Object.keys(SHOTS).join(', ')}`);
  process.exit(1);
}
const todo = roles.length ? roles : Object.keys(SHOTS);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  locale: 'ro-RO',
});
// Ghidurile sunt in romana, deci si capturile trebuie sa fie. Un context nou nu are preferinta salvata,
// iar detectorul de limba ar cadea pe engleza; o scriem inainte de prima incarcare a paginii.
await context.addInitScript(() => {
  try { localStorage.setItem('i18nextLng', 'ro'); } catch { /* pagina fara acces la storage */ }
});
const page = await context.newPage();
const rl = createInterface({ input: stdin, output: stdout });

// Aceeasi corespondenta nume-de-test -> nume verosimil pe toate rolurile si toate ecranele.
const nameMap = {};

try {
  for (const role of todo) {
    await page.goto(`${BASE}/login`);
    console.log(`\n=== ${role.toUpperCase()} ===`);
    await rl.question(`Autentifica-te ca ${role} in fereastra deschisa, apoi apasa Enter aici... `);
    await captureRole(page, role, nameMap);

    if (todo.indexOf(role) < todo.length - 1) {
      await page.goto(`${BASE}/login`);
      await context.clearCookies();
      await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }).catch(() => {});
    }
  }
} finally {
  rl.close();
  await browser.close();
}

console.log('\nGata. Verifica imaginile din public/screenshots/ inainte de a le pune in ghiduri.');
