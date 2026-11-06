"""Hardware selection controls for Anycubic Cloud."""
from __future__ import annotations

from dataclasses import dataclass

from homeassistant.components.select import SelectEntity, SelectEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .anycubic_cloud_api.const.enums import KOBRA_X_BUILD_PLATE_TYPES
from .const import (
    COORDINATOR,
    DOMAIN,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_state_for_key


@dataclass(frozen=True, kw_only=True)
class AnycubicSelectEntityDescription(SelectEntityDescription, AnycubicCloudEntityDescription):
    """Describe an Anycubic select entity."""


BUILD_PLATE = AnycubicSelectEntityDescription(
    key="build_plate_selection",
    translation_key="build_plate_selection",
    options=list(KOBRA_X_BUILD_PLATE_TYPES.values()),
    entity_category=EntityCategory.CONFIG,
    printer_entity_type=PrinterEntityType.PRINTER,
    create_when_available=True,
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Register supported Anycubic hardware selections."""
    coordinator = hass.data[DOMAIN][entry.entry_id][COORDINATOR]
    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicBuildPlateSelect,
        platform=Platform.SELECT,
        available_descriptors=[BUILD_PLATE],
    )


class AnycubicBuildPlateSelect(AnycubicCloudEntity, SelectEntity):
    """Select the plate type configured on a supported printer."""

    @property
    def current_option(self) -> str | None:
        """Return the confirmed option."""
        option = printer_state_for_key(self.coordinator, self._printer_id, BUILD_PLATE.key)
        return option if isinstance(option, str) else None

    @property
    def available(self) -> bool:
        """Allow changes while the printer is online and idle."""
        printer = self.coordinator.get_printer_for_id(self._printer_id)
        return (
            super().available
            and self.current_option is not None
            and printer is not None
            and printer.is_available
            and not printer.latest_project_print_in_progress
        )

    async def async_select_option(self, option: str) -> None:
        """Send the selected plate and wait for confirmation."""
        await self.coordinator.async_select_build_plate(self._printer_id, option)
