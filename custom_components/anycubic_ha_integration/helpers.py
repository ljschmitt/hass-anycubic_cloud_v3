from __future__ import annotations

import json
import re
from enum import IntEnum
from types import MappingProxyType
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.util import slugify

from .anycubic_cloud_api.const.enums import AnycubicPrinterMaterialType
from .const import (
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    DOMAIN,
    MANUFACTURER,
    PrinterEntityType,
)

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator
    from .entity import AnycubicCloudEntityDescription


ENTITY_ID_COMPAT_SUFFIXES: dict[str, str] = {
    "aux_fan_speed_pct": "print_aux_fan_speed",
    "box_fan_level": "print_box_fan_speed",
    "curr_hotbed_temp": "hotbed_temperature",
    "curr_nozzle_temp": "nozzle_temperature",
    "dry_status_is_drying": "drying_active",
    "dry_status_remaining_time": "drying_remaining_time",
    "dry_status_total_duration": "drying_total_duration",
    "fan_speed_pct": "fan_speed",
    "fw_version": "printer_firmware",
    "job_image_url": "job_preview",
    "job_z_thick": "job_z_thickness",
    "multi_color_box_fw_version": "ace_firmware",
    "secondary_ace_spools": "secondary_multi_color_box_spools",
    "target_hotbed_temp": "target_hotbed_temperature",
    "target_nozzle_temp": "target_nozzle_temperature",
}


class AnycubicMQTTConnectMode(IntEnum):
    Printing_Only = 1
    Printing_Drying = 2
    Device_Online = 3
    Always = 4
    Never_Connect = 5


def build_printer_device_info(
    coordinator_data: dict[str, Any],
    printer_id: int,
) -> DeviceInfo:
    printer_data = coordinator_data['printers'][printer_id]['states']
    user_data = coordinator_data['user_info']
    return DeviceInfo(
        identifiers={(DOMAIN, f"{user_data['id']}-{printer_data['id']}")},
        manufacturer=MANUFACTURER,
        model=printer_data["machine_name"],
        name=printer_data["name"],
        connections={(CONNECTION_NETWORK_MAC, printer_data["machine_mac"])},
        sw_version=printer_data["fw_version"],
        hw_version=f"Printer ID: {printer_id}",
        serial_number=f"{printer_id}",
    )


def get_drying_preset_from_entry_options(
    entry_options: MappingProxyType[str, Any],
    preset_number: int | str,
) -> tuple[int | None, int | None]:
    preset_duration = entry_options.get(f"{CONF_DRYING_PRESET_DURATION_}{preset_number}")
    preset_temperature = entry_options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{preset_number}")

    return (
        preset_duration,
        preset_temperature,
    )


def printer_state_for_key(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    state_key: str,
) -> Any:
    return coordinator.data['printers'][printer_id]['states'][state_key]


def printer_attributes_for_key(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    attribute_key: str,
) -> dict[str, Any] | None:
    attr: dict[str, Any] | None = coordinator.data['printers'][printer_id]['attributes'].get(attribute_key)
    return attr


def printer_state_connected_ace_units(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
) -> int:
    return int(
        printer_state_for_key(
            coordinator,
            printer_id,
            'connected_ace_units',
        )
    )


def printer_state_supports_ace(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
) -> bool:
    return bool(
        printer_state_for_key(
            coordinator,
            printer_id,
            'supports_function_multi_color_box',
        )
    )


def check_descriptor_status_not_lcd(
    description: AnycubicCloudEntityDescription,
    material_type: AnycubicPrinterMaterialType,
) -> bool:
    return (
        description.printer_entity_type == PrinterEntityType.LCD
        and material_type != AnycubicPrinterMaterialType.RESIN
    )


def check_descriptor_status_not_fdm(
    description: AnycubicCloudEntityDescription,
    material_type: AnycubicPrinterMaterialType,
) -> bool:
    return (
        description.printer_entity_type == PrinterEntityType.FDM
        and material_type != AnycubicPrinterMaterialType.FILAMENT
    )


def check_descriptor_state_ace_not_supported(
    description: AnycubicCloudEntityDescription,
    supports_ace: bool,
) -> bool:
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_PRIMARY,
            PrinterEntityType.ACE_SECONDARY,
            PrinterEntityType.DRY_PRESET_PRIMARY,
            PrinterEntityType.DRY_PRESET_SECONDARY,
        ]
        and not supports_ace
    )


def check_descriptor_state_ace_primary_unavailable(
    description: AnycubicCloudEntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
) -> bool:
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_PRIMARY,
            PrinterEntityType.DRY_PRESET_PRIMARY,
        ]
        and supports_ace
        and connected_ace_units < 1
    )


def check_descriptor_state_ace_secondary_unavailable(
    description: AnycubicCloudEntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
) -> bool:
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_SECONDARY,
            PrinterEntityType.DRY_PRESET_SECONDARY,
        ]
        and supports_ace
        and connected_ace_units < 2
    )


def check_descriptor_state_drying_available(
    description: AnycubicCloudEntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
) -> bool:
    return (
        supports_ace
        and (
            description.printer_entity_type == PrinterEntityType.DRY_PRESET_PRIMARY
            and connected_ace_units >= 1
        ) or (
            description.printer_entity_type == PrinterEntityType.DRY_PRESET_SECONDARY
            and connected_ace_units >= 2
        )
    )


def check_descriptor_state_drying_unavailable(
    description: AnycubicCloudEntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
    entry_options: MappingProxyType[str, Any],
) -> bool:
    drying_available = check_descriptor_state_drying_available(
        description,
        supports_ace,
        connected_ace_units,
    )

    if not drying_available:
        return False

    preset_duration, preset_temperature = get_drying_preset_from_entry_options(
        entry_options,
        description.key[-1],
    )

    return (
        not preset_duration
        or not preset_temperature
        or int(preset_temperature) <= 0
        or int(preset_duration) <= 0
    )


def printer_entity_unique_id(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    entity_suffix: str,
) -> str:
    return f"{printer_state_for_key(coordinator, printer_id, 'machine_mac')}-{entity_suffix}"


def printer_entity_compat_suffix(entity_suffix: str) -> str:
    return ENTITY_ID_COMPAT_SUFFIXES.get(entity_suffix, entity_suffix)


def printer_entity_suggested_object_id(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    entity_suffix: str,
) -> str:
    printer_name = printer_state_for_key(coordinator, printer_id, "name")
    return slugify(f"{printer_name}_{printer_entity_compat_suffix(entity_suffix)}")


def state_string_active(state: Any) -> str:
    return "active" if state is not None else "inactive"


def state_string_loaded(state: Any) -> str:
    return "loaded" if state is not None else "not loaded"


def spool_color_hex(color: Any) -> str | None:
    """Return an `#RRGGBB` string for a `[red, green, blue]` list."""
    if not isinstance(color, list) or len(color) != 3:
        return None

    try:
        rgb = [int(x) for x in color]
    except (TypeError, ValueError):
        return None

    if any(x < 0 or x > 255 for x in rgb):
        return None

    return "#{:02X}{:02X}{:02X}".format(*rgb)


def spool_info_for_local_slot(
    spool_info: list[dict[str, Any]] | None,
    local_slot: int,
) -> dict[str, Any] | None:
    """Return the spool of a multi color box slot, or None when it is not present."""
    if not spool_info:
        return None

    for spool in spool_info:
        if spool.get("local_slot") == local_slot:
            return spool

    return None


def spool_info_for_active_slot(
    spool_info: list[dict[str, Any]] | None,
    active_slot: int | None,
) -> dict[str, Any] | None:
    """Return the spool the box fed most recently.

    `active_slot` is zero-based and indexes `spool_info` directly, unlike the
    one-based `local_slot` the per-slot sensors use.
    """
    if active_slot is None or active_slot < 0:
        return None

    return spool_info_for_local_slot(spool_info, active_slot + 1)


def spool_state_string(spool: dict[str, Any] | None) -> str | None:
    """Return the sensor state for a single multi color box slot."""
    if spool is None:
        return None

    if not spool.get("spool_loaded"):
        return "empty"

    material_type = str(spool.get("material_type") or "").strip() or "unknown"
    color_hex = spool_color_hex(spool.get("color"))

    if color_hex is None:
        return material_type

    return f"{material_type} {color_hex}"


def spool_attributes(spool: dict[str, Any] | None) -> dict[str, Any] | None:
    """Return the sensor attributes for a single multi color box slot."""
    if spool is None:
        return None

    return {
        "material_type": spool.get("material_type"),
        "sku": spool.get("sku"),
        "color": spool.get("color"),
        "color_hex": spool_color_hex(spool.get("color")),
        "spool_loaded": spool.get("spool_loaded"),
        "status": spool.get("status"),
        "slot": spool.get("display_slot", spool.get("slot")),
        "local_slot": spool.get("local_slot"),
        "box_id": spool.get("box_id"),
        "source": spool.get("source"),
    }


# REGEX_TOKEN_STRING = re.compile(r"^['\"]?([_-A-Za-z0-9+\/.]{236,238})['\"]?$")


# def clean_user_token(input_token):
#     token_length = len(input_token)
#     if token_length == 236:
#         return input_token
#     if token_length > 236:
#         matches = REGEX_TOKEN_STRING.findall(input_token)
#         if len(matches) == 1:
#             return matches[0]
#     raise TypeError(f"Invalid token, expected 236 or 238 chars, got {token_length}.")


REGEX_NOQUOTE_STRING = re.compile(r"^['\"]?([^'\"]+)['\"]?$")
REGEX_TOKEN_FROM_TEXT = re.compile(
    r"(?:access_token|accessToken|id_token|token)\s*[=:]\s*['\"]?([^'\"\s,&]+)",
    re.IGNORECASE,
)


def remove_quotes_from_string(input_string: str) -> str:
    input_string = input_string.strip()

    if not input_string:
        raise TypeError("Empty token string.")

    try:
        decoded = json.loads(input_string)
    except json.JSONDecodeError:
        decoded = None

    if isinstance(decoded, str):
        input_string = decoded.strip()
    elif isinstance(decoded, dict):
        for key in ("access_token", "accessToken", "id_token", "token"):
            value = decoded.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

    token_match = REGEX_TOKEN_FROM_TEXT.search(input_string)
    if token_match:
        return token_match.group(1).strip()

    matches = REGEX_NOQUOTE_STRING.findall(input_string)

    if len(matches) == 1:
        return str(matches[0]).strip()

    raise TypeError("Unexpected quotes in string.")


def validate_value_is_type[_T: Any](
    value: Any,
    value_type: type[_T],
    allow_lists: bool = False,
) -> _T | list[_T] | None:
    if allow_lists and isinstance(value, list):
        for v in value:
            if not isinstance(v, value_type):
                return None
        return value
    elif isinstance(value, value_type):
        return value

    return None


def get_value_from_dict_if_type[_T: Any](
    input_dict: dict[str, Any],
    key: str,
    value_type: type[_T],
    allow_lists: bool = False,
) -> _T | list[_T] | None:
    if (
        key in input_dict
        and (
            val := validate_value_is_type(
                input_dict[key],
                value_type,
                allow_lists,
            )
        )
    ):
        return val

    return None


def update_dict_and_validate(
    output_dict: dict[str, Any],
    input_dict: dict[str, Any],
    key: str,
    value_type: Any,
    allow_lists: bool = False,
) -> None:
    if val := get_value_from_dict_if_type(input_dict, key, value_type, allow_lists):
        output_dict[key] = val


def extract_panel_card_config(
    input_conf: dict[str, Any],
) -> dict[str, Any]:
    card_conf: dict[str, Any] = {}

    if len(input_conf) == 0:
        return card_conf

    update_dict_and_validate(card_conf, input_conf, 'vertical', bool)
    update_dict_and_validate(card_conf, input_conf, 'round', bool)
    update_dict_and_validate(card_conf, input_conf, 'use_24hr', bool)
    update_dict_and_validate(card_conf, input_conf, 'temperatureUnit', str)
    update_dict_and_validate(card_conf, input_conf, 'lightEntityId', str)
    update_dict_and_validate(card_conf, input_conf, 'powerEntityId', str)
    update_dict_and_validate(card_conf, input_conf, 'cameraEntityId', str)
    update_dict_and_validate(card_conf, input_conf, 'cameraEntityIds', dict)
    update_dict_and_validate(card_conf, input_conf, 'monitoredStats', str, allow_lists=True)
    update_dict_and_validate(card_conf, input_conf, 'scaleFactor', float)
    update_dict_and_validate(card_conf, input_conf, 'slotColors', str, allow_lists=True)
    update_dict_and_validate(card_conf, input_conf, 'showSettingsButton', bool)
    update_dict_and_validate(card_conf, input_conf, 'alwaysShow', bool)

    return card_conf
