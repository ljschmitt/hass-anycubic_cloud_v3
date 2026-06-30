"""Fail when repository files contain likely private local data."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIPPED_DIRS = {
    ".git",
    ".mypy_cache",
    ".pytest_cache",
    ".venv",
    "__pycache__",
    "node_modules",
}

SKIPPED_SUFFIXES = {
    ".gif",
    ".ico",
    ".jpg",
    ".jpeg",
    ".png",
    ".pyc",
    ".webp",
}

PRIVATE_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    (
        "private IPv4 address",
        re.compile(
            r"\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b"
        ),
    ),
    (
        "email address",
        re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE),
    ),
    (
        "Home Assistant token assignment",
        re.compile(r"\bHA_TOKEN\s*=\s*(?!<|your-|example-|changeme\b).+", re.IGNORECASE),
    ),
    (
        "JWT-like token",
        re.compile(r"\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b"),
    ),
]

ALLOWLIST_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"your-email@example\.com", re.IGNORECASE),
]


def iter_files(paths: list[Path]) -> list[Path]:
    files: list[Path] = []
    for path in paths:
        resolved = path if path.is_absolute() else ROOT / path
        if not resolved.exists():
            continue
        if resolved.is_file():
            files.append(resolved)
            continue
        for candidate in resolved.rglob("*"):
            if candidate.is_dir():
                continue
            relative_parts = set(candidate.relative_to(ROOT).parts)
            if relative_parts & SKIPPED_DIRS:
                continue
            if candidate.suffix.lower() in SKIPPED_SUFFIXES:
                continue
            files.append(candidate)
    return files


def is_allowed(match_text: str) -> bool:
    return any(pattern.search(match_text) for pattern in ALLOWLIST_PATTERNS)


def scan_file(path: Path) -> list[str]:
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return []

    findings: list[str] = []
    for line_number, line in enumerate(content.splitlines(), start=1):
        for label, pattern in PRIVATE_PATTERNS:
            for match in pattern.finditer(line):
                if is_allowed(match.group(0)):
                    continue
                relative = path.relative_to(ROOT)
                findings.append(f"{relative}:{line_number}: {label}: {match.group(0)}")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        default=[ROOT],
        help="Files or directories to scan. Defaults to the repository root.",
    )
    args = parser.parse_args()

    findings: list[str] = []
    for path in iter_files(args.paths):
        findings.extend(scan_file(path))

    if findings:
        print("Potential private data found:")
        print("\n".join(findings))
        return 1

    print("no private data patterns found")
    return 0


if __name__ == "__main__":
    sys.exit(main())
