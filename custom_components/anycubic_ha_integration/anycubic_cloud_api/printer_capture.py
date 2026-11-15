"""Record a bounded, shareable sample of one printer's incoming reports."""
from __future__ import annotations

import math
import re
import time
from collections import deque
from copy import deepcopy
from itertools import islice
from threading import Lock
from typing import Any, Literal

_CAPTURE_SECONDS = 300
_DOWNLOAD_SECONDS = 1800
_MAX_FIELDS = {"mqtt": 120, "cloud": 320}
_MAX_DEPTH = 8
_KEY = re.compile(r"[A-Za-z][A-Za-z0-9_]{0,39}", re.ASCII)
_FIRMWARE = re.compile(r"[vV]?\d{1,4}(?:\.\d{1,4}){1,4}", re.ASCII)
_PRIVATE = re.compile(
    r"token|secret|password|passwd|auth|credential|account|user|email|cookie|serial|uuid|imei|"
    r"mac_?address|machine_?mac|ssid|address|hostname|url|uri|filepath|filename|file_name|gcode|project|thumbnail|"
    r"signature|private|certificate|publickey|encryption|rtc|latitude|longitude|session|"
    r"wifi|(^|_)ip(_|$)|(?:device|printer|machine|task|job|client|trace|file|disk|volume|order)_?id",
    re.IGNORECASE,
)
_PRIVATE_KEYS = {
    "key", "id", "ip", "ipaddr", "mac", "sn", "pwd", "cn", "name", "nickname", "message", "msg",
    "device_id", "printer_id", "machine_id", "device_name", "machine_name", "taskid", "task_id",
}
_MEASUREMENTS = {
    "humidity", "temp", "temperature", "nozzle_temp", "hotbed_temp", "curr_nozzle_temp",
    "curr_hotbed_temp", "target_nozzle_temp", "target_hotbed_temp", "target_temp",
    "print_time", "remain_time", "remaining_time", "elapsed_time", "progress", "layer",
    "current_layer", "total_layers", "fan_speed", "drying_status", "drying_time",
    "time_left", "loaded_slot", "feed_status", "auto_feed", "head_channel_count", "diameter", "material",
    "device_state", "status", "code", "consumables_percent", "model_id", "machine_type",
}
_NUMERIC = re.compile(r"-?\d{1,7}(?:\.\d{1,3})?", re.ASCII)
_PROTOCOL_LABELS = {
    "print", "properties", "multiColorBox", "calibration", "video", "fan", "extrudeControl",
    "report", "query", "auto", "write", "getInfo", "autoUpdateInfo", "feedFilament", "start", "stop",
    "done", "reply", "failed", "success", "progress", "online", "offline", "setAutoFeed",
}


def _field_name(key: str) -> bool:
    return bool(_KEY.fullmatch(key)) and key.lower() not in _PRIVATE_KEYS and not _PRIVATE.search(key)


def _safe_payload(payload: object, max_fields: int) -> dict[str, dict[str, object]]:
    """Keep field types, selected measurements and short protocol labels."""
    fields: dict[str, dict[str, object]] = {}

    def visit(value: object, path: tuple[str, ...], depth: int) -> None:
        if len(fields) >= max_fields or depth > _MAX_DEPTH:
            return
        if path:
            key = path[-1]
            field = ".".join(path)
            entry: dict[str, object] = {"type": type(value).__name__}
            fields[field] = entry
            measurement = key in _MEASUREMENTS or (
                key == "value" and len(path) > 1 and path[-2] in _MEASUREMENTS
            )
            if isinstance(value, str) and (
                path in (("type",), ("action",), ("state",)) and value in _PROTOCOL_LABELS
                or key in ("firmware_version", "fw_version") and _FIRMWARE.fullmatch(value)
            ):
                entry["value"] = value
            elif measurement and (
                isinstance(value, bool)
                or isinstance(value, (int, float)) and -10_000_000 <= value <= 10_000_000 and math.isfinite(value)
                or isinstance(value, str) and _NUMERIC.fullmatch(value)
            ):
                entry["value"] = value
        if isinstance(value, dict):
            for key, item in islice(value.items(), max_fields):
                if isinstance(key, str) and _field_name(key):
                    visit(item, (*path, key), depth + 1)
        elif isinstance(value, list):
            for index, item in enumerate(value[:8]):
                visit(item, (*path, str(index)), depth + 1)

    visit(payload, (), 0)
    return fields


class PrinterCapture:
    """Keep only sanitized data in memory and serialize access from MQTT and HA."""

    def __init__(self) -> None:
        self._lock = Lock()
        self._printer_id: int | None = None
        self._started = 0.0
        self._counts = {"mqtt": 0, "cloud": 0}
        self._samples: dict[str, deque[dict[str, object]]] = {
            "mqtt": deque(maxlen=80),
            "cloud": deque(maxlen=20),
        }

    def start(self, printer_id: int) -> None:
        with self._lock:
            self._printer_id = printer_id
            self._started = time.monotonic()
            for source, samples in self._samples.items():
                samples.clear()
                self._counts[source] = 0

    def record(self, printer_id: int, source: Literal["mqtt", "cloud"], kind: str, payload: object) -> None:
        with self._lock:
            elapsed = time.monotonic() - self._started
            if printer_id != self._printer_id or elapsed >= _CAPTURE_SECONDS:
                return
            self._counts[source] += 1
            samples = self._samples[source]
            fields = _safe_payload(payload, _MAX_FIELDS[source])
            if samples and samples[-1]["kind"] == kind and samples[-1]["fields"] == fields:
                return
            samples.append({"seconds": round(elapsed, 1), "kind": kind, "fields": fields})

    def export(self, printer_id: int) -> dict[str, Any] | None:
        with self._lock:
            elapsed = time.monotonic() - self._started
            if printer_id != self._printer_id or elapsed >= _DOWNLOAD_SECONDS:
                return None
            return {
                "schema_version": 1,
                "recording": elapsed < _CAPTURE_SECONDS,
                "window_seconds": _CAPTURE_SECONDS,
                "received": self._counts.copy(),
                "samples": {source: deepcopy(list(samples)) for source, samples in self._samples.items()},
            }


def printer_metadata(model_code: int | str, firmware: str | None) -> dict[str, Any]:
    """Keep the manufacturer model code and a version-shaped firmware string."""
    return {
        "model_code": str(model_code) if re.fullmatch(r"[0-9]{1,6}", str(model_code)) else None,
        "firmware": firmware if firmware and _FIRMWARE.fullmatch(firmware) else None,
    }
