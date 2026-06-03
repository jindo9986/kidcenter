#!/usr/bin/env python3
"""Generate the Open Graph link-preview image (1200x630) for the portfolio.

Usage: python3 og.py   (run from apps/portfolio)
Output: apps/portfolio/public/og.png
"""
import json, os, datetime
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CONTENT = os.path.join(ROOT, "content")
PUBLIC = os.path.join(ROOT, "public")
FD = os.path.join(HERE, "fonts")

BRAND = (55, 48, 163)
BRAND_L = (220, 218, 245)
GOLD = (232, 163, 23)
WHITE = (255, 255, 255)
TINT = (78, 70, 180)

def load(n):
    with open(os.path.join(CONTENT, n), encoding="utf-8") as f:
        return json.load(f)

profile = load("profile.json")
ach = load("achievements.json")
academic = load("academic.json")
character = load("character.json")

def font(name, size):
    return ImageFont.truetype(os.path.join(FD, f"BeVietnamPro-{name}.ttf"), size)

W, H = 1200, 630
img = Image.new("RGB", (W, H), BRAND)
d = ImageDraw.Draw(img)

# gold accent bar (bottom)
d.rectangle([0, H - 10, W, H], fill=GOLD)

# avatar circle (left)
av_path = os.path.join(PUBLIC, "media", "avatar.jpg")
AV = 300
ax, ay = 90, (H - AV) // 2 - 5
if os.path.exists(av_path):
    av = Image.open(av_path).convert("RGB").resize((AV, AV))
    mask = Image.new("L", (AV, AV), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, AV, AV], fill=255)
    # white ring
    d.ellipse([ax - 6, ay - 6, ax + AV + 6, ay + AV + 6], fill=WHITE)
    img.paste(av, (ax, ay), mask)

# right column
cx = ax + AV + 55
top = 120

d.text((cx, top), "HỒ SƠ NĂNG LỰC", font=font("SemiBold", 26), fill=GOLD)
name = profile["name"] + (f' ({profile["nickname"]})' if profile.get("nickname") else "")
d.text((cx, top + 38), name, font=font("ExtraBold", 60), fill=WHITE)

bd = profile["birthDate"]; y = bd.split("-")[0]
age = datetime.date.today().year - int(y) - ((datetime.date.today().month, datetime.date.today().day) < tuple(int(x) for x in bd.split("-")[1:3]))
d.text((cx, top + 112), f"{age} tuổi · {profile['school']['vi']}",
       font=font("Medium", 27), fill=BRAND_L)

# wrapped summary
def wrap(text, fnt, maxw):
    words = text.split(); lines = []; cur = ""
    for w in words:
        test = (cur + " " + w).strip()
        if d.textlength(test, font=fnt) <= maxw:
            cur = test
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines

sumfnt = font("Medium", 28)
maxw = W - cx - 70
tagline = "Yêu Khoa học, Toán học và Nghệ thuật — hướng tới Science Illustration."
lines = wrap(tagline, sumfnt, maxw)[:2]
sy = top + 168
for ln in lines:
    d.text((cx, sy), ln, font=sumfnt, fill=(235, 234, 250))
    sy += 39

# stat pills
qq = [a for a in ach if a["category"] in ("international", "national")]
stats = [
    f"{len(qq)} HC Olympic QG & QT",
    f"{len(academic)} năm Học sinh Xuất sắc",
    f"Cambridge: {character['level']['code']}",
]
pf = font("SemiBold", 23)
px = cx; py = sy + 18
for s in stats:
    tw = d.textlength(s, font=pf)
    pw = tw + 36
    if px + pw > W - 60:
        px = cx; py += 50
    d.rounded_rectangle([px, py, px + pw, py + 40], radius=20, fill=TINT)
    d.text((px + 18, py + 7), s, font=pf, fill=WHITE)
    px += pw + 12

out = os.path.join(PUBLIC, "og.png")
img.save(out, "PNG")
print(f"WROTE {out} ({os.path.getsize(out)//1024} KB, {W}x{H})")
