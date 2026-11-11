#!/usr/bin/env python3
"""Generate original Muzykogram soundtrack WAVs (then encode to OGG).

These are original educational beds composed for the app — not classical
replicas and not runtime Web Audio placeholders.
"""

from __future__ import annotations

import math
import struct
import subprocess
import wave
from pathlib import Path

SR = 22050
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "audio"

# Original motif degrees (major) — distinct per board, not classical quotes.
TRACKS = [
    # id, duration, bpm, root_hz, motif degrees, soft?
    ("wiosna-ptaki", 72, 76, 196.0, [0, 2, 4, 7, 4, 2, 0, 7], True),
    ("fala-rzeka", 78, 72, 174.6, [0, 4, 7, 9, 7, 4, 2, 0], True),
    ("warsztat-kol", 70, 84, 220.0, [0, 2, 5, 7, 5, 4, 2, 0], True),
    ("mosty-luki", 84, 68, 164.8, [0, 5, 4, 2, 0, 2, 4, 7], True),
    ("nocny-spacer", 76, 70, 185.0, [0, 3, 5, 7, 5, 3, 2, 0], True),
    ("parada-bebenkow", 80, 88, 196.0, [0, 2, 4, 5, 7, 5, 4, 0], False),
    ("niespodzianka", 76, 90, 207.6, [0, 4, 2, 5, 4, 7, 5, 0], False),
    ("oda-radosci", 82, 86, 220.0, [0, 2, 4, 7, 9, 7, 4, 2], False),
    ("laka-wiatr", 84, 74, 174.6, [0, 2, 3, 5, 7, 5, 3, 0], True),
    ("galop", 72, 96, 233.1, [0, 4, 7, 4, 5, 2, 0, 4], False),
    ("cyrk-cancan", 70, 98, 246.9, [0, 2, 5, 4, 7, 5, 2, 0], False),
    ("walc-dunaju", 86, 80, 196.0, [0, 5, 4, 9, 7, 5, 4, 0], False),
    ("taniec-ogniska", 74, 92, 185.0, [0, 3, 5, 7, 10, 7, 5, 3], False),
    ("akwarium", 82, 72, 164.8, [0, 2, 5, 9, 7, 5, 2, 0], True),
    ("zoo-parada", 76, 90, 220.0, [0, 4, 5, 7, 5, 4, 2, 0], False),
    ("poranek-ogrod", 84, 76, 196.0, [0, 2, 4, 5, 7, 9, 7, 4], True),
    ("pszczeli-wir", 70, 100, 233.1, [0, 2, 4, 7, 4, 5, 2, 0], False),
    ("balet-sniegu", 78, 84, 185.0, [0, 5, 7, 4, 2, 5, 7, 0], False),
    ("taniec-kwiatow", 86, 82, 207.6, [0, 4, 7, 11, 9, 7, 4, 2], False),
    ("wesoly-gospodarz", 80, 88, 196.0, [0, 2, 5, 4, 7, 5, 2, 0], False),
]


def midi_like(root: float, degree: int) -> float:
    return root * (2 ** (degree / 12.0))


def env(i: int, n: int, attack: float = 0.04, release: float = 0.25) -> float:
    t = i / SR
    dur = n / SR
    a = min(1.0, t / attack) if attack else 1.0
    r = 1.0
    if t > dur - release and release > 0:
        r = max(0.0, (dur - t) / release)
    return a * r


def tone(freq: float, samples: int, amp: float, soft: bool) -> list[float]:
    out = [0.0] * samples
    for i in range(samples):
        t = i / SR
        if soft:
            # soft pad: fundamental + gentle fifth partials
            sig = (
                0.55 * math.sin(2 * math.pi * freq * t)
                + 0.22 * math.sin(2 * math.pi * freq * 2 * t)
                + 0.12 * math.sin(2 * math.pi * freq * 3 * t)
            )
        else:
            # brighter pluck-ish
            sig = (
                0.5 * math.sin(2 * math.pi * freq * t)
                + 0.28 * math.sin(2 * math.pi * freq * 2 * t)
                + 0.12 * math.sin(2 * math.pi * freq * 1.5 * t)
            )
        out[i] = sig * amp * env(i, samples)
    return out


def mix_into(buf: list[float], start: int, voice: list[float]) -> None:
    for i, v in enumerate(voice):
        j = start + i
        if 0 <= j < len(buf):
            buf[j] += v


def render_track(
    duration: float,
    bpm: float,
    root: float,
    motif: list[int],
    soft: bool,
) -> list[float]:
    n = int(duration * SR)
    buf = [0.0] * n
    beat = 60.0 / bpm
    note_len = beat * 1.15
    note_samples = int(note_len * SR)
    step = int(beat * 0.92 * SR)

    # Drone bed
    drone = tone(root / 2, n, 0.07 if soft else 0.05, True)
    mix_into(buf, 0, drone)

    t = int(0.35 * SR)
    idx = 0
    while t + note_samples < n - SR:
        deg = motif[idx % len(motif)]
        # occasional octave lift for variety
        octave = 1.0 if (idx // len(motif)) % 3 != 2 else 2.0
        freq = midi_like(root, deg) * octave
        amp = 0.16 if soft else 0.19
        voice = tone(freq, note_samples, amp, soft)
        mix_into(buf, t, voice)
        # soft harmony a third above every other note
        if idx % 2 == 0:
            harm = tone(midi_like(root, deg + 4) * octave, note_samples, amp * 0.45, True)
            mix_into(buf, t, harm)
        t += step
        idx += 1

    # Soft fade out
    fade = int(1.8 * SR)
    for i in range(fade):
        buf[n - fade + i] *= 1.0 - i / fade

    # Normalize lightly
    peak = max(1e-6, max(abs(x) for x in buf))
    scale = 0.72 / peak
    return [x * scale for x in buf]


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        frames = b"".join(
            struct.pack("<h", max(-32767, min(32767, int(s * 32767)))) for s in samples
        )
        w.writeframes(frames)


def encode_ogg(wav_path: Path, ogg_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(wav_path),
            "-c:a",
            "libvorbis",
            "-q:a",
            "4",
            str(ogg_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for tid, dur, bpm, root, motif, soft in TRACKS:
        print(f"render {tid}…")
        samples = render_track(dur, bpm, root, motif, soft)
        wav = OUT_DIR / f"{tid}.wav"
        ogg = OUT_DIR / f"{tid}.ogg"
        write_wav(wav, samples)
        encode_ogg(wav, ogg)
        wav.unlink(missing_ok=True)
        print(f"  -> {ogg.name} ({ogg.stat().st_size // 1024} KiB)")


if __name__ == "__main__":
    main()
