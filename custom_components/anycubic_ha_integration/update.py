"""Platform for update integration."""
from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.components.update import (
    UpdateDeviceClass,
    UpdateEntity,
    UpdateEntityDescription,
    UpdateEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    COORDINATOR,
    DOMAIN,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_attributes_for_key, printer_state_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicUpdateEntityDescription(
    UpdateEntityDescription, AnycubicCloudEntityDescription
):
    """Describes Anycubic Cloud update entity."""


PRIMARY_MULTI_COLOR_BOX_UPDATE_TYPES: list[AnycubicUpdateEntityDescription] = list([
    AnycubicUpdateEntityDescription(
        key="multi_color_box_fw_version",
        translation_key="multi_color_box_fw_version",
        device_class=UpdateDeviceClass.FIRMWARE,
        entity_category=EntityCategory.CONFIG,
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
])

SECONDARY_MULTI_COLOR_BOX_UPDATE_TYPES: list[AnycubicUpdateEntityDescription] = list([
    AnycubicUpdateEntityDescription(
        key="secondary_multi_color_box_fw_version",
        translation_key="secondary_multi_color_box_fw_version",
        device_class=UpdateDeviceClass.FIRMWARE,
        entity_category=EntityCategory.CONFIG,
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
])

UPDATE_TYPES: list[AnycubicUpdateEntityDescription] = list([
    AnycubicUpdateEntityDescription(
        key="fw_version",
        translation_key="fw_version",
        device_class=UpdateDeviceClass.FIRMWARE,
        entity_category=EntityCategory.CONFIG,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
])

GLOBAL_UPDATE_TYPES: list[AnycubicUpdateEntityDescription] = list([
])


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicUpdateEntity,
        platform=Platform.UPDATE,
        available_descriptors=list(
            UPDATE_TYPES
            + PRIMARY_MULTI_COLOR_BOX_UPDATE_TYPES
            + SECONDARY_MULTI_COLOR_BOX_UPDATE_TYPES
            + GLOBAL_UPDATE_TYPES
        ),
    )


class AnycubicUpdateEntity(AnycubicCloudEntity, UpdateEntity):
    """Representation of a Anycubic Cloud sensor."""

    entity_description: AnycubicUpdateEntityDescription
    _attr_supported_features = (
        UpdateEntityFeature.INSTALL | UpdateEntityFeature.PROGRESS
    )

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicUpdateEntityDescription,
    ) -> None:
        """Initiate Anycubic Sensor."""
        super().__init__(hass, coordinator, printer_id, entity_description)

    @property
    def installed_version(self) -> str:
        """Version currently in use."""
        return str(printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key))

    @property
    def latest_version(self) -> str:
        """Latest version available for install."""
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        return str(fw_attr['latest_version']) if fw_attr else "error"

    @property
    def in_progress(self) -> bool:
        """Update installation in progress."""
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        return bool(fw_attr['in_progress']) if fw_attr else False

    @property
    def update_percentage(self) -> int | float | None:
        """Return the existing download/install progress calculation."""
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        progress = fw_attr['in_progress'] if fw_attr else None
        return progress if isinstance(progress, (int, float)) and not isinstance(progress, bool) else None

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if fw_attr and (steps := fw_attr.get('update_steps')):
            return {'current_step': steps[0], 'total_steps': steps[1]}
        return None

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        await self.coordinator.fw_update_event(self._printer_id, self.entity_description.key)
