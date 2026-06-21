import { CSSResult, LitElement, PropertyValues, css, html } from "lit";
import { property, state } from "lit/decorators.js";

import { localize } from "../../../localize/localize";
import { getEntityState } from "../../helpers";
import { customElementIfUndef } from "../../internal/register-custom-element";
import {
  HassDevice,
  HassEntity,
  HassPanel,
  HassRoute,
  HomeAssistant,
  LitTemplateResult,
} from "../../types";

import "../../components/printer_card/camera_view/camera_view.ts";

@customElementIfUndef("anycubic-view-side")
export class AnycubicViewSide extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property({ attribute: "selected-printer-id" })
  public selectedPrinterID: string | undefined;

  @property({ attribute: "selected-printer-device" })
  public selectedPrinterDevice: HassDevice | undefined;

  @state()
  private _title: string;

  @state()
  private _cameraEntity: HassEntity | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._title = localize("panels.side.title", this.language);
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("panel") ||
      changedProperties.has("selectedPrinterID") ||
      changedProperties.has("selectedPrinterDevice")
    ) {
      this._cameraEntity = this._getConfiguredCameraEntity();
    }
  }

  render(): LitTemplateResult {
    return html`
      <section class="side-view">
        <header class="side-header">
          <h1>${this._title}</h1>
          <span>${this.selectedPrinterDevice?.name ?? ""}</span>
        </header>
        <div class="camera-stage">
          <anycubic-printercard-camera_view
            .hass=${this.hass}
            .language=${this.language}
            .showVideo=${true}
            .showControls=${true}
            .cameraEntity=${this._cameraEntity}
            .configEntryId=${this.selectedPrinterDevice?.primary_config_entry ||
            this.selectedPrinterDevice?.config_entries?.[0]}
            .printerId=${this.selectedPrinterDevice?.serial_number}
          ></anycubic-printercard-camera_view>
        </div>
      </section>
    `;
  }

  private _getConfiguredCameraEntity(): HassEntity | undefined {
    const entityId = this._getConfiguredCameraEntityId();
    return entityId ? getEntityState(this.hass, { entity_id: entityId }) : undefined;
  }

  private _getConfiguredCameraEntityId(): string | undefined {
    const configured = this.panel?.config?.cameraEntityIds;
    const mappedEntityId = configured
      ? (this.selectedPrinterID
          ? configured[this.selectedPrinterID]
          : undefined) ||
        (this.selectedPrinterDevice?.serial_number
          ? configured[this.selectedPrinterDevice.serial_number]
          : undefined)
      : undefined;

    return mappedEntityId || this.panel?.config?.cameraEntityId;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        display: block;
        width: 100%;
      }

      .side-view {
        box-sizing: border-box;
        display: grid;
        gap: 16px;
        grid-template-rows: auto minmax(320px, 1fr);
        height: 100%;
        padding: 16px;
        width: 100%;
      }

      .side-header {
        align-items: baseline;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-width: 0;
      }

      .side-header h1 {
        color: var(--primary-text-color);
        font-size: 22px;
        font-weight: 600;
        line-height: 1.2;
        margin: 0;
      }

      .side-header span {
        color: var(--secondary-text-color);
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .camera-stage {
        background: black;
        border-radius: 8px;
        min-height: 320px;
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      @media (max-width: 599px) {
        .side-view {
          gap: 12px;
          grid-template-rows: auto minmax(260px, 62vh);
          padding: 12px 0;
        }

        .side-header {
          align-items: start;
          flex-direction: column;
          gap: 4px;
          padding: 0 12px;
        }
      }
    `;
  }
}
