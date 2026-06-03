#!/usr/bin/env python3
"""Generate favicons from the child's avatar (run from apps/portfolio).
Writes app/favicon.ico, app/icon.png (circular), app/apple-icon.png (square)."""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
APP = os.path.join(ROOT, "src", "app")
AV = os.path.join(ROOT, "public", "media", "avatar.jpg")

base = Image.open(AV).convert("RGBA").resize((512, 512))
mask = Image.new("L", (512, 512), 0)
ImageDraw.Draw(mask).ellipse([0, 0, 512, 512], fill=255)
circ = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
circ.paste(base, (0, 0), mask)

circ.save(os.path.join(APP, "icon.png"))
circ.save(os.path.join(APP, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
# Apple touch icon: square, opaque (iOS rounds the corners itself)
Image.open(AV).convert("RGB").resize((180, 180)).save(os.path.join(APP, "apple-icon.png"))
print("WROTE favicon.ico, icon.png, apple-icon.png in", APP)
