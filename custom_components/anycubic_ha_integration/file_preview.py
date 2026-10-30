"""Helpers for matching Anycubic project previews to printer files."""
from __future__ import annotations

from collections.abc import Iterable
from typing import Protocol


class ProjectPreview(Protocol):
    """Project fields required for file preview matching."""

    @property
    def printer_id(self) -> int | None:
        """Return the printer ID."""
        ...

    @property
    def name(self) -> str:
        """Return the project filename."""
        ...

    @property
    def image_url(self) -> str | None:
        """Return the project image URL."""
        ...


def normalize_preview_filename(filename: str) -> str:
    """Normalize supported print filenames without fuzzy matching."""
    basename = filename.replace("\\", "/").rsplit("/", 1)[-1].strip().casefold()
    for suffix in (".gcode.3mf", ".gcode.gz", ".gcode", ".3mf"):
        if basename.endswith(suffix):
            return basename[: -len(suffix)]
    return basename


def find_project_preview_url(
    projects: Iterable[ProjectPreview],
    printer_id: int,
    filename: str,
) -> str | None:
    """Return the newest exact project preview for a printer file."""
    normalized_filename = normalize_preview_filename(filename)
    if not normalized_filename:
        return None

    for project in projects:
        if (
            project.printer_id == printer_id
            and normalize_preview_filename(project.name) == normalized_filename
            and project.image_url
        ):
            return project.image_url

    return None
