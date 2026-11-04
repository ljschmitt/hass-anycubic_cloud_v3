"""Repository-only developer helpers; never installed with the integration."""
import sys
from pathlib import Path

INTEGRATION_ROOT = Path(__file__).resolve().parents[2] / "custom_components" / "anycubic_ha_integration"
sys.path.insert(0, str(INTEGRATION_ROOT))
