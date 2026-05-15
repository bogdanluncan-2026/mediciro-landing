"""
Patch Ghid_Administrator_Clinica.docx — adaugă detalii în secțiunea 3
(Prezentare generală + Rapoarte), inserând ÎNAINTE de heading-ul 4.
Nu modifică nimic din conținutul existent.
"""

from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.oxml import OxmlElement

PATH = "public/docs/Ghid_Administrator_Clinica.docx"
doc = Document(PATH)

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
XML = "http://www.w3.org/XML/1998/namespace"

# ── Găsim heading-ul secțiunii 4 ca ancoră de inserare ───────────────────────
ref_para = None
for para in doc.paragraphs:
    if para.text.strip().startswith("4.") and "doctor" in para.text.lower():
        ref_para = para
        break

if ref_para is None:
    print("EROARE: Nu am găsit heading-ul secțiunii 4!")
    exit(1)

print(f"Ancoră găsită: '{ref_para.text[:70]}'")

# ── Helpers XML ───────────────────────────────────────────────────────────────

def make_run(text, bold=False, italic=False, size_pt=11, color_hex=None):
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    sz = OxmlElement('w:sz');  sz.set(f'{{{W}}}val', str(int(size_pt * 2)))
    szCs = OxmlElement('w:szCs'); szCs.set(f'{{{W}}}val', str(int(size_pt * 2)))
    rPr.append(sz); rPr.append(szCs)
    if bold:
        rPr.append(OxmlElement('w:b'))
    if italic:
        rPr.append(OxmlElement('w:i'))
    if color_hex:
        col = OxmlElement('w:color')
        col.set(f'{{{W}}}val', color_hex)
        rPr.append(col)
    r.append(rPr)
    t = OxmlElement('w:t')
    t.set(f'{{{XML}}}space', 'preserve')
    t.text = text
    r.append(t)
    return r

def make_para_xml(text, style_id=None, bold=False, italic=False,
                  size_pt=11, color_hex=None, indent_cm=None):
    p = OxmlElement('w:p')
    pPr = OxmlElement('w:pPr')
    if style_id:
        ps = OxmlElement('w:pStyle')
        ps.set(f'{{{W}}}val', style_id)
        pPr.append(ps)
    if indent_cm:
        ind = OxmlElement('w:ind')
        ind.set(f'{{{W}}}left', str(int(indent_cm * 1440 / 2.54)))
        pPr.append(ind)
    p.append(pPr)
    p.append(make_run(text, bold=bold, italic=italic,
                      size_pt=size_pt, color_hex=color_hex))
    return p

def insert(p_elem):
    ref_para._element.addprevious(p_elem)

def ins(text, bold=False, italic=False, size_pt=11, color_hex=None, indent_cm=None):
    insert(make_para_xml(text, bold=bold, italic=italic, size_pt=size_pt,
                         color_hex=color_hex, indent_cm=indent_cm))

def ins_bullet(text, indent_cm=None):
    insert(make_para_xml(text, style_id='ListBullet', size_pt=11, indent_cm=indent_cm))

def ins_spacer():
    ins('')

def ins_subtitle(text):
    """Sub-titlu albastru bold pentru Prezentare generală / Rapoarte."""
    ins(text, bold=True, size_pt=11, color_hex='1D4ED8')

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

# ── Conținut nou — inserat în ordine INVERSĂ ──────────────────────────────────

ins_spacer()

# ── RAPOARTE ──────────────────────────────────────────────────────────────────
ins_note(
    "Venitul afișat reprezintă suma tarifelor consultațiilor finalizate introduse în platformă, "
    "nu încasările efective din casa de marcat."
)
ins_bullet("Venituri realizate — suma tarifelor consultațiilor finalizate în perioada selectată, exprimată în RON.")
ins_bullet("Pacienți noi — pacienți care au avut prima programare în perioada selectată. Pacienți recurenți — pacienți care au mai fost la clinică anterior.")
ins_bullet("Top specialități — specialitățile cu cele mai multe programări, în ordine descrescătoare.")
ins_bullet(
    "Distribuție status — grafic tip donut cu proporția programărilor pe statusuri "
    "(ex: Finalizate 90%, Anulate 10%)."
)
ins_bullet("Programări pe zi — grafic tip bară care arată câte programări au fost în fiecare zi din perioada selectată.")
ins_bullet("NEPREZENTARE — pacienți care nu s-au prezentat la consultație (No-show).")
ins_bullet("ANULATE — programări anulate de clinică sau de pacient.")
ins_bullet("FINALIZATE — consultații care au avut loc și au fost marcate ca finalizate.")
ins_bullet("TOTAL PROGRAMĂRI — numărul total de programări din perioada selectată.")
ins('', size_pt=6)  # mic spațiu
ins(
    "Rapoartele afișează întotdeauna datele pentru perioada și doctorul selectat din filtrele de sus.",
    italic=True, size_pt=10, color_hex='64748B'
)
ins(
    "Filtre disponibile: Doctor (toți sau un singur medic) și Perioadă — "
    "7 zile, 30 zile, 90 zile, Următoarele 7 zile, Următoarele 30 zile.",
    size_pt=11
)
ins_subtitle("3.2. Rapoarte")
ins_spacer()

# ── PREZENTARE GENERALĂ ───────────────────────────────────────────────────────
ins_note(
    "Apasă pe oricare dintre cele 3 carduri (Total doctori, Programări azi, În așteptare) "
    "pentru a extinde lista detaliată direct în dashboard."
)
ins_bullet(
    "Ultimele programări — lista cronologică a celor mai recente programări, "
    "cu data, ora, tipul consultației (fizică / teleconsultație) și statusul (badge colorat)."
)
ins_bullet(
    "În așteptare — numărul de programări primite online care nu au fost încă confirmate. "
    "Apasă cardul pentru a le vedea și confirma direct."
)
ins_bullet(
    "Programări azi — numărul total de consultații programate în ziua curentă."
)
ins_bullet(
    "Total doctori — numărul de medici activi înregistrați în clinică."
)
ins_bullet(
    "Informații clinică — cardul de sus afișează datele principale ale clinicii: "
    "Nume, Adresă, Email, CUI și Telefon."
)
ins(
    'Apasă butonul "Prezentare generală" (dreapta sus) pentru a vedea această vedere de ansamblu.',
    size_pt=11
)
ins_subtitle("3.1. Prezentare generală")
ins_spacer()

# Intro bloc
ins(
    'Ecranul principal are două moduri de vizualizare, accesibile din butoanele din dreapta sus: '
    '"Prezentare generală" și "Rapoarte".',
    size_pt=11
)

# ── Salvare ───────────────────────────────────────────────────────────────────
doc.save(PATH)
print("✓ Secțiunea 3 actualizată cu succes.")
print("  Conținut existent păstrat intact.")
