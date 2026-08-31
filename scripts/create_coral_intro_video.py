"""Cria o vídeo vertical de apresentação da Coral a partir dos quadros aprovados."""

from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CORAL_DIR = ROOT / "public" / "images" / "coral" / "apresentacao"
BRAND_DIR = ROOT / "public" / "brand" / "png"
VIDEO_DIR = ROOT / "public" / "videos" / "coral"
TOOLS_DIR = ROOT / ".tools" / "video" / "imageio_ffmpeg" / "binaries"

WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 10.0
FRAME_COUNT = int(FPS * DURATION)
SCENE_DURATION = 2.5
CROSSFADE = 0.34

SCENES = [
    (CORAL_DIR / "coral-apresentacao-01-oi-9x16-v1.png", "Oi! Eu sou a Coral,"),
    (CORAL_DIR / "coral-apresentacao-02-eu-sou-coral-9x16-v1.png", "da Maré Coral."),
    (
        CORAL_DIR / "coral-apresentacao-03-vem-com-a-gente-9x16-v1.png",
        "Vem com a gente nessa jornada fitness",
    ),
    (
        CORAL_DIR / "coral-apresentacao-04-jornada-fitness-9x16-v1.png",
        "Vista o treino. Sinta a maré.",
    ),
]


def find_ffmpeg() -> Path:
    matches = sorted(TOOLS_DIR.glob("ffmpeg-*.exe"))
    if not matches:
        raise FileNotFoundError(f"FFmpeg não encontrado em {TOOLS_DIR}")
    return matches[0]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size=size)


def cover(image: Image.Image) -> Image.Image:
    ratio = max(WIDTH / image.width, HEIGHT / image.height)
    size = (math.ceil(image.width * ratio), math.ceil(image.height * ratio))
    resized = image.resize(size, Image.Resampling.LANCZOS)
    left = (resized.width - WIDTH) // 2
    top = (resized.height - HEIGHT) // 2
    return resized.crop((left, top, left + WIDTH, top + HEIGHT)).convert("RGB")


def ken_burns(base: Image.Image, progress: float, scene_index: int) -> Image.Image:
    eased = progress * progress * (3 - 2 * progress)
    zoom = 1.0 + (0.025 + scene_index * 0.002) * eased
    scaled = base.resize(
        (math.ceil(WIDTH * zoom), math.ceil(HEIGHT * zoom)),
        Image.Resampling.LANCZOS,
    )
    horizontal_bias = (-1, 1, -1, 1)[scene_index] * int(9 * eased)
    vertical_bias = int(7 * (0.5 - eased))
    left = max(0, min(scaled.width - WIDTH, (scaled.width - WIDTH) // 2 + horizontal_bias))
    top = max(0, min(scaled.height - HEIGHT, (scaled.height - HEIGHT) // 2 + vertical_bias))
    return scaled.crop((left, top, left + WIDTH, top + HEIGHT))


def fade_value(progress: float) -> float:
    edge = 0.16
    return min(1.0, progress / edge, (1.0 - progress) / edge)


def rounded_overlay(
    frame: Image.Image,
    box: tuple[int, int, int, int],
    fill: tuple[int, int, int, int],
    radius: int,
    shadow: bool = True,
) -> Image.Image:
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    if shadow:
        shadow_box = (box[0] + 4, box[1] + 8, box[2] + 4, box[3] + 8)
        draw.rounded_rectangle(shadow_box, radius=radius, fill=(22, 34, 40, 45))
    draw.rounded_rectangle(box, radius=radius, fill=fill)
    return Image.alpha_composite(frame.convert("RGBA"), overlay)


def decorate(
    frame: Image.Image,
    logo: Image.Image,
    caption: str,
    opacity: float,
    scene_index: int,
) -> Image.Image:
    out = frame.convert("RGBA")

    logo_width = 420
    logo_height = round(logo.height * logo_width / logo.width)
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    logo_alpha = logo_resized.getchannel("A").point(lambda value: int(value * 0.96))
    logo_resized.putalpha(logo_alpha)
    logo_box = (38, 38, 38 + logo_width + 38, 38 + logo_height + 30)
    out = rounded_overlay(out, logo_box, (255, 251, 246, 218), radius=32)
    out.alpha_composite(logo_resized, dest=(76, 53))

    caption_font = font("segoeuib.ttf", 48 if scene_index != 2 else 43)
    caption = caption.upper() if scene_index == 3 else caption
    draw = ImageDraw.Draw(out)
    text_box = draw.textbbox((0, 0), caption, font=caption_font)
    text_width = text_box[2] - text_box[0]
    max_width = 900
    if text_width > max_width:
        words = caption.split()
        lines: list[str] = []
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            candidate_box = draw.textbbox((0, 0), candidate, font=caption_font)
            if candidate_box[2] - candidate_box[0] <= max_width or not current:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        caption = "\n".join(lines[:2])

    text_box = draw.multiline_textbbox((0, 0), caption, font=caption_font, spacing=10, align="center")
    text_width = text_box[2] - text_box[0]
    text_height = text_box[3] - text_box[1]
    padding_x = 40
    padding_y = 25
    x0 = (WIDTH - text_width) // 2 - padding_x
    y0 = HEIGHT - text_height - 92 - padding_y * 2
    x1 = x0 + text_width + padding_x * 2
    y1 = y0 + text_height + padding_y * 2
    alpha = int(228 * max(0.0, min(1.0, opacity)))
    out = rounded_overlay(out, (x0, y0, x1, y1), (253, 93, 42, alpha), radius=35)
    draw = ImageDraw.Draw(out)
    draw.multiline_text(
        ((WIDTH - text_width) // 2, y0 + padding_y - text_box[1]),
        caption,
        font=caption_font,
        fill=(255, 255, 255, int(255 * opacity)),
        spacing=10,
        align="center",
    )

    return out.convert("RGB")


def build_frame(
    time_seconds: float,
    bases: list[Image.Image],
    logo: Image.Image,
) -> Image.Image:
    scene_index = min(len(SCENES) - 1, int(time_seconds / SCENE_DURATION))
    scene_start = scene_index * SCENE_DURATION
    local_progress = min(1.0, max(0.0, (time_seconds - scene_start) / SCENE_DURATION))
    current = ken_burns(bases[scene_index], local_progress, scene_index)

    if scene_index > 0 and time_seconds - scene_start < CROSSFADE:
        blend = (time_seconds - scene_start) / CROSSFADE
        previous = ken_burns(bases[scene_index - 1], 1.0, scene_index - 1)
        current = Image.blend(previous, current, max(0.0, min(1.0, blend)))

    caption_opacity = fade_value(local_progress)
    return decorate(current, logo, SCENES[scene_index][1], caption_opacity, scene_index)


def create_music_bed(path: Path) -> None:
    sample_rate = 44_100
    time = np.arange(int(DURATION * sample_rate), dtype=np.float64) / sample_rate
    music = np.zeros_like(time)

    chords = [
        (220.0, 277.18, 329.63),
        (196.0, 246.94, 329.63),
        (174.61, 220.0, 293.66),
        (196.0, 246.94, 293.66),
    ]
    for index, frequencies in enumerate(chords):
        start = index * SCENE_DURATION
        mask = (time >= start) & (time < start + SCENE_DURATION)
        local = time[mask] - start
        envelope = np.minimum(1.0, local / 0.55) * np.minimum(1.0, (SCENE_DURATION - local) / 0.7)
        chord = sum(np.sin(2 * np.pi * frequency * local) for frequency in frequencies) / 3
        music[mask] += 0.08 * envelope * chord

        chime = np.exp(-local * 2.8) * (
            np.sin(2 * np.pi * frequencies[1] * 2 * local)
            + 0.45 * np.sin(2 * np.pi * frequencies[2] * 2 * local)
        )
        music[mask] += 0.035 * chime

    master_fade = np.minimum(1.0, time / 0.8) * np.minimum(1.0, (DURATION - time) / 1.0)
    music *= np.clip(master_fade, 0.0, 1.0)
    samples = np.int16(np.clip(music, -1.0, 1.0) * 32767)

    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(samples.tobytes())


def main() -> None:
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    ffmpeg = find_ffmpeg()
    output = VIDEO_DIR / "mare-coral-apresentacao-coral-10s-v1.mp4"
    poster = VIDEO_DIR / "mare-coral-apresentacao-coral-10s-v1-poster.jpg"
    narration = VIDEO_DIR / "coral-locucao-v2.wav"
    music = VIDEO_DIR / "coral-trilha-ambiente-v1.wav"

    missing = [str(path) for path, _ in SCENES if not path.exists()]
    if missing:
        raise FileNotFoundError("Quadros ausentes: " + ", ".join(missing))
    if not narration.exists():
        raise FileNotFoundError(f"Locução ausente: {narration}")

    bases = [cover(Image.open(path).convert("RGB")) for path, _ in SCENES]
    logo = Image.open(BRAND_DIR / "logo-horizontal.png").convert("RGBA")
    create_music_bed(music)
    build_frame(0.9, bases, logo).save(poster, quality=92, subsampling=0)

    command = [
        str(ffmpeg),
        "-y",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-i",
        str(narration),
        "-i",
        str(music),
        "-filter_complex",
        (
            "[1:a]adelay=delays=250:all=1,apad,atrim=0:10,volume=1.0,"
            "afade=t=in:st=0.25:d=0.12,afade=t=out:st=9.45:d=0.4[voice];"
            "[2:a]atrim=0:10,volume=0.55,afade=t=in:st=0:d=0.8,"
            "afade=t=out:st=9:d=1[music];"
            "[voice][music]amix=inputs=2:duration=longest:dropout_transition=0[audio]"
        ),
        "-map",
        "0:v:0",
        "-map",
        "[audio]",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "18",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-ar",
        "44100",
        "-t",
        f"{DURATION:.3f}",
        "-movflags",
        "+faststart",
        str(output),
    ]

    process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert process.stdin is not None
    for frame_index in range(FRAME_COUNT):
        time_seconds = frame_index / FPS
        frame = build_frame(time_seconds, bases, logo)
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    assert process.stderr is not None
    error = process.stderr.read().decode("utf-8", errors="replace")
    return_code = process.wait()
    if return_code != 0:
        raise RuntimeError(f"FFmpeg terminou com código {return_code}:\n{error}")

    print(output)
    print(poster)


if __name__ == "__main__":
    main()
