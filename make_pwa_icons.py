from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent
item = Image.open(ROOT / "assets" / "items" / "coffee-3.png").convert("RGBA")
out = ROOT / "assets" / "icons"
out.mkdir(exist_ok=True)

for size, name in ((180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    image = Image.new("RGBA", (size, size), "#f5b08f")
    draw = ImageDraw.Draw(image)
    pad = int(size * .055)
    draw.rounded_rectangle((pad, pad, size - pad, size - pad), radius=int(size * .22), fill="#fff5d8", outline="#e69770", width=max(2, size // 70))
    icon = item.copy()
    limit = int(size * .76)
    icon.thumbnail((limit, limit), Image.Resampling.LANCZOS)
    image.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
    image.convert("RGB").save(out / name, optimize=True)
