from pathlib import Path
from collections import deque
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


def keep_primary_component(image: Image.Image) -> Image.Image:
    """Discard a neighbouring sprite fragment when a generated sheet overlaps cells."""
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    width, height = image.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    largest: list[int] = []

    for y in range(height):
        for x in range(width):
            start = y * width + x
            if visited[start] or pixels[x, y] < 80:
                continue
            visited[start] = 1
            queue = deque([start])
            component: list[int] = []
            while queue:
                point = queue.popleft()
                component.append(point)
                py, px = divmod(point, width)
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        neighbour = ny * width + nx
                        if not visited[neighbour] and pixels[nx, ny] >= 80:
                            visited[neighbour] = 1
                            queue.append(neighbour)
            if len(component) > len(largest):
                largest = component

    if not largest:
        return image
    cleaned = Image.new("L", image.size, 0)
    cleaned_pixels = cleaned.load()
    for point in largest:
        y, x = divmod(point, width)
        cleaned_pixels[x, y] = pixels[x, y]
    image.putalpha(cleaned)
    return image


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


def split_generated_chain(name: str):
    """Split a 5×3 generated ingredient sheet into 15 square item sprites."""
    source = Image.open(ROOT / f"{name}-levels-alpha.png").convert("RGBA")
    out_dir = ROOT / "items"
    out_dir.mkdir(exist_ok=True)
    cell_w = source.width / 5
    cell_h = source.height / 3
    # 给 AI 生成图标保留格间缓冲，避免相邻大件的装饰越界到本格。
    inset_x = round(cell_w * 0.07)
    inset_y = round(cell_h * 0.05)
    for level in range(15):
        row, col = divmod(level, 5)
        box = (
            round(col * cell_w + inset_x), round(row * cell_h + inset_y),
            round((col + 1) * cell_w - inset_x), round((row + 1) * cell_h - inset_y),
        )
        fit_square(keep_primary_component(source.crop(box))).save(out_dir / f"{name}-{level}.png")


if __name__ == "__main__":
    split_items()
    split_characters()
    split_decor()
    split_machines()
    for name in ("tea", "bread", "icecream", "chocolate"):
        if (ROOT / f"{name}-levels-alpha.png").exists():
            split_generated_chain(name)
