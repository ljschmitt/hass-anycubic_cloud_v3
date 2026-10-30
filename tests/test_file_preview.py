from __future__ import annotations

import sys
import unittest
from dataclasses import dataclass
from pathlib import Path

INTEGRATION_ROOT = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "anycubic_ha_integration"
)
sys.path.insert(0, str(INTEGRATION_ROOT))

from file_preview import find_project_preview_url, normalize_preview_filename  # noqa: E402


@dataclass
class StubProject:
    printer_id: int | None
    name: str
    image_url: str | None


class FilePreviewTests(unittest.TestCase):
    def test_supported_extensions_are_normalized(self) -> None:
        self.assertEqual(normalize_preview_filename("Folder\\Part.GCODE"), "part")
        self.assertEqual(normalize_preview_filename("part.gcode.gz"), "part")
        self.assertEqual(normalize_preview_filename("part.gcode.3mf"), "part")
        self.assertEqual(normalize_preview_filename("part.3mf"), "part")

    def test_exact_match_uses_same_printer_and_newest_project(self) -> None:
        projects = [
            StubProject(2, "part", "https://example.invalid/wrong-printer.png"),
            StubProject(1, "other", "https://example.invalid/wrong-name.png"),
            StubProject(1, "part", "https://example.invalid/newest.png"),
            StubProject(1, "part", "https://example.invalid/older.png"),
        ]

        self.assertEqual(
            find_project_preview_url(projects, 1, "/prints/Part.gcode"),
            "https://example.invalid/newest.png",
        )

    def test_missing_or_image_less_match_returns_none(self) -> None:
        projects = [StubProject(1, "part", None)]

        self.assertIsNone(find_project_preview_url(projects, 1, "part.gcode"))
        self.assertIsNone(find_project_preview_url(projects, 1, "different.gcode"))


if __name__ == "__main__":
    unittest.main()
