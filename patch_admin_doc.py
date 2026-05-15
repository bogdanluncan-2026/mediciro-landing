"""
Patch Ghid_Administrator_Clinica.docx — adaugă detalii Pas 1 + Pas 2 în secțiunea 1.2.
Inserează conținut NOU înainte de heading-ul 1.3, fără să atingă restul documentului.
"""

from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from lxml import etree

PATH = "public/docs/Ghid_Administrator_Clinica.docx"
doc = Document(PATH)

# ── Găsim paragraful heading 1.3 ─────────────────────────────────────────────
ref_para = None
for para in doc.paragraphs:
    if "1.3" in para.text:
        ref_para = para
        break

if ref_para is None:
    print("EROARE: Nu am găsit heading-ul 1.3 în document!")
    exit(1)

print(f"Am găsit 1.3: '{ref_para.text[:60]}'")

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

def make_run(text, bold=False, italic=False, size_pt=11, color_hex=None):
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    sz = OxmlElement('w:sz')
    sz.set(f'{{{W}}}val', str(int(size_pt * 2)))
    szCs = OxmlElement('w:szCs')
    szCs.set(f'{{{W}}}val', str(int(size_pt * 2)))
    rPr.append(sz)
    rPr.append(szCs)
    if bold:
        b = OxmlElement('w:b')
        rPr.append(b)
    if italic:
        i = OxmlElement('w:i')
        rPr.append(i)
    if color_hex:
        col = OxmlElement('w:color')
        col.set(f'{{{W}}}val', color_hex)
        rPr.append(col)
    r.append(rPr)
    t = OxmlElement('w:t')
    t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    t.text = text
    r.append(t)
    return r

def make_para(text, style_id=None, bold=False, italic=False, size_pt=11,
              color_hex=None, indent_cm=None):
    p = OxmlElement('w:p')
    pPr = OxmlElement('w:pPr')
    if style_id:
        pStyle = OxmlElement('w:pStyle')
        pStyle.set(f'{{{W}}}val', style_id)
        pPr.append(pStyle)
    if indent_cm is not None:
        ind = OxmlElement('w:ind')
        twips = int(indent_cm * 1440 / 2.54)
        ind.set(f'{{{W}}}left', str(twips))
        pPr.append(ind)
    p.append(pPr)
    p.append(make_run(text, bold=bold, italic=italic, size_pt=size_pt, color_hex=color_hex))
    return p

def insert(p_elem):
    """Inserează elementul XML ÎNAINTE de ref_para (care rămâne fix ca ancoră)."""
    ref_para._element.addprevious(p_elem)

def ins_plain(text, bold=False, italic=False, size_pt=11, color_hex=None, indent_cm=None):
    insert(make_para(text, bold=bold, italic=italic, size_pt=size_pt,
                     color_hex=color_hex, indent_cm=indent_cm))

def ins_bullet(text):
    insert(make_para(text, style_id='ListBullet', size_pt=11))

def ins_step(text):
    insert(make_para(text, style_id='ListNumber', size_pt=11))

def ins_spacer():
    insert(make_para(''))

def ins_note(text):
    p = OxmlElement('w:p')
    pPr = OxmlElement('w:pPr')
    ind = OxmlElement('w:ind')
    ind.set(f'{{{W}}}left', str(int(0.5 * 1440 / 2.54)))
    pPr.append(ind)
    p.append(pPr)
    p.append(make_run("Notă: ", bold=True, size_pt=10))
    p.append(make_run(text, italic=True, size_pt=10))
    insert(p)

def ins_subtitle(text):
    ins_plain(text, bold=True, size_pt=11, color_hex='1D4ED8')

# ── Inserăm în ordine INVERSĂ (ultimul paragraf dorit → primul) ───────────────

# Separator final
ins_spacer()

# Notă finală Pas 2
ins_note(
    "Adresa de email a clinicii introdusă la Pasul 2 este cea vizibilă pacienților "
    "(email de contact public). Poate fi diferită de emailul cu care te-ai înregistrat la Pasul 1."
)

# Pașii Pasul 2 (inserați invers)
ins_step('Apasă "Creează cont".')
ins_step(
    'Bifează cele 3 casete obligatorii: acceptarea Termenilor și condițiilor, '
    'a Politicii de confidențialitate și confirmarea că aplicația este în versiune beta.'
)
ins_step(
    'Email clinică (contact public) — adresa de email afișată pacienților '
    '(poate fi diferită de emailul personal de la Pasul 1).'
)
ins_step('Telefon clinică — numărul de telefon al cabinetului.')
ins_step(
    'Oraș — completat automat din hartă; verifică și corectează dacă este necesar.'
)
ins_step('Adresă — strada și numărul, completate automat din căutarea pe hartă.')
ins_step(
    'Caută adresa pe hartă — tastează adresa clinicii în câmpul de căutare și selectează '
    'din sugestii. Markerul roșu se va poziționa automat pe hartă. '
    'Poți trage markerul pentru a ajusta poziția exact.'
)
ins_step('CUI — codul unic de înregistrare al firmei (ex: RO12345678).')
ins_step('Numele clinicii — denumirea oficială a clinicii.')

# Titlu Pasul 2
ins_subtitle("Pasul 2 — Date clinică")
ins_spacer()

# Notă Pasul 1
ins_note(
    "Parola trebuie să conțină minim 8 caractere și să includă litere, cifre "
    "și cel puțin un caracter special."
)

# Pașii Pasul 1 (inserați invers)
ins_step('Apasă "Continuă" pentru a trece la Pasul 2.')
ins_step(
    'Confirmă parola — reintroduci parola pentru verificare. '
    'Dacă cele două parole nu coincid, vei vedea un mesaj de eroare.'
)
ins_step(
    'Parolă — alege o parolă sigură. '
    'Apasă pictograma ochi pentru a vedea sau ascunde textul introdus.'
)
ins_step('Adresă email — adresa cu care vei accesa platforma de fiecare dată.')
ins_step('Nume — numele de familie.')
ins_step('Prenume — prenumele administratorului de cont.')

# Titlu Pasul 1
ins_subtitle("Pasul 1 — Date cont")

# Intro
ins_plain("Înregistrarea are doi pași. Completează câmpurile în ordinea de mai jos:", size_pt=11)

# ── Salvare ───────────────────────────────────────────────────────────────────
doc.save(PATH)
print("✓ Document actualizat cu succes — conținut adăugat în 1.2, înainte de 1.3.")
print("  Restul documentului (imagini, modificări manuale) a fost păstrat intact.")
