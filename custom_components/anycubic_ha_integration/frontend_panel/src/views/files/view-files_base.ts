import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { commonFilesStyle } from "./styles";
import { localize } from "../../../localize/localize";
import { platform } from "../../const";
import {
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterSupportsMQTT,
} from "../../helpers";
import {
  AnycubicFileLocal,
  DomClickEvent,
  EvtTargFileInfo,
  EvtTargInput,
  HassDevice,
  HassEntityInfo,
  HassEntityInfos,
  HassPanel,
  HassRoute,
  HomeAssistant,
  LitTemplateResult,
} from "../../types";

export class AnycubicViewFilesBase extends LitElement {
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
  protected printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  @state()
  protected _fileArray: AnycubicFileLocal[] | undefined;

  @state()
  protected _listRefreshEntity: HassEntityInfo | undefined;

  @state()
  private _isRefreshing: boolean = false;

  @state()
  protected _isDeleting: boolean;

  @state()
  private _noMqttMessage: string;

  @state()
  private _supportsMQTT: boolean = false;

  @state()
  protected _httpResponse: boolean = false;

  @state()
  protected _currentPath: string = "/";

  @state()
  protected _printPreparationFile: AnycubicFileLocal | undefined;

  @state()
  protected _printSlotNumbers: string = "";

  @state()
  protected _isPrinting: boolean = false;

  @state()
  protected _printError: string | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._noMqttMessage = localize(
        "common.messages.mqtt_unsupported",
        this.language,
      );
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
      this._supportsMQTT = getPrinterSupportsMQTT(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
      );
    }
  }

  render(): LitTemplateResult {
    if (this._printPreparationFile) {
      return this.renderPrintPreparation();
    }

    return html`
      <div class="files-card" elevation="2">
        <div class="file-toolbar">
          <button
            .disabled=${(!this._httpResponse && !this._supportsMQTT) ||
            this._isRefreshing ||
            this._currentPath === "/"}
            class="file-refresh-button"
            @click=${this.goUp}
          >
            <ha-icon class="file-refresh-icon" icon="mdi:arrow-up"> </ha-icon>
          </button>
          <button
            .disabled=${(!this._httpResponse && !this._supportsMQTT) ||
            this._isRefreshing}
            class="file-refresh-button"
            @click=${this.refreshList}
          >
            <ha-icon class="file-refresh-icon" icon="mdi:refresh"> </ha-icon>
          </button>
        </div>
        ${!this._httpResponse && !this._supportsMQTT
          ? html` <div class="no-mqtt-msg">${this._noMqttMessage}</div> `
          : nothing}
        <ul class="files-container">
          ${this._fileArray
            ? this._fileArray.map(
                (fileInfo) => html`
                  <li class="file-info">
                    ${fileInfo.is_dir
                      ? html`
                          <button
                            class="file-open-button file-name"
                            .disabled=${this._isRefreshing}
                            .file_info=${fileInfo}
                            @click=${this.openFolder}
                          >
                            <ha-icon icon="mdi:folder"></ha-icon>
                            <span>${fileInfo.name}</span>
                          </button>
                        `
                      : html`
                          <div class="file-name">
                            <ha-icon icon="mdi:file-outline"></ha-icon>
                            <span>${fileInfo.name}</span>
                          </div>
                          <div class="file-actions">
                            ${this.canPrintFile(fileInfo)
                              ? html`
                                  <button
                                    class="file-action-button"
                                    .disabled=${this._isPrinting}
                                    .file_info=${fileInfo}
                                    title=${localize(
                                      "files.actions.prepare_print",
                                      this.language,
                                    )}
                                    @click=${this.openPrintPreparation}
                                  >
                                    <ha-icon icon="mdi:play"></ha-icon>
                                  </button>
                                `
                              : nothing}
                            <button
                              class="file-action-button"
                              .disabled=${this._isDeleting}
                              .file_info=${fileInfo}
                              title=${localize(
                                "files.actions.delete",
                                this.language,
                              )}
                              @click=${this.deleteFile}
                            >
                              <ha-icon icon="mdi:delete"></ha-icon>
                            </button>
                          </div>
                        `}
                  </li>
                `,
              )
            : null}
        </ul>
      </div>
    `;
  }

  private renderPrintPreparation(): LitTemplateResult {
    const fileInfo = this._printPreparationFile;
    const printerName =
      this.selectedPrinterDevice?.name ||
      localize("files.prepare.unknown_printer", this.language);

    return html`
      <div class="files-card print-preparation" elevation="2">
        <div class="print-preparation-header">
          <h2>${localize("files.prepare.title", this.language)}</h2>
          <button
            class="file-action-button"
            .disabled=${this._isPrinting}
            title=${localize("common.actions.cancel", this.language)}
            @click=${this.closePrintPreparation}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <dl class="print-preparation-details">
          <div>
            <dt>${localize("files.prepare.printer", this.language)}</dt>
            <dd>${printerName}</dd>
          </div>
          <div>
            <dt>${localize("files.prepare.file", this.language)}</dt>
            <dd>${fileInfo?.name}</dd>
          </div>
          <div>
            <dt>${localize("files.prepare.path", this.language)}</dt>
            <dd>${fileInfo?.path || this._currentPath}</dd>
          </div>
        </dl>

        <label class="slot-list-label" for="slot-number-list">
          ${localize("files.prepare.slot_numbers", this.language)}
        </label>
        <input
          id="slot-number-list"
          class="slot-list-input"
          .value=${this._printSlotNumbers}
          placeholder="1, 2"
          .disabled=${this._isPrinting}
          @input=${this.updatePrintSlotNumbers}
        />

        ${this._printError
          ? html`<ha-alert alert-type="error">${this._printError}</ha-alert>`
          : nothing}

        <div class="print-preparation-actions">
          <button
            class="secondary-button"
            .disabled=${this._isPrinting}
            @click=${this.closePrintPreparation}
          >
            ${localize("common.actions.cancel", this.language)}
          </button>
          <button
            class="primary-button"
            .disabled=${this._isPrinting || !this.selectedPrinterDevice}
            @click=${this.confirmPrintFile}
          >
            <ha-icon icon="mdi:play"></ha-icon>
            ${localize("common.actions.print", this.language)}
          </button>
        </div>
      </div>
    `;
  }

  refreshList = (): void => {
    this.requestFileList(this._currentPath);
  };

  protected requestFileList = (path: string): void => {
    void path;

    if (this._listRefreshEntity) {
      this._isRefreshing = true;
      this.hass
        .callService("button", "press", {
          entity_id: this._listRefreshEntity.entity_id,
        })
        .then(() => {
          this._isRefreshing = false;
        })
        .catch((_e: unknown) => {
          this._isRefreshing = false;
        });
    }
  };

  protected requestFileListService = (service: string, path: string): void => {
    if (this.selectedPrinterDevice) {
      this._isRefreshing = true;
      if (this.normalizePath(path) !== this._currentPath) {
        this._fileArray = undefined;
      }
      this.hass
        .callService(platform, service, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          path,
        })
        .then(() => {
          this._isRefreshing = false;
        })
        .catch((_e: unknown) => {
          this._isRefreshing = false;
        });
    }
  };

  protected normalizePath = (path: string | undefined): string => {
    if (!path) {
      return "/";
    }

    let normalizedPath = path.replace(/\\/g, "/").trim();
    if (!normalizedPath) {
      return "/";
    }

    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }

    normalizedPath = normalizedPath.replace(/\/+/g, "/");
    if (normalizedPath.length > 1) {
      normalizedPath = normalizedPath.replace(/\/$/g, "");
    }

    return normalizedPath || "/";
  };

  protected joinPath = (basePath: string, name: string): string => {
    const normalizedBase = this.normalizePath(basePath);
    return this.normalizePath(
      normalizedBase === "/" ? `/${name}` : `${normalizedBase}/${name}`,
    );
  };

  protected canPrintFile = (fileInfo: AnycubicFileLocal): boolean => {
    if (fileInfo.is_dir || !fileInfo.name) {
      return false;
    }

    const lowerName = fileInfo.name.toLowerCase();
    return (
      lowerName.endsWith(".gcode") ||
      lowerName.endsWith(".gcode.gz") ||
      lowerName.endsWith(".3mf")
    );
  };

  protected parseSlotNumbers = (): number[] | undefined => {
    const slotText = this._printSlotNumbers.trim();
    if (!slotText) {
      return undefined;
    }

    const slotNumbers = slotText
      .split(/[,\s]+/)
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value) && value > 0);

    return slotNumbers.length > 0 ? slotNumbers : undefined;
  };

  openPrintPreparation = (ev: DomClickEvent<EvtTargFileInfo>): void => {
    const fileInfo: AnycubicFileLocal = ev.currentTarget
      .file_info as AnycubicFileLocal;
    if (!this.canPrintFile(fileInfo)) {
      return;
    }

    this._printPreparationFile = fileInfo;
    this._printSlotNumbers = "";
    this._printError = undefined;
  };

  closePrintPreparation = (): void => {
    if (this._isPrinting) {
      return;
    }

    this._printPreparationFile = undefined;
    this._printSlotNumbers = "";
    this._printError = undefined;
  };

  updatePrintSlotNumbers = (ev: Event): void => {
    this._printSlotNumbers = (ev.currentTarget as EvtTargInput).value;
  };

  confirmPrintFile = (): void => {
    if (!this._printPreparationFile || !this.selectedPrinterDevice) {
      return;
    }

    this._isPrinting = true;
    this._printError = undefined;
    this.printFile(this._printPreparationFile, this.parseSlotNumbers())
      .then(() => {
        this._isPrinting = false;
        this.closePrintPreparation();
      })
      .catch((e: unknown) => {
        this._printError =
          (e as { message?: string }).message ||
          localize("files.prepare.print_failed", this.language);
        this._isPrinting = false;
      });
  };

  openFolder = (ev: DomClickEvent<EvtTargFileInfo>): void => {
    const fileInfo: AnycubicFileLocal = ev.currentTarget
      .file_info as AnycubicFileLocal;
    if (fileInfo.name) {
      this.requestFileList(this.joinPath(this._currentPath, fileInfo.name));
    }
  };

  goUp = (): void => {
    const currentPath = this.normalizePath(this._currentPath);
    if (currentPath === "/") {
      return;
    }

    const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/";
    this.requestFileList(parentPath);
  };

  // eslint-disable-next-line no-empty-function
  deleteFile = (_ev: DomClickEvent<EvtTargFileInfo>): void => {};

  printFile = (
    _fileInfo: AnycubicFileLocal,
    _slotNumbers: number[] | undefined,
  ): Promise<void> => Promise.resolve();

  static get styles(): CSSResult {
    return css`
      ${commonFilesStyle}
    `;
  }
}
