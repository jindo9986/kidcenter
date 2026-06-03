#!/usr/bin/env python3
"""Generate a professional capability-profile PDF from the portfolio content.

Usage: python3 generate.py [vi|en]
Outputs: apps/portfolio/public/ho-so-nang-luc-<lang>.pdf
Run from the apps/portfolio directory.
"""
import json, os, sys, datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    Image, KeepTogether, NextPageTemplate, PageBreak, HRFlowable, Flowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

LANG = sys.argv[1] if len(sys.argv) > 1 else "vi"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))   # apps/portfolio
CONTENT = os.path.join(ROOT, "content")
PUBLIC = os.path.join(ROOT, "public")
FD = os.path.join(HERE, "fonts")

# ---- brand ----
BRAND = colors.HexColor("#3730A3")
BRAND_D = colors.HexColor("#2E2A82")
GOLD = colors.HexColor("#E8A317")
GOLD_M = colors.HexColor("#D4A017")
SILVER_M = colors.HexColor("#9CA3AF")
BRONZE_M = colors.HexColor("#B45309")
TEAL = colors.HexColor("#0D9488")
INK = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#6B7280")
PAPER = colors.HexColor("#FFFDF7")
TINT = colors.HexColor("#EEEDFA")      # light indigo
GOLDTINT = colors.HexColor("#FBF1DC")
LINE = colors.HexColor("#E5E7EB")

for name, fn in [("BV", "Regular"), ("BV-Med", "Medium"), ("BV-SB", "SemiBold"),
                 ("BV-B", "Bold"), ("BV-XB", "ExtraBold")]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(FD, f"BeVietnamPro-{fn}.ttf")))

def load(name):
    with open(os.path.join(CONTENT, name), encoding="utf-8") as f:
        return json.load(f)

profile = load("profile.json")
achievements = load("achievements.json")
academic = load("academic.json")
signature = load("signature.json")
overall = load("overall.json")
character = load("character.json")
journey = load("journey.json")

def t(L):
    if isinstance(L, dict):
        return L.get(LANG) or L.get("vi") or ""
    return L

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

S = {
  "vi": dict(
    doctitle="HỒ SƠ NĂNG LỰC", about="Giới thiệu", personality="Tính cách",
    skills="Kỹ năng", interests="Sở thích", strengths="Điểm mạnh nổi bật",
    signature="Một tổ hợp ít gặp", achievements="Thành tích nổi bật",
    academic="Kết quả học tập", honors="Danh hiệu", character="Phẩm chất Cambridge",
    journey="Hành trình phát triển", overall="Đánh giá tổng thể",
    future="Phù hợp định hướng", subject="Môn", civility="Văn minh",
    intl="Giải Quốc tế", natl="Giải Quốc gia", local="Cấp Trường & Thành phố",
    years="năm", age_unit="tuổi", born="Sinh", school_lbl="Trường", page="Trang",
    focus_lbl="Định hướng",
    cam="Chương trình Cambridge · Vinschool The Harmony",
    stat_medals="HC Olympic\nQuốc gia & Quốc tế", stat_gold="HC Vàng\nQuốc gia",
    stat_years="Năm liền\nHọc sinh Xuất sắc", stat_cam="Cambridge\nmức cao nhất",
    note_scale="Thang điểm /10 · — = không học môn đó năm ấy",
    allyears="Cả {n} năm", generated="Tạo ngày",
  ),
  "en": dict(
    doctitle="CAPABILITY PROFILE", about="About", personality="Personality",
    skills="Skills", interests="Interests", strengths="Key Strengths",
    signature="An Uncommon Combination", achievements="Achievements",
    academic="Academic Record", honors="Honors", character="Cambridge Learner Attributes",
    journey="Growth Journey", overall="Overall Assessment",
    future="Well suited to", subject="Subject", civility="Civility",
    intl="International", natl="National", local="School & City",
    years="yrs", age_unit="years old", born="Born", school_lbl="School", page="Page",
    focus_lbl="Focus",
    cam="Cambridge programme · Vinschool The Harmony",
    stat_medals="Olympiad medals\nNat'l & Int'l", stat_gold="National\ngold medals",
    stat_years="Years as\nExcellent Student", stat_cam="Cambridge\ntop level",
    note_scale="Scored out of 10 · — = not taken that year",
    allyears="All {n} years", generated="Generated",
  ),
}[LANG]

# ---- styles ----
def ps(name, **kw):
    kw.setdefault("fontName", "BV")
    kw.setdefault("fontSize", 9.5)
    kw.setdefault("leading", 14)
    kw.setdefault("textColor", INK)
    return ParagraphStyle(name, **kw)

st_body = ps("body")
st_small = ps("small", fontSize=8, leading=11.5, textColor=MUTED)
st_h1 = ps("h1", fontName="BV-XB", fontSize=14, leading=18, textColor=BRAND, spaceBefore=2, spaceAfter=2)
st_h1sub = ps("h1sub", fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=6)
st_h2 = ps("h2", fontName="BV-B", fontSize=10.5, leading=14, textColor=INK)
st_strong = ps("strong", fontName="BV-SB")
st_quote = ps("quote", fontName="BV-Med", fontSize=9.5, leading=14, textColor=colors.HexColor("#374151"))
st_chip = ps("chip", fontName="BV-SB", fontSize=8.5, leading=11, textColor=INK)

W, H = A4
MX = 18 * mm

def compute_stats():
    qq = [a for a in achievements if a["category"] in ("international", "national")]
    gold = [a for a in qq if a.get("medal") == "gold"]
    return [
        (str(len(qq)), S["stat_medals"]),
        (str(len(gold)), S["stat_gold"]),
        (str(len(academic)), S["stat_years"]),
        (character["level"]["code"], S["stat_cam"]),
    ]

def draw_cover(c, doc):
    from reportlab.lib.utils import ImageReader
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)
    # top banner
    bh = 95 * mm
    c.setFillColor(BRAND); c.rect(0, H - bh, W, bh, fill=1, stroke=0)
    c.setFillColor(GOLD); c.rect(0, H - bh - 3, W, 3, fill=1, stroke=0)
    # avatar circle
    av = os.path.join(PUBLIC, "media", "avatar.jpg")
    cx, cy, r = W / 2, H - 33 * mm, 19 * mm
    if os.path.exists(av):
        c.saveState()
        p = c.beginPath(); p.circle(cx, cy, r); c.clipPath(p, stroke=0, fill=0)
        c.drawImage(ImageReader(av), cx - r, cy - r, 2 * r, 2 * r,
                    preserveAspectRatio=True, mask='auto')
        c.restoreState()
        c.setStrokeColor(colors.white); c.setLineWidth(3); c.circle(cx, cy, r, stroke=1, fill=0)
    # kicker + name
    c.setFillColor(GOLD); c.setFont("BV-SB", 10)
    c.drawCentredString(cx, H - 58 * mm, S["doctitle"])
    name = profile["name"] + (f' ({profile["nickname"]})' if profile.get("nickname") else "")
    c.setFillColor(colors.white); c.setFont("BV-XB", 26)
    c.drawCentredString(cx, H - 70 * mm, name)
    # meta line
    bd = profile["birthDate"]; y, m, d = bd.split("-")
    age = datetime.date.today().year - int(y) - ((datetime.date.today().month, datetime.date.today().day) < (int(m), int(d)))
    c.setFillColor(colors.HexColor("#DCDAF5")); c.setFont("BV", 10.5)
    c.drawCentredString(cx, H - 79 * mm, f"{age} {S['age_unit']} · {S['born']} {d}/{m}/{y}")
    c.setFont("BV-Med", 10.5); c.setFillColor(colors.white)
    c.drawCentredString(cx, H - 86 * mm, t(profile["school"]))

    # summary
    c.setFillColor(INK)
    fr = Frame(MX + 6 * mm, H - bh - 34 * mm, W - 2 * MX - 12 * mm, 28 * mm, showBoundary=0,
               leftPadding=0, rightPadding=0, topPadding=6, bottomPadding=0)
    para = Paragraph(esc(t(profile["summary"])),
                     ps("cov", fontName="BV-Med", fontSize=11, leading=16,
                        textColor=INK, alignment=TA_CENTER))
    fr.addFromList([para], c)

    # focus line
    focus = "  ·  ".join(t(f) for f in profile["focus"])
    c.setFillColor(BRAND); c.setFont("BV-SB", 11.5)
    c.drawCentredString(cx, H - bh - 44 * mm, focus)

    # stat row
    stats = compute_stats()
    n = len(stats); gap = 4 * mm; bw = (W - 2 * MX - (n - 1) * gap) / n
    by = 96 * mm; bhh = 24 * mm
    for i, (val, lbl) in enumerate(stats):
        x = MX + i * (bw + gap)
        c.setFillColor(TINT); c.roundRect(x, by, bw, bhh, 4, fill=1, stroke=0)
        c.setFillColor(BRAND); c.setFont("BV-XB", 19)
        c.drawCentredString(x + bw / 2, by + bhh - 11 * mm, val)
        c.setFillColor(MUTED); c.setFont("BV-SB", 6.6)
        for j, line in enumerate(lbl.split("\n")):
            c.drawCentredString(x + bw / 2, by + 7 * mm - j * 3.4 * mm, line)
    # footer note
    c.setFillColor(MUTED); c.setFont("BV", 8)
    today = datetime.date.today().strftime("%d/%m/%Y")
    c.drawCentredString(cx, 14 * mm, f"{S['generated']}: {today}  ·  jindo9986.github.io/kidcenter")

def header_footer(c, doc):
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)
    # header
    name = profile["name"] + (f' ({profile["nickname"]})' if profile.get("nickname") else "")
    c.setFillColor(MUTED); c.setFont("BV-SB", 8)
    c.drawString(MX, H - 12 * mm, name)
    c.setFont("BV", 8)
    c.drawRightString(W - MX, H - 12 * mm, S["doctitle"])
    c.setStrokeColor(LINE); c.setLineWidth(0.6); c.line(MX, H - 14 * mm, W - MX, H - 14 * mm)
    # footer
    c.setStrokeColor(LINE); c.line(MX, 13 * mm, W - MX, 13 * mm)
    c.setFillColor(MUTED); c.setFont("BV", 8)
    c.drawString(MX, 9 * mm, "Đào Đình Hữu (Tin)")
    c.drawRightString(W - MX, 9 * mm, f"{S['page']} {doc.page - 1}")

# ---- flowable helpers ----
def H1(title, sub=None):
    items = [Paragraph(esc(title), st_h1),
             HRFlowable(width="100%", thickness=2, color=GOLD, spaceBefore=1, spaceAfter=0, lineCap="round")]
    if sub:
        items.append(Spacer(1, 3))
        items.append(Paragraph(esc(sub), st_h1sub))
    else:
        items.append(Spacer(1, 6))
    return items

def chips_row(label, items):
    txt = "  ".join(f'<font face="BV-SB" color="#1F2937">{esc(t(x))}</font>' for x in items)
    return Paragraph(f'<font face="BV-SB" color="#6B7280" size="8">{esc(label)}:</font>  {txt}', ps("c", fontSize=9, leading=15))

def card_table(rows, col_widths, style_extra=None, bg=colors.white, border=LINE, pad=7):
    tb = Table(rows, colWidths=col_widths)
    sty = [
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.7, border),
        ("LEFTPADDING", (0, 0), (-1, -1), pad), ("RIGHTPADDING", (0, 0), (-1, -1), pad),
        ("TOPPADDING", (0, 0), (-1, -1), pad), ("BOTTOMPADDING", (0, 0), (-1, -1), pad),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]
    if style_extra:
        sty += style_extra
    tb.setStyle(TableStyle(sty))
    return tb

story = []
story += [NextPageTemplate("body"), Spacer(1, 1), PageBreak()]

# ---- About ----
story += H1(S["about"])
story.append(Paragraph(esc(t(profile["bio"])), st_body))
story.append(Spacer(1, 6))
story.append(chips_row(S["personality"], profile["personality"]))
story.append(Spacer(1, 3))
story.append(chips_row(S["skills"], profile["skills"]))
story.append(Spacer(1, 3))
story.append(chips_row(S["interests"], profile["interests"]))
story.append(Spacer(1, 14))

# ---- Strengths ----
story += H1(S["strengths"])
cells = []
for s in profile["strengths"]:
    p = Paragraph(
        f'<font face="BV-B" color="#1F2937" size="10">{esc(t(s["title"]))}</font><br/>'
        f'<font color="#4B5563" size="9">{esc(t(s["detail"]))}</font>',
        ps("s", leading=13))
    cells.append(p)
# 2-col grid
rows = [[cells[i], cells[i + 1] if i + 1 < len(cells) else ""] for i in range(0, len(cells), 2)]
gw = (W - 2 * MX - 6) / 2
tb = Table(rows, colWidths=[gw, gw])
tb.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
    ("ROUNDEDCORNERS", [6, 6, 6, 6]),
]))
story.append(tb)
story.append(Spacer(1, 14))

# ---- Signature ----
story += H1(S["signature"], t({"vi": "Logic + Nghệ thuật + Ngôn ngữ → Science Illustration",
                               "en": "Logic + Art + Language → Science Illustration"}))
story.append(Paragraph(esc(t(signature["thesis"])), st_body))
story.append(Spacer(1, 8))
pcells = []
for p in signature["pieces"]:
    pcells.append(Paragraph(
        f'<font face="BV-B" color="#3730A3" size="10">{esc(t(p["label"]))}</font><br/>'
        f'<font color="#4B5563" size="8.5">{esc(t(p["detail"]))}</font>',
        ps("p", leading=12, alignment=TA_CENTER)))
pw = (W - 2 * MX - 12) / 3
ptb = Table([pcells], colWidths=[pw, pw, pw])
ptb.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
    ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
story.append(ptb)
story.append(Spacer(1, 3))
story.append(Paragraph("&#8595;", ps("arrow", fontSize=14, leading=16, textColor=BRAND, alignment=TA_CENTER)))
story.append(Spacer(1, 3))
out = signature["outcome"]
oc = Paragraph(
    f'<font face="BV-XB" color="#3730A3" size="13">{esc(t(out["label"]))}</font><br/>'
    f'<font color="#374151" size="9">{esc(t(out["detail"]))}</font>', ps("o", leading=15))
story.append(card_table([[oc]], [W - 2 * MX], bg=TINT, border=BRAND, pad=10))
story.append(Spacer(1, 14))

story.append(PageBreak())

# ---- Achievements ----
story += H1(S["achievements"])
MEDAL_C = {"gold": GOLD_M, "silver": SILVER_M, "bronze": BRONZE_M, "none": MUTED}
RANK = {"gold": 0, "silver": 1, "bronze": 2, "none": 3}
cat_map = [("international", S["intl"]), ("national", S["natl"]), ("local", S["local"])]
for cat, lbl in cat_map:
    grp = sorted([a for a in achievements if a["category"] == cat],
                 key=lambda a: RANK.get(a.get("medal", "none"), 3))
    if not grp:
        continue
    story.append(Paragraph(f'{esc(lbl)} <font color="#6B7280" size="8.5">({len(grp)})</font>', st_h2))
    story.append(Spacer(1, 2))
    rows = []
    for a in grp:
        mc = MEDAL_C.get(a.get("medal", "none"), MUTED)
        mhex = "#" + mc.hexval()[2:]
        yr = a.get("year", "")
        title = Paragraph(
            f'<font color="{mhex}">&#9679;</font> '
            f'<font color="#1F2937" size="9">{esc(t(a["title"]))}</font>', ps("a", leading=13))
        rows.append([title, Paragraph(f'<font color="#9CA3AF" size="8">{esc(yr)}</font>',
                                      ps("y", leading=12, alignment=TA_LEFT))])
    tb = Table(rows, colWidths=[W - 2 * MX - 24 * mm, 24 * mm])
    tb.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(tb)
    story.append(Spacer(1, 8))
story.append(Spacer(1, 6))

# ---- Academic ----
story += H1(S["academic"], S["cam"])
# honors
hon_seen = {}
for rec in academic:
    for h in rec.get("honors", []):
        hon_seen.setdefault(t(h["label"]), 0)
        hon_seen[t(h["label"])] += 1
if hon_seen:
    parts = []
    for lab, cnt in hon_seen.items():
        ctx = S["allyears"].format(n=len(academic)) if cnt == len(academic) else f"{cnt} {S['years']}"
        parts.append(f'<font face="BV-SB" color="#1F2937">★ {esc(lab)}</font> '
                     f'<font color="#6B7280" size="8">· {esc(ctx)}</font>')
    story.append(card_table([[Paragraph("&nbsp;&nbsp;&nbsp;".join(parts), ps("h", leading=15))]],
                            [W - 2 * MX], bg=GOLDTINT, border=GOLD, pad=8))
    story.append(Spacer(1, 8))
# matrix
years = list(reversed(academic))
subj_order, seen = [], set()
for yobj in years:
    for s in yobj["subjects"]:
        k = s["subject"]["en"]
        if k not in seen:
            seen.add(k); subj_order.append((k, s["subject"]))
def strip_cam(L):
    return {kk: vv.replace(" (Cambridge)", "") for kk, vv in L.items()}
def cell_para(val, color, bold=True):
    f = "BV-XB" if bold else "BV"
    return Paragraph(f'<font face="{f}" color="{color}">{esc(val)}</font>',
                     ps("cell", alignment=TA_CENTER, leading=12))
head = [cell_para(S["subject"], "#6B7280", False)] + [cell_para(t(y["grade"]), "#1F2937") for y in years]
trows = [head]
for k, lab in subj_order:
    row = [Paragraph(f'<font color="#1F2937" size="9">{esc(t(strip_cam(lab)))}</font>', ps("rl", leading=12))]
    for y in years:
        m = next((s for s in y["subjects"] if s["subject"]["en"] == k), None)
        if m and m.get("score"):
            col = "#3730A3" if m["score"] == "10" else "#A16207"
            row.append(cell_para(m["score"], col))
        elif m and m.get("level"):
            row.append(cell_para(t({"vi": "Tốt", "en": "Good"}) if m["level"] == "T" else t({"vi": "Đạt", "en": "Pass"}), "#0D9488", False))
        else:
            row.append(cell_para("—", "#9CA3AF", False))
    trows.append(row)
# civility row
crow = [Paragraph(f'<font color="#6B7280" size="8">{esc(S["civility"])} /100</font>', ps("cl", leading=11))]
for y in years:
    crow.append(cell_para((y.get("civility", "—") or "—").split("/")[0], "#0D9488", False))
trows.append(crow)
nc = len(years)
sw = 26 * mm
cw = [W - 2 * MX - nc * sw] + [sw] * nc
mt = Table(trows, colWidths=cw, repeatRows=1)
mt.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("BACKGROUND", (0, 0), (-1, 0), TINT),
    ("LINEBELOW", (0, 0), (-1, 0), 1, BRAND),
    ("LINEBELOW", (0, 1), (-1, -1), 0.5, LINE),
    ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (0, -1), 6),
]))
story.append(KeepTogether([mt, Spacer(1, 3), Paragraph(esc(S["note_scale"]), st_small)]))
story.append(Spacer(1, 14))

# ---- Character ----
story += H1(S["character"], t(character["allYearsNote"]))
lvl = character["level"]
attr_cells = []
for a in character["attributes"]:
    attr_cells.append(Paragraph(
        f'<font face="BV-XB" color="#3730A3">{esc(lvl["code"])}</font> &nbsp;'
        f'<font face="BV-B" color="#1F2937" size="9.5">{esc(t(a["keyword"]))}</font><br/>'
        f'<font color="#6B7280" size="8">{esc(t(a["desc"]))}</font>', ps("at", leading=12)))
rows = [[attr_cells[i], attr_cells[i + 1] if i + 1 < len(attr_cells) else ""] for i in range(0, len(attr_cells), 2)]
gw = (W - 2 * MX - 6) / 2
at = Table(rows, colWidths=[gw, gw])
at.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (-1, -1), TINT),
    ("BOX", (0, 0), (-1, -1), 0.7, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.7, colors.white),
    ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ("ROUNDEDCORNERS", [6, 6, 6, 6]),
]))
story.append(at)
story.append(Spacer(1, 14))

# ---- Journey ----
story += H1(S["journey"])
for m in journey:
    story.append(Paragraph(
        f'<font face="BV-B" color="#1F2937" size="9.5">{esc(t(m["title"]))}</font> '
        f'<font color="#9CA3AF" size="8">· {esc(m.get("date",""))}</font><br/>'
        f'<font color="#4B5563" size="9">{esc(t(m["body"]))}</font>', ps("j", leading=13, spaceAfter=7)))
story.append(Spacer(1, 10))

# ---- Overall ----
sep = ' <font color="#C7C2EA">·</font> '
ff = sep.join(f'<font face="BV-SB" color="#3730A3">{esc(t(x))}</font>' for x in overall["futureFields"])
overall_block = H1(S["overall"])
overall_block.append(card_table([[Paragraph(
    f'<font face="BV-SB" color="#1F2937" size="11">{esc(t(overall["verdict"]))}</font><br/><br/>'
    f'<font color="#4B5563" size="9.5">{esc(t(overall["placement"]))}</font>', ps("v", leading=16))]],
    [W - 2 * MX], bg=colors.white, border=BRAND, pad=11))
overall_block.append(Spacer(1, 7))
overall_block.append(Paragraph(f'<font face="BV-SB" color="#6B7280" size="8.5">{esc(S["future"])}:</font>  {ff}',
                               ps("ff", fontSize=9, leading=17)))
if overall.get("growthNote"):
    overall_block.append(Spacer(1, 7))
    overall_block.append(card_table([[Paragraph(esc(t(overall["growthNote"])), ps("g", fontSize=9, leading=13, textColor=colors.HexColor("#4B5563")))]],
                                    [W - 2 * MX], bg=GOLDTINT, border=GOLD, pad=8))
story.append(KeepTogether(overall_block))

out_path = os.path.join(PUBLIC, f"ho-so-nang-luc-{LANG}.pdf")
doc = BaseDocTemplate(
    out_path, pagesize=A4, title=f"{S['doctitle']} — {profile['name']}",
    author=profile["name"], subject="Capability profile",
    leftMargin=MX, rightMargin=MX, topMargin=20 * mm, bottomMargin=18 * mm)
cover_frame = Frame(0, 0, W, H, id="cover", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
body_frame = Frame(MX, 16 * mm, W - 2 * MX, H - 20 * mm - 16 * mm, id="body",
                   leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([
    PageTemplate(id="cover", frames=[cover_frame], onPage=draw_cover),
    PageTemplate(id="body", frames=[body_frame], onPage=header_footer),
])
doc.build(story)
print(f"WROTE {out_path} ({os.path.getsize(out_path)//1024} KB)")
