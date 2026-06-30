"""Lights for Anycubic Cloud."""
from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.components.light import LightEntity, LightEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    COORDINATOR,
    DOMAIN,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_state_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicLightEntityDescription(
    LightEntityDescription, AnycubicCloudEntityDescription
):
    """Describes Anycubic Cloud light entity."""


LIGHT_TYPES: list[AnycubicLightEntityDescription] = [
    AnycubicLightEntityDescription(
        key="camera_light",
        translation_key="camera_light",
        printer_entity_type=PrinterEntityType.CAMERA_LIGHT,
    ),
]


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud light entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicLight,
        platform=Platform.LIGHT,
        available_descriptors=list(LIGHT_TYPES),
    )


class AnycubicLight(AnycubicCloudEntity, LightEntity):
    """Representation of an Anycubic light."""

    entity_description: AnycubicLightEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicLightEntityDescription,
    ) -> None:
        """Initiate Anycubic light."""
        super().__init__(hass, coordinator, printer_id, entity_description)

    @property
    def is_on(self) -> bool | None:
        """Return true if the light is on."""
        value = printer_state_for_key(
            self.coordinator,
            self._printer_id,
            self.entity_description.key,
        )
        if value is None:
            return None
        return bool(value)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the light on."""
        await self.coordinator.light_turn_on_event(
            self._printer_id,
            self.entity_description.key,
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the light off."""
        await self.coordinator.light_turn_off_event(
            self._printer_id,
            self.entity_description.key,
        )
