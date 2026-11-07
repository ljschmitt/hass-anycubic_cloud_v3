import {
  mdiCog,
  mdiLightbulbOff,
  mdiLightbulbOn,
  mdiPower,
  mdiPowerOff,
} from "@mdi/js";
import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { classMap } from "lit/directives/class-map.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { animate, Options as motionOptions } from "@lit-labs/motion";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { fireEvent } from "../../../fire_event";

import {
  HassDevice,
  HassEntity,
  HassEntityInfos,
  HomeAssistant,
  LitTemplateResult,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../../types";

import {
  getDefaultMonitoredStats,
  getEntityState,
  getEntityStateBinary,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterSensorStateObj,
  getStrictMatchingEntity,
  isPrintStatePrinting,
  printStateStatusColor,
  undefinedDefault,
} from "../../../helpers";

import "../camera_view/camera_view.ts";
import "../multicolorbox_view/multicolorbox_view.ts";
import "../printer_view/printer_view.ts";
import "../stats/stats_component.ts";
import "../multicolorbox_view/multicolorbox_modal_drying.ts";
import "../multicolorbox_view/multicolorbox_modal_spool.ts";
import "../printsettings/printsettings_modal.ts";

const animOptionsCard: motionOptions = {
  keyframeOptions: {
    duration: 250,
    direction: "normal",
    easing: "ease-in-out",
  },
  properties: ["height", "opacity", "scale"],
};

const defaultMonitoredStats: PrinterCardStatType[] = getDefaultMonitoredStats();
const buildPlateTypes = [
  "textured_pei_plate",
  "smooth_transfer_plate",
  "low_temperature_plate",
];
const nozzleMaterials = ["brass", "hardened_steel"];
const bundledHardwareImagePath = "/anycubic-cloud-hardware";
const nozzleOptions: Record<string, [material: string, diameter: number]> = {
  steel_04: ["hardened_steel", 0.4],
  steel_06: ["hardened_steel", 0.6],
  steel_08: ["hardened_steel", 0.8],
  brass_02: ["brass", 0.2],
  brass_025: ["brass", 0.25],
  brass_04: ["brass", 0.4],
  brass_06: ["brass", 0.6],
  brass_08: ["brass", 0.8],
};
type HardwareKind = "build_plate" | "nozzle";

@customElementIfUndef("anycubic-printercard-card")
export class AnycubicPrintercardCard extends LitElement {
  @query(".ac-printer-card")
  private _printerCardContainer!: HTMLElement | Window;

  @query(".ac-hardware-dialog")
  private _hardwareDialog!: HTMLDialogElement;

  @state()
  private _hardwareDraft = "";

  @state()
  private _hardwareTarget?: { kind: HardwareKind; entityId: string };

  @state()
  private _hardwareSaving = false;

  @state()
  private _hardwareError = false;

  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

  @property({ attribute: "monitored-stats" })
  public monitoredStats?: PrinterCardStatType[] = defaultMonitoredStats;

  @property({ attribute: false })
  public hardwareImagePath?: string;

  @property({ attribute: "selected-printer-id" })
  public selectedPrinterID: string | undefined;

  @property({ attribute: "selected-printer-device" })
  public selectedPrinterDevice: HassDevice | undefined;

  @property({ type: Boolean })
  public round?: boolean = true;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ attribute: "show-settings-button", type: Boolean })
  public showSettingsButton?: boolean;

  @property({ attribute: "always-show", type: Boolean })
  public alwaysShow?: boolean;

  @property({ attribute: "temperature-unit", type: String })
  public temperatureUnit: TemperatureUnit = TemperatureUnit.C;

  @property({ attribute: "light-entity-id", type: String })
  public lightEntityId?: string;

  @property({ attribute: "power-entity-id", type: String })
  public powerEntityId?: string;

  @property({ attribute: "camera-entity-id", type: String })
  public cameraEntityId?: string;

  @property({ type: Boolean })
  public vertical?: boolean;

  @property({ attribute: "scale-factor" })
  public scaleFactor?: number;

  @property({ attribute: "slot-colors" })
  public slotColors?: string[];

  @state()
  private _showVideo: boolean = false;

  @state()
  private cameraEntityState: HassEntity | undefined = undefined;

  @state()
  private isHidden: boolean = false;

  @state()
  private isPrinting: boolean = false;

  @state()
  private hiddenOverride: boolean = false;

  @state()
  private hasColorbox: boolean = false;

  @state()
  private hasSecondaryColorbox: boolean = false;

  @state()
  private hasMaterialRack: boolean = false;

  @state()
  private lightIsOn: boolean = false;

  @state()
  private statusColor: string = "#ffc107";

  @state()
  private printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  @state()
  private progressPercent: number = 0;

  @state()
  private _buttonPrintSettings: string;

  @state()
  private _togglingLight: boolean = false;

  @state()
  private _togglingPower: boolean = false;

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._buttonPrintSettings = localize(
        "card.buttons.print_settings",
        this.language,
      );
    }

    if (changedProperties.has("monitoredStats")) {
      this.monitoredStats = undefinedDefault(
        this.monitoredStats,
        defaultMonitoredStats,
      ) as PrinterCardStatType[];
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      this.printerEntities = getPrinterEntities(
        this.hass,
        this.selectedPrinterID,
      );

      this.printerEntityIdPart = getPrinterEntityIdPart(this.printerEntities);
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("alwaysShow") ||
      changedProperties.has("hiddenOverride") ||
      changedProperties.has("selectedPrinterID")
    ) {
      this.progressPercent = this._percentComplete();
      this.hasColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "ace_spools",
          "inactive",
        ).state === "active";
      this.hasMaterialRack =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "material_rack_spools",
          "inactive",
        ).state === "active";
      this.hasSecondaryColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "secondary_multi_color_box_spools",
          "inactive",
        ).state === "active";
      if (this.cameraEntityId) {
        this.cameraEntityState = getEntityState(this.hass, {
          entity_id: this.cameraEntityId,
        });
      }
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId ?? "" },
        true,
        false,
      ) as boolean;
      const printStateString = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_state",
        "unknown",
      ).state.toLowerCase();
      this.isPrinting = isPrintStatePrinting(printStateString);
      this.isHidden = !this.alwaysShow
        ? !this.hiddenOverride && !this.isPrinting
        : false;
      this.statusColor = printStateStatusColor(printStateString);
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId ?? "" },
        true,
        false,
      ) as boolean;
    }
  }

  render(): LitTemplateResult {
    const classesCam = {
      "ac-hidden": !this._showVideo,
    };

    return html`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        ${this._renderHardwareDialog()}
        <anycubic-printercard-camera_view
          class=${classMap(classesCam)}
          .hass=${this.hass}
          .language=${this.language}
          .showVideo=${this._showVideo}
          .toggleVideo=${this._toggleVideo}
          .cameraEntity=${this.cameraEntityState}
          .configEntryId=${this.selectedPrinterDevice?.primary_config_entry ||
          this.selectedPrinterDevice?.config_entries[0]}
          .printerId=${this.selectedPrinterDevice?.serial_number}
        ></anycubic-printercard-camera_view>
        <anycubic-printercard-multicolorbox_modal_spool
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .slotColors=${this.slotColors}
        ></anycubic-printercard-multicolorbox_modal_spool>
        <anycubic-printercard-printsettings_modal
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-printsettings_modal>
        <anycubic-printercard-multicolorbox_modal_drying
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-multicolorbox_modal_drying>
      </div>
    `;
  }

  private _renderHeader(): LitTemplateResult {
    const classesHeader = {
      "ac-h-justifycenter": !(this.powerEntityId && this.lightEntityId),
    };

    const stylesDot = {
      "background-color": this.statusColor,
    };

    const powerState = getEntityState(
      this.hass,
      this.powerEntityId ? { entity_id: this.powerEntityId } : undefined,
    )?.state;
    const powerStatus =
      powerState === "on" ||
      powerState === "off" ||
      powerState === "unavailable"
        ? powerState
        : "unknown";
    const powerLabel = this.powerEntityId
      ? localize(`card.power.${powerStatus}`, this.language)
      : "";

    return html`
      <div class="ac-printer-card-header ${classMap(classesHeader)}">
        ${this.powerEntityId
          ? html`
              <button
                class="ac-printer-card-button-small ac-printer-card-button-power"
                data-power-state=${powerStatus}
                aria-label=${powerLabel}
                title=${powerLabel}
                .disabled=${this._togglingPower}
                @click=${this._togglePowerEntity}
              >
                <ha-svg-icon
                  .path=${powerStatus === "off" ? mdiPowerOff : mdiPower}
                  aria-hidden="true"
                ></ha-svg-icon>
              </button>
            `
          : nothing}

        <button
          class="ac-printer-card-button-name"
          @click=${this._toggleHiddenOveride}
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${styleMap(stylesDot)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${this.selectedPrinterDevice?.name}
          </p>
        </button>
        ${this.lightEntityId
          ? html`
              <button
                class="ac-printer-card-button-small"
                .disabled=${this._togglingLight}
                @click=${this._toggleLightEntity}
              >
                <ha-svg-icon
                  .path=${this.lightIsOn ? mdiLightbulbOn : mdiLightbulbOff}
                ></ha-svg-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private _renderPrinterContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };
    const stylesScaledColLeft = {
      width: this.vertical
        ? "100%"
        : this.scaleFactor
          ? String(50 * this.scaleFactor) + "%"
          : "50%",
    };
    const stylesScaledColRight = {
      width: this.vertical
        ? "100%"
        : this.scaleFactor
          ? String(50 / this.scaleFactor) + "%"
          : "50%",
    };

    return html`
      <div
        class="ac-printer-card-infocontainer ${classMap(classesMain)}"
        style=${styleMap(stylesMain)}
        ${animate({ ...animOptionsCard })}
      >
        <div
          class="ac-printer-card-info-animcontainer ${classMap(classesMain)}"
          style=${styleMap(stylesScaledColLeft)}
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .scaleFactor=${this.scaleFactor}
            .toggleVideo=${this._toggleVideo}
          ></anycubic-printercard-printer_view>
          ${this.vertical
            ? html`<p class="ac-printer-card-info-vertprog">
                ${this.round
                  ? Math.round(this.progressPercent)
                  : this.progressPercent}%
              </p>`
            : nothing}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${classMap(classesMain)}"
          style=${styleMap(stylesScaledColRight)}
        >
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .language=${this.language}
            .monitoredStats=${this.monitoredStats}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .progressPercent=${this.progressPercent}
            .showPercent=${!this.vertical}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this.isHidden ? nothing : this._renderHardwareSettings()}
      ${this._renderPrintSettingsContainer()}
      ${this._renderMaterialRackContainer()}
      ${this._renderMultiColorBoxContainer()}
      ${this._renderSecondaryMultiColorBoxContainer()}
    `;
  }

  private _renderHardwareSettings(): LitTemplateResult | typeof nothing {
    const sensor = (suffix: string): HassEntity =>
      getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        suffix,
      );
    const translate = this._hardwareText;
    const hasValue = (value: string): boolean =>
      !["", "unknown", "unavailable"].includes(value);
    const plate = sensor("build_plate_type").state;
    const material = sensor("nozzle_material").state;
    const diameterSensor = sensor("nozzle_diameter");
    const diameter = Number(diameterSensor.state);
    const diameterLabel =
      Number.isFinite(diameter) && diameter > 0
        ? `${new Intl.NumberFormat(this.language, { maximumFractionDigits: 2 }).format(diameter)} ${diameterSensor.attributes.unit_of_measurement ?? "mm"}`
        : "";
    const materialLabel = hasValue(material)
      ? translate(nozzleMaterials.includes(material) ? material : "unmapped")
      : "";
    const nozzle = [materialLabel, diameterLabel].filter(Boolean).join(" · ");
    const plateLabel = hasValue(plate)
      ? translate(buildPlateTypes.includes(plate) ? plate : "unmapped")
      : "";
    return plateLabel || nozzle
      ? html`
          <div class="ac-printer-card-hardware">
            ${this._renderHardwareItem(
              "build_plate",
              plateLabel,
              plate,
              buildPlateTypes,
            )}
            ${this._renderHardwareItem(
              "nozzle",
              nozzle,
              material,
              nozzleMaterials,
            )}
          </div>
        `
      : nothing;
  }

  private _renderHardwareItem(
    kind: HardwareKind,
    label: string,
    image: string,
    knownImages: string[],
  ): LitTemplateResult | typeof nothing {
    if (!label) {
      return nothing;
    }
    const title = `${this._hardwareText(kind)} · ${label}`;
    const fallback = html`<span class="ac-hardware-fallback">${label}</span>`;
    return this._hardwareSelect(kind)
      ? html`<button
          type="button"
          class="ac-hardware-select"
          data-kind=${kind}
          aria-haspopup="dialog"
          aria-label=${`${this._hardwareText(`change_${kind}`)} · ${label}`}
          title=${title}
          @click=${this._openHardwareSelect}
        >
          ${this._renderHardwareImage(image, knownImages)} ${fallback}
        </button>`
      : html`<div title=${title}>
          ${this._renderHardwareImage(image, knownImages, label)} ${fallback}
        </div>`;
  }

  private _hardwareText = (key: string): string =>
    localize(`card.hardware.${key}`, this.language);

  private _hardwareSelect(kind: HardwareKind): HassEntity | undefined {
    const entity = getEntityState(
      this.hass,
      getStrictMatchingEntity(
        this.printerEntities,
        this.printerEntityIdPart,
        "select",
        `${kind}_selection`,
      ),
    );
    return entity && this._hardwareOptions(kind, entity).includes(entity.state)
      ? entity
      : undefined;
  }

  private _hardwareOptions(
    kind: HardwareKind,
    entity: HassEntity | undefined,
  ): string[] {
    const options: unknown = entity?.attributes.options;
    const supported =
      kind === "nozzle" ? Object.keys(nozzleOptions) : buildPlateTypes;
    return Array.isArray(options)
      ? supported.filter((option) => options.includes(option))
      : [];
  }

  private _openHardwareSelect = async (event: Event): Promise<void> => {
    const kind = (event.currentTarget as HTMLButtonElement).dataset.kind;
    if (kind !== "nozzle" && kind !== "build_plate") {
      return;
    }
    const entity = this._hardwareSelect(kind);
    if (!entity || this._hardwareSaving || this._hardwareDialog.open) {
      return;
    }
    this._hardwareTarget = { kind, entityId: entity.entity_id };
    this._hardwareDraft = entity.state;
    this._hardwareError = false;
    await this.updateComplete;
    if (this.isConnected) {
      this._hardwareDialog.showModal();
    }
  };

  private _renderHardwareDialog(): LitTemplateResult {
    const target = this._hardwareTarget;
    const kind = target?.kind ?? "build_plate";
    const entity = target ? this._hardwareSelect(kind) : undefined;
    const active = !!entity && entity.entity_id === target?.entityId;
    const options = this._hardwareOptions(kind, entity);
    const choices = options.map((option) => {
      const [image, diameter] =
        kind === "nozzle" ? nozzleOptions[option] : [option];
      const size =
        diameter === undefined
          ? ""
          : `${new Intl.NumberFormat(this.language).format(diameter)} mm`;
      return html`
        <label>
          <input
            type="radio"
            name="hardware-option"
            .value=${option}
            .checked=${this._hardwareDraft === option}
          />
          ${this._renderHardwareImage(
            image,
            kind === "nozzle" ? nozzleMaterials : buildPlateTypes,
          )}
          <span>
            ${size ? html`<strong>${size}</strong>` : nothing}
            ${this._hardwareText(image)}
          </span>
        </label>
      `;
    });
    return html`
      <dialog
        class="ac-hardware-dialog"
        data-kind=${kind}
        aria-labelledby="ac-hardware-dialog-title"
        aria-describedby="ac-hardware-dialog-help"
        @cancel=${this._cancelHardwareDialog}
        @close=${this._resetHardwareDialog}
      >
        <form @submit=${this._submitHardware}>
          <h2 id="ac-hardware-dialog-title">
            ${this._hardwareText(`change_${kind}`)}
          </h2>
          <p id="ac-hardware-dialog-help">
            ${this._hardwareText(`${kind}_help`)}
          </p>
          <div class="ac-hardware-dialog-scroll">
            <fieldset
              class="ac-hardware-dialog-options"
              aria-labelledby="ac-hardware-dialog-title"
              ?disabled=${!active || this._hardwareSaving}
              @change=${this._selectHardwareDraft}
            >
              ${choices}
            </fieldset>
          </div>
          ${!active || this._hardwareError
            ? html`<p role="alert" class="ac-hardware-dialog-error">
                ${this._hardwareText(!active ? "unavailable" : `${kind}_error`)}
              </p>`
            : nothing}
          <div class="ac-hardware-dialog-actions">
            <button
              type="button"
              ?disabled=${this._hardwareSaving}
              @click=${this._closeHardwareDialog}
            >
              ${localize("common.actions.cancel", this.language)}
            </button>
            <button
              type="submit"
              ?disabled=${!active ||
              this._hardwareSaving ||
              !options.includes(this._hardwareDraft) ||
              this._hardwareDraft === entity.state}
            >
              ${this._hardwareText(this._hardwareSaving ? "saving" : "apply")}
            </button>
          </div>
        </form>
      </dialog>
    `;
  }

  private _selectHardwareDraft = (event: Event): void => {
    this._hardwareDraft = (event.target as HTMLInputElement).value;
    this._hardwareError = false;
  };

  private _cancelHardwareDialog = (event: Event): void => {
    if (this._hardwareSaving) {
      event.preventDefault();
    }
  };

  private _closeHardwareDialog = (): void => {
    if (!this._hardwareSaving) {
      this._hardwareDialog.close();
    }
  };

  private _resetHardwareDialog = (): void => {
    if (!this._hardwareDialog.open) {
      this._hardwareTarget = undefined;
    }
  };

  private _submitHardware = async (event: Event): Promise<void> => {
    event.preventDefault();
    const target = this._hardwareTarget;
    if (!target) {
      return;
    }
    const entity = this._hardwareSelect(target.kind);
    const option = this._hardwareDraft;
    if (
      this._hardwareSaving ||
      !entity ||
      entity.entity_id !== target.entityId ||
      !this._hardwareOptions(target.kind, entity).includes(option) ||
      entity.state === option
    ) {
      return;
    }
    this._hardwareSaving = true;
    this._hardwareError = false;
    try {
      await this.hass.callService(
        "select",
        "select_option",
        { option },
        { entity_id: entity.entity_id },
      );
      this._hardwareDialog.close();
    } catch {
      this._hardwareError = true;
    } finally {
      this._hardwareSaving = false;
    }
  };

  private _renderHardwareImage(
    hardwareState: string,
    knownStates: string[],
    alt = "",
  ): LitTemplateResult | typeof nothing {
    const folder =
      typeof this.hardwareImagePath === "string"
        ? this.hardwareImagePath.replace(/\/$/, "")
        : "";
    if (!knownStates.includes(hardwareState)) {
      return nothing;
    }
    const bundled = `${bundledHardwareImagePath}/${hardwareState}.png`;
    const local = /^\/local(?:\/[a-z0-9_-]+)+$/i.test(folder)
      ? `${folder}/${hardwareState}.png`
      : "";
    const source = local || bundled;
    return html`${keyed(
      source,
      html`<img
        src=${source}
        data-bundled-src=${bundled}
        alt=${alt}
        width="44"
        height="44"
        hidden
        @load=${this._updateHardwareImage}
        @error=${this._updateHardwareImage}
      />`,
    )}`;
  }

  private _updateHardwareImage = (event: Event): void => {
    const image = event.currentTarget as HTMLImageElement;
    const bundled = image.dataset.bundledSrc;
    if (
      event.type === "error" &&
      bundled &&
      image.getAttribute("src") !== bundled
    ) {
      image.src = bundled;
      return;
    }
    image.hidden = event.type === "error";
  };

  private _toggleVideo = (): void => {
    const hasCloudCameraConfig = !!(
      this.selectedPrinterDevice?.serial_number &&
      (this.selectedPrinterDevice.primary_config_entry ||
        this.selectedPrinterDevice.config_entries[0])
    );
    this._showVideo = !!(
      (this.cameraEntityState || hasCloudCameraConfig) &&
      !this._showVideo
    );
  };

  private _renderPrintSettingsContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.showSettingsButton || this.isPrinting
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div
              class="ac-printer-card-settingssection ${classMap(classesMain)}"
            >
              <button
                class="ac-printer-card-button-settings"
                @click=${this._openPrintSettingsModal}
              >
                <ha-svg-icon .path=${mdiCog}></ha-svg-icon>
                ${this._buttonPrintSettings}
              </button>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderMaterialRackContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.hasMaterialRack
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div class="ac-printer-card-mcbsection ${classMap(classesMain)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .spoolsEntityId=${"material_rack_spools"}
                .showControls=${false}
                .allowSpoolEdit=${true}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderMultiColorBoxContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.hasColorbox
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div class="ac-printer-card-mcbsection ${classMap(classesMain)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${0}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderSecondaryMultiColorBoxContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.hasSecondaryColorbox
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div class="ac-printer-card-mcbsection ${classMap(classesMain)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${1}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : nothing;
  }

  private _openPrintSettingsModal = (): void => {
    fireEvent(this._printerCardContainer, "ac-printset-modal", {
      modalOpen: true,
    });
  };

  private _toggleLightEntity = (): void => {
    if (this.lightEntityId) {
      this._togglingLight = true;
      this.hass
        .callService("homeassistant", "toggle", {
          entity_id: this.lightEntityId,
        })
        .then(() => {
          this._togglingLight = false;
        })
        .catch((_e: unknown) => {
          this._togglingLight = false;
        });
    }
  };

  private _togglePowerEntity = (): void => {
    if (this.powerEntityId) {
      this._togglingPower = true;
      this.hass
        .callService("homeassistant", "toggle", {
          entity_id: this.powerEntityId,
        })
        .then(() => {
          this._togglingPower = false;
        })
        .catch((_e: unknown) => {
          this._togglingPower = false;
        });
    }
  };

  private _toggleHiddenOveride = (): void => {
    this.hiddenOverride = !this.hiddenOverride;
  };

  private _percentComplete(): number {
    return Number(
      getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_progress",
        -1.0,
      ).state,
    );
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        --ac-printer-card-preview-size: 60px;
      }

      .ac-printer-card {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        box-sizing: border-box;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        margin: 0px;
        box-shadow: var(
          --ha-card-box-shadow,
          0px 2px 1px -1px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12)
        );
      }

      .ac-printer-card-mainview {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printer-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
      }

      .ac-h-justifycenter {
        justify-content: center;
      }

      .ac-printer-card-button-small {
        border: none;
        outline: none;
        background-color: transparent;
        width: 32px;
        height: 32px;
        font-size: 22px;
        line-height: 22px;
        box-sizing: border-box;
        padding: 0px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-power[data-power-state="on"] {
        color: var(--success-color, #2e7d32);
      }

      .ac-printer-card-button-power ha-svg-icon {
        --icon-primary-color: currentColor;
      }

      .ac-printer-card-button-power[data-power-state="unknown"],
      .ac-printer-card-button-power[data-power-state="unavailable"] {
        color: var(--secondary-text-color, var(--primary-text-color));
      }

      .ac-printer-card-button-power:focus-visible {
        outline: 2px solid var(--primary-text-color);
        outline-offset: 2px;
      }

      .ac-printer-card-button-settings {
        border: none;
        border-radius: 6px;
        outline: none;
        background-color: transparent;
        font-size: 18px;
        box-sizing: border-box;
        padding: 4px 12px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings:hover {
        background-color: #7f7f7f36;
      }

      .ac-printer-card-button-settings:active {
        background-color: #7f7f7f5e;
      }

      .ac-printer-card-button-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        outline: none;
        background-color: transparent;
        padding: 24px;
      }
      .ac-printer-card-header-status-dot {
        margin: 0px 10px;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        box-sizing: border-box;
      }

      .ac-printer-card-header-status-text {
        font-weight: bold;
        font-size: 22px;
        margin: 0px;
        color: var(--primary-text-color);
      }

      .ac-printer-card-infocontainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-printer-card-infocontainer.ac-card-vertical {
        flex-direction: column;
      }

      .ac-printer-card-info-animcontainer {
        box-sizing: border-box;
        padding: 0px 8px 32px 8px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
      }

      anycubic-printercard-printer_view {
        width: 100%;
        flex-grow: 1;
      }

      .ac-printer-card-info-vertprog {
        width: 50%;
        font-size: 36px;
        text-align: center;
        font-weight: bold;
      }

      anycubic-printercard-printer_view.ac-card-vertical {
        width: auto;
      }

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 8px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-info-statscontainer.ac-card-vertical {
        padding-left: 32px;
        padding-right: 32px;
        width: 100%;
        height: auto;
      }

      .ac-printer-card-hardware {
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin: 0 16px 12px;
        padding: 8px 0 0;
        border-top: 1px solid var(--divider-color);
      }

      .ac-printer-card-hardware > * {
        display: inline-flex;
        align-items: center;
        min-width: 0;
      }

      .ac-printer-card-hardware img {
        width: var(--ac-printer-card-preview-size);
        height: var(--ac-printer-card-preview-size);
        object-fit: contain;
        border-radius: 6px;
      }

      .ac-printer-card-hardware img:not([hidden]) + .ac-hardware-fallback {
        display: none;
      }

      .ac-hardware-fallback {
        overflow-wrap: anywhere;
      }

      .ac-hardware-select {
        background: transparent;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px;
        min-height: 44px;
        color: inherit;
        cursor: pointer;
        font: inherit;
      }

      .ac-hardware-select:hover {
        border-color: var(--primary-color);
      }

      .ac-hardware-select .ac-hardware-fallback {
        padding: 0 6px;
      }

      .ac-hardware-dialog {
        box-sizing: border-box;
        width: min(calc(100% - 24px), 560px);
        max-height: calc(100% - 24px);
        border: 0;
        border-radius: 16px;
        padding: 20px;
        background: var(
          --ha-card-background,
          var(--card-background-color, Canvas)
        );
        color: var(--primary-text-color);
        box-shadow: 0 12px 36px rgb(0 0 0 / 28%);
      }

      .ac-hardware-dialog::backdrop {
        background: rgb(0 0 0 / 42%);
      }

      .ac-hardware-dialog form {
        display: flex;
        flex-direction: column;
        max-height: calc(100dvh - 64px);
      }

      .ac-hardware-dialog h2 {
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.3;
      }

      .ac-hardware-dialog p {
        margin: 8px 0 16px;
        line-height: 1.45;
      }

      .ac-hardware-dialog-scroll {
        min-height: 0;
        overflow-y: auto;
      }

      .ac-hardware-dialog-options {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(min(100%, 4.75rem), 1fr)
        );
        gap: 8px;
        min-inline-size: 0;
        margin: 0;
        padding: 2px;
        border: 0;
      }

      .ac-hardware-dialog-options label {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px 8px;
        cursor: pointer;
        font-size: 0.875rem;
        text-align: center;
        overflow-wrap: anywhere;
      }

      .ac-hardware-dialog[data-kind="nozzle"] .ac-hardware-dialog-options {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 7rem), 1fr));
      }

      .ac-hardware-dialog-options strong {
        display: block;
        margin-bottom: 2px;
      }

      .ac-hardware-dialog[data-kind="nozzle"] .ac-hardware-dialog-options img {
        width: min(100%, 62px);
      }

      .ac-hardware-dialog-options:disabled label {
        cursor: default;
      }

      .ac-hardware-dialog-options input {
        margin: 0;
        align-self: flex-end;
        accent-color: var(--primary-color, Highlight);
      }

      .ac-hardware-dialog-options label:has(input:checked) {
        border-color: var(--primary-color, Highlight);
      }

      .ac-hardware-dialog-options img {
        width: min(100%, 88px);
        height: auto;
        aspect-ratio: 1;
        object-fit: contain;
        border-radius: 6px;
      }

      .ac-hardware-dialog-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }

      .ac-hardware-dialog-actions button {
        min-height: 44px;
        padding: 0 14px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }

      .ac-hardware-dialog-actions button[type="submit"]:not(:disabled) {
        border-color: transparent;
        background: var(--primary-color, Highlight);
        color: var(--text-primary-color, HighlightText);
      }

      .ac-hardware-dialog-actions button:disabled {
        color: var(--disabled-text-color);
        cursor: default;
      }

      .ac-hardware-dialog .ac-hardware-dialog-error {
        margin-bottom: 0;
        color: var(--error-color);
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 6px;
        width: 100%;
        height: 100%;
      }

      .ac-printer-card-mcbsection.ac-card-vertical {
        height: auto;
      }

      .ac-hidden {
        display: none;
      }
    `;
  }
}
