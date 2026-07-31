"""
Genereaza ghidurile MediciRO direct in PDF, din acelasi continut ca varianta .docx.

    python generate_pdf.py

Fiecare PDF are pagina de titlu, un cuprins cu numere de pagina reale (pe care se poate da click) si
o structura de semne de carte, astfel incat cititorul sa ajunga la functionalitatea cautata fie din
cuprins, fie din panoul lateral al cititorului de PDF.

De ce nu prin Word: conversia .docx -> PDF prin COM se blocheaza in context neinteractiv, iar o
dependenta de Office ar face documentatia imposibil de regenerat automat. Continutul ramane definit
o singura data, in generate_guides.py, si este importat aici.
"""

import os
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (BaseDocTemplate, Frame, Image, ListFlowable, ListItem,
                                NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer)
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.tableofcontents import TableOfContents

from generate_guides import ADMIN, ASSISTANT, DOCTOR, FRONTDESK, PATIENT

OUTPUT_DIR = "public/docs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Fonturile standard PDF (Helvetica) folosesc WinAnsi, care NU contine s si t cu virgula, nici a cu
# breve. Fara un font Unicode incorporat, diacriticele romanesti ies patrate negre — verificat.
FONT_CANDIDATES = [
    ("Calibri", "calibri.ttf", "calibrib.ttf", "calibrii.ttf", "calibriz.ttf"),
    ("Arial", "arial.ttf", "arialbd.ttf", "ariali.ttf", "arialbi.ttf"),
    ("DejaVuSans", "DejaVuSans.ttf", "DejaVuSans-Bold.ttf", "DejaVuSans-Oblique.ttf",
     "DejaVuSans-BoldOblique.ttf"),
]
FONT_DIRS = [r"C:\Windows\Fonts", "/usr/share/fonts/truetype/dejavu", "/usr/share/fonts/TTF"]


def register_font():
    """Incarca prima familie disponibila care contine diacriticele romanesti. Fara ea, opreste-te."""
    for family, regular, bold, italic, bolditalic in FONT_CANDIDATES:
        for directory in FONT_DIRS:
            path = os.path.join(directory, regular)
            if not os.path.exists(path):
                continue
            pdfmetrics.registerFont(TTFont(family, path))
            for suffix, filename in (("-Bold", bold), ("-Italic", italic), ("-BoldItalic", bolditalic)):
                candidate = os.path.join(directory, filename)
                pdfmetrics.registerFont(TTFont(family + suffix,
                                               candidate if os.path.exists(candidate) else path))
            registerFontFamily(family, normal=family, bold=family + "-Bold",
                               italic=family + "-Italic", boldItalic=family + "-BoldItalic")
            return family
    sys.exit("Niciun font Unicode gasit. Instaleaza DejaVu Sans sau ruleaza pe Windows (Calibri/Arial).")


FONT = register_font()
BOLD = FONT + "-Bold"
ITALIC = FONT + "-Italic"

BRAND = colors.HexColor("#1E3A8A")
MUTED = colors.HexColor("#64748B")
WARN = colors.HexColor("#B45309")

ACCENTS = {
    "admin": colors.HexColor("#1D4ED8"),
    "frontdesk": colors.HexColor("#059669"),
    "doctor": colors.HexColor("#7C3AED"),
    "assistant": colors.HexColor("#0E7490"),
    "patient": colors.HexColor("#EA580C"),
}


def styles():
    base = getSampleStyleSheet()
    s = {
        "body": ParagraphStyle("body", parent=base["BodyText"], fontName=FONT, fontSize=10.5,
                               leading=15.5, spaceAfter=7, textColor=colors.HexColor("#1F2937")),
        "h1": ParagraphStyle("h1", fontName=BOLD, fontSize=15, leading=19,
                             spaceBefore=18, spaceAfter=9, textColor=BRAND),
        "h2": ParagraphStyle("h2", fontName=BOLD, fontSize=11.5, leading=15,
                             spaceBefore=12, spaceAfter=5, textColor=colors.HexColor("#1D4ED8")),
        "note": ParagraphStyle("note", fontName=ITALIC, fontSize=9.5, leading=13.5,
                               leftIndent=12, spaceBefore=4, spaceAfter=9,
                               textColor=colors.HexColor("#334155"),
                               borderColor=colors.HexColor("#CBD5E1"), borderWidth=0,
                               borderPadding=0),
        "item": ParagraphStyle("item", parent=base["BodyText"], fontName=FONT, fontSize=10.5,
                               leading=15, spaceAfter=3),
        "coverBrand": ParagraphStyle("coverBrand", fontName=BOLD, fontSize=26,
                                     alignment=TA_CENTER, textColor=BRAND, spaceAfter=16),
        "coverTitle": ParagraphStyle("coverTitle", fontName=BOLD, fontSize=21,
                                     alignment=TA_CENTER, spaceAfter=10),
        "coverSub": ParagraphStyle("coverSub", fontName=FONT, fontSize=11.5,
                                   alignment=TA_CENTER, textColor=MUTED, spaceAfter=26),
        "coverFoot": ParagraphStyle("coverFoot", fontName=FONT, fontSize=9,
                                    alignment=TA_CENTER, textColor=MUTED),
        "tocTitle": ParagraphStyle("tocTitle", fontName=BOLD, fontSize=16,
                                   textColor=BRAND, spaceAfter=14),
        "caption": ParagraphStyle("caption", fontName=ITALIC, fontSize=8.5, leading=12,
                                  alignment=TA_CENTER, textColor=MUTED, spaceBefore=3, spaceAfter=12),
    }
    return s


class Guide(BaseDocTemplate):
    """Sablon cu doua pagini-tip: coperta (fara antet/subsol) si continut (cu subsol numerotat)."""

    def __init__(self, path, title, **kw):
        super().__init__(path, pagesize=A4, title=title, author="MediciRO",
                         leftMargin=2.4 * cm, rightMargin=2.4 * cm,
                         topMargin=2.2 * cm, bottomMargin=2.2 * cm, **kw)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[frame]),
            PageTemplate(id="content", frames=[frame], onPage=self._footer),
        ])
        self._doc_title = title

    def _footer(self, canvas, doc):
        canvas.saveState()
        canvas.setFont(FONT, 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(self.leftMargin, 1.35 * cm, self._doc_title)
        canvas.drawRightString(A4[0] - self.rightMargin, 1.35 * cm, str(doc.page - 1))
        canvas.setStrokeColor(colors.HexColor("#E2E8F0"))
        canvas.line(self.leftMargin, 1.75 * cm, A4[0] - self.rightMargin, 1.75 * cm)
        canvas.restoreState()

    def afterFlowable(self, flowable):
        """Alimenteaza cuprinsul si panoul de semne de carte cu fiecare titlu intalnit."""
        if not isinstance(flowable, Paragraph):
            return
        name = flowable.style.name
        if name not in ("h1", "h2"):
            return
        level = 0 if name == "h1" else 1
        text = flowable.getPlainText()
        key = f"ch{id(flowable)}"
        self.canv.bookmarkPage(key)
        self.canv.addOutlineEntry(text, key, level=level, closed=(level == 1))
        self.notify("TOCEntry", (level, text, self.page - 1, key))


def escape(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def flow(blocks, s):
    """Transforma continutul declarat in generate_guides.py in elemente ReportLab."""
    out = []
    for kind, value in blocks:
        if kind == "h1":
            out.append(Paragraph(escape(value), s["h1"]))
        elif kind == "h2":
            out.append(Paragraph(escape(value), s["h2"]))
        elif kind == "p":
            out.append(Paragraph(escape(value), s["body"]))
        elif kind in ("bullets", "steps"):
            items = [ListItem(Paragraph(escape(v), s["item"]), leftIndent=16) for v in value]
            out.append(ListFlowable(
                items,
                bulletType="1" if kind == "steps" else "bullet",
                bulletFontSize=9, leftIndent=16, bulletOffsetY=-1,
                bulletColor=MUTED, start="1" if kind == "steps" else None,
            ))
            out.append(Spacer(1, 6))
        elif kind == "note":
            out.append(Paragraph(f'<font color="#1E3A8A"><b>Notă:</b></font> {escape(value)}', s["note"]))
        elif kind == "warn":
            out.append(Paragraph(f'<font color="#B45309"><b>Atenție:</b></font> {escape(value)}', s["note"]))
        elif kind == "img":
            out.extend(picture(value, s))
        elif kind == "break":
            out.append(PageBreak())
    return out


def picture(value, s):
    """
    Insereaza o captura de ecran, scalata la latimea paginii. `value` este (cale, legenda).

    O captura lipsa nu opreste generarea: ghidul se produce fara ea, cu un avertisment in consola.
    Altfel, o redenumire de ruta in aplicatie ar bloca publicarea intregii documentatii.
    """
    path, caption = value
    if not os.path.exists(path):
        print(f"  ! lipseste captura {path}")
        return []
    reader = ImageReader(path)
    width_px, height_px = reader.getSize()
    max_width = A4[0] - 2 * 2.4 * cm
    width = min(max_width, width_px * 0.5)          # capturile sunt facute la scale 2
    height = width * height_px / width_px
    img = Image(path, width=width, height=height)
    img.hAlign = "CENTER"
    return [Spacer(1, 4), img, Paragraph(escape(caption), s["caption"])]


def build(filename, title, subtitle, accent, blocks):
    s = styles()
    s["coverTitle"].textColor = ACCENTS[accent]
    path = f"{OUTPUT_DIR}/{filename}"
    doc = Guide(path, title)

    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle("toc1", fontName=BOLD, fontSize=11, leading=19,
                       textColor=colors.HexColor("#111827")),
        ParagraphStyle("toc2", fontName=FONT, fontSize=10, leading=16, leftIndent=18,
                       textColor=colors.HexColor("#374151")),
    ]

    story = [
        Spacer(1, 5 * cm),
        Paragraph("MediciRO", s["coverBrand"]),
        Paragraph(escape(title), s["coverTitle"]),
        Paragraph(escape(subtitle), s["coverSub"]),
        Spacer(1, 3 * cm),
        Paragraph("mediciro.ro  ·  contact@mediciro.ro  ·  iulie 2026", s["coverFoot"]),
        NextPageTemplate("content"),
        PageBreak(),
        Paragraph("Cuprins", s["tocTitle"]),
        toc,
        PageBreak(),
    ]
    story += flow(blocks, s)

    # multiBuild: prima trecere colecteaza titlurile, a doua scrie numerele de pagina in cuprins.
    doc.multiBuild(story)
    print(f"  {path}")


if __name__ == "__main__":
    print("Generare PDF-uri MediciRO:")
    build("Ghid_Administrator_Clinica.pdf", "Ghid Administrator Clinică",
          "Configurarea și administrarea clinicii în MediciRO", "admin", ADMIN)
    build("Ghid_Receptie.pdf", "Ghid Recepție",
          "Programări, pacienți și lucrul zilnic la ghișeu", "frontdesk", FRONTDESK)
    build("Ghid_Medic.pdf", "Ghid Medic",
          "Program, programări, teleconsultații și agenda clinicii", "doctor", DOCTOR)
    build("Ghid_Asistent_Centru.pdf", "Ghid Asistent Centru de Tratament",
          "Primirea și desfășurarea sesiunilor instant", "assistant", ASSISTANT)
    build("Ghid_Pacient.pdf", "Ghid Pacient",
          "Programări online, teleconsultații și contul tău", "patient", PATIENT)
