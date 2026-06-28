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
                          <button
                            class="file-delete-button"
                            .disabled=${this._isDeleting}
                            .file_info=${fileInfo}
                            @click=${this.deleteFile}
                          >
                            <ha-icon
                              class="file-delete-icon"
                              icon="mdi:delete"
                            ></ha-icon>
                          </button>
                        `}
                  </li>
                `,
              )
            : null}
        </ul>
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

  static get styles(): CSSResult {
    return css`
      ${commonFilesStyle}
    `;
  }
}
