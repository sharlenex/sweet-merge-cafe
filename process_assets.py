from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent / "assets"


def fit_square(image: Image.Image, size: int = 256, padding: int = 12) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        image = image.crop(bbox)
    limit = size - padding * 2
    image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(image, ((size - image.width) // 2, (size - image.height) // 2))
    return out


def split_items():
    source = Image.open(ROOT / "items-alpha.png").convert("RGBA")
    out_dir = ROOT / "items"
    out_dir.mkdir(exist_ok=True)
    types = ("coffee", "cake", "fruit")
    cell_w = source.width / 6
    cell_h = source.height / 3
    for row, item_type in enumerate(types):
        for col in range(6):
            box = (
                round(col * cell_w), round(row * cell_h),
                round((col + 1) * cell_w), round((row + 1) * cell_h),
            )
            fit_square(source.crop(box)).save(out_dir / f"{item_type}-{col}.png")


def split_characters():
    source = Image.open(ROOT / "characters-alpha.png").convert("RGBA")
    out_dir = ROOT / "characters"
    out_dir.mkdir(exist_ok=True)
    cell_w = source.width / 3
    for col in range(3):
        box = (round(col * cell_w), 0, round((col + 1) * cell_w), source.height)
        fit_square(source.crop(box), 384, 8).save(out_dir / f"customer-{col}.png")


def split_decor():
    source = Image.open(ROOT / "decor-alpha.png").convert("RGBA")
    out_dir = ROOT / "decor"
    out_dir.mkdir(exist_ok=True)
    cell_w = source.width / 3
    cell_h = source.height / 2
    for row in range(2):
        for col in range(3):
            box = (
                round(col * cell_w), round(row * cell_h),
                round((col + 1) * cell_w), round((row + 1) * cell_h),
            )
            fit_square(source.crop(box), 512, 10).save(out_dir / f"decor-{row * 3 + col}.png")


def split_machines():
    out_dir = ROOT / "machines"
    out_dir.mkdir(exist_ok=True)
    names = ("coffee", "cake", "fruit")
    for name in names:
        source = Image.open(ROOT / f"{name}-levels-alpha.png").convert("RGBA")
        cell_w = source.width / 4
        cell_h = source.height / 3
        for level in range(12):
            row, col = divmod(level, 4)
            box = (
                round(col * cell_w), round(row * cell_h),
                round((col + 1) * cell_w), round((row + 1) * cell_h),
            )
            fit_square(source.crop(box), 512, 4).save(out_dir / f"{name}-{level}.png")


if __name__ == "__main__":
    split_items()
    split_characters()
    split_decor()
    split_machines()
