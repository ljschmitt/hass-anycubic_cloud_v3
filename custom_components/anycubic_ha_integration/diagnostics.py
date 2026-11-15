"""Diagnostics support for Anycubic Cloud."""
from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceEntry

from .anycubic_cloud_api.printer_capture import printer_metadata
from .const import COORDINATOR, DOMAIN
from .helpers import printer_entity_unique_id

if TYPE_CHECKING:
    from .anycubic_cloud_api.data_models.printer import AnycubicPrinter
    from .coordinator import AnycubicCloudDataUpdateCoordinator

USER_TO_REDACT = {
    "birthday",
    "user_email",
    "password",
    "message_key",
    "last_login_ip",
    "casdoor_user_id",
    "casdoor_user",
    "user_nickname",
    "ip_country",
    "ip_province",
    "ip_city",
    "create_time",
    "create_day_time",
    "last_login_time",
}
PRINTER_TO_REDACT = {
    "machine_mac",
}
PROJECT_TO_REDACT = {
    "model",
}

TO_TAGGED_REDACT = {
    "id",
    "taskid",
    "user_id",
    "printer_id",
    "gcode_id",
    "key",
}


class TaggedRedacter:
    def __init__(self) -> None:
        self.redacted_values: dict[str, str] = dict()

    def _get_redacted_name(
        self,
        value: Any,
    ) -> str:
        if value not in self.redacted_values:
            num = len(self.redacted_values) + 1
            self.redacted_values[value] = f"**REDACTED_{num}**"

        return self.redacted_values[value]

    def redact_data(
        self,
        data: Any,
        to_redact: set[str],
    ) -> Any:
        if not isinstance(data, (dict, list)):
            return data

        if isinstance(data, list):
            return list([self.redact_data(val, to_redact) for val in data])

        redacted = {**data}

        for key, value in redacted.items():
            if value is None:
                continue
            if isinstance(value, str) and not value:
                continue
            if key in to_redact:
                redacted[key] = self._get_redacted_name(value)
            elif isinstance(value, dict):
                redacted[key] = self.redact_data(value, to_redact)
            elif isinstance(value, list):
                redacted[key] = list([self.redact_data(item, to_redact) for item in value])

        return redacted


def json_dict_or_value(value: str) -> dict[Any, Any] | str:
    try:
        parsed_value: Any = json.loads(value)
        if not isinstance(parsed_value, dict):
            return value

        parsed_value["__JSON_STRING_PARSED__"] = True
        return parsed_value
    except json.decoder.JSONDecodeError:
        return value


def parse_all_json_data(
    input_data: Any
) -> Any:
    if isinstance(input_data, str):
        return json_dict_or_value(input_data)

    if not isinstance(input_data, (dict, list)):
        return input_data

    if isinstance(input_data, list):
        return list([parse_all_json_data(item) for item in input_data])

    output_dict: dict[Any, Any] = dict()
    for key, value in input_data.items():
        if isinstance(value, dict):
            output_dict[key] = parse_all_json_data(value)
        elif isinstance(value, list):
            output_dict[key] = list([parse_all_json_data(item) for item in value])
        elif isinstance(value, str):
            output_dict[key] = json_dict_or_value(value)
        else:
            output_dict[key] = value

    return output_dict


def get_printer_capture_report(
    hass: HomeAssistant, coordinator: AnycubicCloudDataUpdateCoordinator, printer: AnycubicPrinter
) -> dict[str, Any] | None:
    """Build the same filtered device report for the action and the native download."""
    capture = coordinator.anycubic_api.printer_capture.export(printer.id)
    if capture is None:
        return None

    prefix = printer_entity_unique_id(coordinator, printer.id, "")
    registered_entities = {
        entity.unique_id.removeprefix(prefix): {
            "domain": entity.domain,
            "enabled": entity.disabled_by is None,
        }
        for entity in er.async_entries_for_config_entry(er.async_get(hass), coordinator.entry.entry_id)
        if entity.platform == DOMAIN and entity.unique_id.startswith(prefix)
    }
    firmware = printer.fw_version
    return {
        "printer": printer_metadata(printer.machine_type, firmware.firmware_version if firmware else None),
        "integration_entities": registered_entities,
        "capture": capture,
    }


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Download a filtered capture for this device only."""
    coordinator = hass.data.get(DOMAIN, {}).get(entry.entry_id, {}).get(COORDINATOR)
    if coordinator is not None:
        printer = coordinator.get_printer_for_device_id(device.id)
        if printer is not None and (report := get_printer_capture_report(hass, coordinator, printer)) is not None:
            return report
    return {"status": "capture_unavailable"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    tRedacter = TaggedRedacter()

    assert coordinator.anycubic_api
    user_info: dict[str, Any] = await coordinator.anycubic_api.get_user_info(raw_data=True)
    printer_info: dict[str, Any] = await coordinator.anycubic_api.list_my_printers(raw_data=True)
    projects_info: dict[str, Any] = await coordinator.anycubic_api.list_all_projects(raw_data=True)
    latest_project_info = {}

    if projects_info['data'] and len(projects_info['data']) > 0:
        latest_project_info = await coordinator.anycubic_api.project_info_for_id(
            project_id=projects_info['data'][0]['id'],
        )

    detailed_printer_info = list()
    if printer_info.get('data') is not None:
        for printer in printer_info['data']:
            printer_id = printer['id']
            detailed_printer_info.append(
                await coordinator.anycubic_api.printer_info_for_id(
                    printer_id,
                    raw_data=True,
                )
            )
    return {
        "user_info": tRedacter.redact_data(
            async_redact_data(
                parse_all_json_data(user_info),
                USER_TO_REDACT,
            ),
            TO_TAGGED_REDACT
        ),
        "printer_info": {
            **printer_info,
            'data': tRedacter.redact_data(
                async_redact_data(
                    parse_all_json_data(printer_info['data']),
                    PRINTER_TO_REDACT,
                ),
                TO_TAGGED_REDACT
            ),
        },
        "projects_info": {
            **projects_info,
            'data': [
                tRedacter.redact_data(
                    async_redact_data(
                        parse_all_json_data(x),
                        PROJECT_TO_REDACT,
                    ),
                    TO_TAGGED_REDACT
                ) for x in projects_info['data']
            ],
        },
        "detailed_printer_info": tRedacter.redact_data(
            async_redact_data(
                parse_all_json_data(detailed_printer_info),
                PRINTER_TO_REDACT,
            ),
            TO_TAGGED_REDACT
        ),
        "latest_project_info": tRedacter.redact_data(
            async_redact_data(
                parse_all_json_data(latest_project_info),
                PROJECT_TO_REDACT,
            ),
            TO_TAGGED_REDACT
        ),
    }
