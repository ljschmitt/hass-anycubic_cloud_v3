"""Check release version consistency before publishing."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "Version"
MANIFEST_FILE = ROOT / "custom_components" / "anycubic_ha_integration" / "manifest.json"
PACKAGE_FILE = ROOT / "custom_components" / "anycubic_ha_integration" / "frontend_panel" / "package.json"
PACKAGE_LOCK_FILE = PACKAGE_FILE.with_name("package-lock.json")

VERSION_PATTERN = re.compile(r"^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$")


def run_git(args: list[str]) -> str:
    completed = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return completed.stdout.strip()


def read_version() -> str:
    version = VERSION_FILE.read_text(encoding="utf-8").strip()
    if not VERSION_PATTERN.match(version):
        raise SystemExit(f"Version is not semantic: {version!r}")
    return version


def is_prerelease(version: str) -> bool:
    return "-" in version


def current_ref_name() -> str:
    github_ref = os.environ.get("GITHUB_REF", "")
    if github_ref.startswith("refs/heads/"):
        return github_ref.removeprefix("refs/heads/")
    if github_ref.startswith("refs/tags/"):
        return github_ref.removeprefix("refs/tags/")
    github_ref_name = os.environ.get("GITHUB_REF_NAME")
    if github_ref_name:
        return github_ref_name
    try:
        return run_git(["branch", "--show-current"])
    except subprocess.CalledProcessError:
        return ""


def check_release_branch(version: str) -> None:
    github_ref = os.environ.get("GITHUB_REF", "")
    if github_ref.startswith("refs/tags/"):
        return

    ref_name = current_ref_name()
    prerelease = is_prerelease(version)
    if prerelease and ref_name != "beta":
        raise SystemExit(f"Pre-release version {version} must be checked from the beta branch, got {ref_name!r}")
    if not prerelease and ref_name not in ("main", "master"):
        raise SystemExit(f"Stable version {version} must be checked from main/master, got {ref_name!r}")


def read_json_version(path: Path, *, package_lock: bool = False) -> str:
    data = json.loads(path.read_text(encoding="utf-8"))
    version = data.get("version")
    if package_lock:
        package_version = data.get("packages", {}).get("", {}).get("version")
        if package_version != version:
            raise SystemExit(f"{path.relative_to(ROOT)} root package version does not match package version")
    if not isinstance(version, str):
        raise SystemExit(f"{path.relative_to(ROOT)} has no string version")
    return version


def check_local_versions(version: str) -> None:
    for path in (MANIFEST_FILE, PACKAGE_FILE, PACKAGE_LOCK_FILE):
        file_version = read_json_version(path, package_lock=path == PACKAGE_LOCK_FILE)
        if file_version != version:
            raise SystemExit(f"{path.relative_to(ROOT)} has {file_version}, expected {version}")


def remote_tag_exists(tag: str) -> bool:
    output = run_git(["ls-remote", "--tags", "origin", f"refs/tags/{tag}"])
    return bool(output)


def github_release_exists(tag: str) -> bool:
    repository = os.environ.get("GITHUB_REPOSITORY")
    token = os.environ.get("GITHUB_TOKEN")
    if not repository or not token:
        print("GITHUB_REPOSITORY or GITHUB_TOKEN missing; skipping GitHub release lookup")
        return False

    request = urllib.request.Request(
        f"https://api.github.com/repos/{repository}/releases/tags/{tag}",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return response.status == 200
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return False
        raise


def check_tag_matches_version(expected_tag: str) -> None:
    github_ref = os.environ.get("GITHUB_REF", "")
    if github_ref.startswith("refs/tags/"):
        actual_tag = github_ref.removeprefix("refs/tags/")
        if actual_tag != expected_tag:
            raise SystemExit(f"Git tag {actual_tag} does not match Version file tag {expected_tag}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--allow-existing-tag",
        action="store_true",
        help="Allow the remote tag to already exist. Use on tag-triggered release checks.",
    )
    parser.add_argument(
        "--allow-existing-release",
        action="store_true",
        help="Allow the GitHub release to already exist. Use on tag-triggered release checks.",
    )
    args = parser.parse_args()

    version = read_version()
    tag = f"v{version}"
    check_local_versions(version)
    check_release_branch(version)
    check_tag_matches_version(tag)

    if not args.allow_existing_tag and remote_tag_exists(tag):
        raise SystemExit(f"Remote tag already exists: {tag}")

    if not args.allow_existing_release and github_release_exists(tag):
        raise SystemExit(f"GitHub release already exists: {tag}")

    print(f"release version check passed for {tag}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
