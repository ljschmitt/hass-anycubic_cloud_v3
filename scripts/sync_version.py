"""Synchronize project version files from the root Version file."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "Version"
MANIFEST_FILE = ROOT / "custom_components" / "anycubic_ha_integration" / "manifest.json"
PANEL_PACKAGE_FILE = (
    ROOT
    / "custom_components"
    / "anycubic_ha_integration"
    / "frontend_panel"
    / "package.json"
)
PANEL_PACKAGE_LOCK_FILE = PANEL_PACKAGE_FILE.with_name("package-lock.json")
README_FILE = ROOT / "README.md"

VERSION_PATTERN = re.compile(r"^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$")
README_RELEASE_PATTERN = re.compile(r"(\*\*Aktuelles Release: )[^*]+(\*\*)")


def read_version() -> str:
    version = VERSION_FILE.read_text(encoding="utf-8").strip()
    if not VERSION_PATTERN.match(version):
        raise SystemExit(
            f"{VERSION_FILE.relative_to(ROOT)} must contain only a semantic version, got: {version!r}"
        )
    return version


def dump_json(data: Any) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def updated_json(path: Path, version: str, *, package_lock: bool = False) -> str:
    data = json.loads(path.read_text(encoding="utf-8"))
    data["version"] = version
    if package_lock:
        root_package = data.get("packages", {}).get("")
        if isinstance(root_package, dict):
            root_package["version"] = version
    return dump_json(data)


def updated_readme(path: Path, version: str) -> str:
    content = path.read_text(encoding="utf-8")
    updated, replacements = README_RELEASE_PATTERN.subn(rf"\g<1>{version}\2", content, count=1)
    if replacements != 1:
        raise SystemExit("README release line not found")
    return updated


def sync_file(path: Path, content: str, *, check: bool) -> bool:
    current = path.read_text(encoding="utf-8")
    if current == content:
        return False
    if check:
        print(f"stale: {path.relative_to(ROOT)}")
        return True
    path.write_text(content, encoding="utf-8")
    print(f"updated: {path.relative_to(ROOT)}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Fail if generated version files are not synchronized.",
    )
    args = parser.parse_args()

    version = read_version()
    stale = False
    stale |= sync_file(MANIFEST_FILE, updated_json(MANIFEST_FILE, version), check=args.check)
    stale |= sync_file(PANEL_PACKAGE_FILE, updated_json(PANEL_PACKAGE_FILE, version), check=args.check)
    stale |= sync_file(
        PANEL_PACKAGE_LOCK_FILE,
        updated_json(PANEL_PACKAGE_LOCK_FILE, version, package_lock=True),
        check=args.check,
    )
    stale |= sync_file(README_FILE, updated_readme(README_FILE, version), check=args.check)

    if stale and args.check:
        return 1

    if not stale:
        print(f"version files already synchronized: {version}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
