import json
import math
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
COURSE_JSON = ROOT / "public" / "data" / "course.json"
SOURCE_IMAGES = ROOT / "public" / "images" / "course"
OUT_DIR = ROOT / "public" / "images" / "lessons"

MODULE_IMAGE_MAP = {
    "M01": "laptop-home-workspace.jpg",
    "M02": "windows-desktop-screenshot.jpg",
    "M03": "keyboard-close-up.jpg",
    "M04": "file-explorer-screenshot.jpg",
    "M05": "wifi-router.jpg",
    "M06": "browser-address-screenshot.jpg",
    "M07": "email-inbox-screenshot.jpg",
    "M08": "laptop-home-workspace.jpg",
    "M09": "laptop-home-workspace.jpg",
    "M10": "laptop-home-workspace.jpg",
    "M11": "data-center.jpg",
    "M12": "multifunction-printer.jpg",
    "M13": "smartphone-camera.jpg",
    "M14": "smartphone-camera.jpg",
    "M15": "qr-code-safety-screenshot.jpg",
    "M16": "online-shopping-screenshot.jpg",
    "M17": "scam-sms-screenshot.jpg",
    "M18": "bank-login-screenshot.jpg",
    "M19": "ai-prompt-screenshot.jpg",
    "M20": "ai-prompt-screenshot.jpg",
    "M21": "ai-prompt-screenshot.jpg",
    "M22": "ai-prompt-screenshot.jpg",
    "M23": "scam-sms-screenshot.jpg",
    "M24": "data-center.jpg",
    "M25": "laptop-home-workspace.jpg",
}


def choose_base(module_id: str, title: str) -> str:
    lower = title.lower()
    if "keyboard" in lower or "typing" in lower:
        return "keyboard-close-up.jpg"
    if "mouse" in lower or "click" in lower:
        return "computer-mice.jpg"
    if "usb" in lower or "storage" in lower:
        return "usb-flash-drive.jpg"
    if "printer" in lower or "print" in lower:
        return "multifunction-printer.jpg"
    if "scanner" in lower or "scan" in lower:
        return "flatbed-scanner.jpg"
    if "browser" in lower or "website" in lower or "address" in lower:
        return "browser-address-screenshot.jpg"
    if "email" in lower or "gmail" in lower or "outlook" in lower:
        return "email-inbox-screenshot.jpg"
    if "wi-fi" in lower or "internet" in lower:
        return "wifi-router.jpg"
    if "bank" in lower:
        return "bank-login-screenshot.jpg"
    if "pay" in lower or "qr" in lower or "money" in lower:
        return "qr-code-safety-screenshot.jpg"
    if "shopping" in lower or "rakuten" in lower or "amazon" in lower:
        return "online-shopping-screenshot.jpg"
    if "scam" in lower or "security" in lower or "password" in lower:
        return "scam-sms-screenshot.jpg"
    if "phone" in lower or "android" in lower or "iphone" in lower:
        return "smartphone-camera.jpg"
    if "ai" in lower or "chatgpt" in lower or "gemini" in lower or "copilot" in lower:
        return "ai-prompt-screenshot.jpg"
    return MODULE_IMAGE_MAP.get(module_id, "laptop-home-workspace.jpg")


def cover_image(image: Image.Image, size: tuple[int, int], offset_seed: int):
    image = ImageOps.exif_transpose(image).convert("RGB")
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((math.ceil(image.width * scale), math.ceil(image.height * scale)))
    max_x = max(0, resized.width - target_w)
    max_y = max(0, resized.height - target_h)
    crop_x = int(max_x * ((offset_seed % 7) / 6))
    crop_y = int(max_y * (((offset_seed // 7) % 5) / 4))
    return resized.crop((crop_x, crop_y, crop_x + target_w, crop_y + target_h))


def create_visual(module, lesson, index: int):
    base_name = choose_base(module["id"], lesson["title"])
    base_path = SOURCE_IMAGES / base_name
    source = Image.open(base_path)
    canvas = cover_image(source, (1400, 850), index)
    canvas = ImageEnhance.Color(canvas).enhance(1.03)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    canvas = canvas.filter(ImageFilter.UnsharpMask(radius=1, percent=105, threshold=4))

    out = OUT_DIR / f"{lesson['id']}.jpg"
    canvas.convert("RGB").save(out, "JPEG", quality=90, optimize=True)


def main():
    course = json.loads(COURSE_JSON.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for module in course["modules"]:
        for lesson in module["lessons"]:
            count += 1
            create_visual(module, lesson, count)
    print(f"Generated {count} lesson visuals in {OUT_DIR}")


if __name__ == "__main__":
    main()
