import { CSSResult, LitElement, PropertyValues, css, html } from "lit";
import { property, state } from "lit/decorators.js";

import "./views/debug/view-debug.ts";
import "./views/main/view-main.ts";
import "./views/files/view-files_cloud.ts";
import "./views/files/view-files_local.ts";
import "./views/files/view-files_udisk.ts";
import "./views/print/view-print-no_cloud_save.ts";
import "./views/print/view-print-save_in_cloud.ts";

import { DEBUG } from "./const";
import {
  getPage,
  getPrinterDevID,
  getPrinterDevices,
  getSelectedPrinter,
  navigateToPage,
  navigateToPrinter,
} from "./helpers";
import { customElementIfUndef } from "./internal/register-custom-element";
import {
  DomClickEvent,
  EvtTargPrinterDevId,
  HassDevice,
  HassDeviceList,
  HassPanel,
  HassRoute,
  HomeAssistant,
  LitTemplateResult,
} from "./types";
import * as pkgjson from "../package.json";
import { localize } from "../localize/localize";
import {
  PRINTER_IMAGE_KOBRA_3,
  PRINTER_IMAGE_KOBRA_X,
} from "./printer_images";

window.console.info(
  `%c ANYCUBIC-PANEL %c v${pkgjson.version} `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray",
);

@customElementIfUndef("anycubic-cloud-panel")
export class AnycubicCloudPanel extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @state()
  private printers?: HassDeviceList;

  @state()
  private selectedPage: string = "main";

  @state()
  private selectedPrinterID: string | undefined;

  @state()
  private selectedPrinterDevice: HassDevice | undefined;

  @state()
  private language: string;

  @state()
  private _tabMain: string;

  @state()
  private _tabFilesLocal: string;

  @state()
  private _tabFilesUdisk: string;

  @state()
  private _tabFilesCloud: string;

  @state()
  private _tabPrintNoSave: string;

  @state()
  private _tabPrintSave: string;

  @state()
  private _tabDebug: string;

  @state()
  private _mainTitle: string;

  @state()
  private _selectPrinter: string;

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("location-changed", this._handleLocationChange);
  }

  public disconnectedCallback(): void {
    window.removeEventListener("location-changed", this._handleLocationChange);
    super.disconnectedCallback();
  }

  private _handleLocationChange = (): void => {
    if (!window.location.pathname.includes("anycubic-cloud")) {
      return;
    }
    this.requestUpdate();
  };

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
      this._tabMain = localize("panels.main.title", this.language);
      this._tabFilesLocal = localize("panels.files_local.title", this.language);
      this._tabFilesUdisk = localize("panels.files_udisk.title", this.language);
      this._tabFilesCloud = localize("panels.files_cloud.title", this.language);
      this._tabPrintNoSave = localize(
        "panels.print_no_cloud_save.title",
        this.language,
      );
      this._tabPrintSave = localize(
        "panels.print_save_in_cloud.title",
        this.language,
      );
      this._tabDebug = localize("panels.debug.title", this.language);
      this._mainTitle = localize("title", this.language);
      this._selectPrinter = localize(
        "panels.initial.printer_select",
        this.language,
      );
    }

    if (changedProperties.has("route")) {
      this.printers = getPrinterDevices(this.hass);
      this.selectedPage = getPage(this.route);
      this.selectedPrinterID = getPrinterDevID(this.route);
      this.selectedPrinterDevice = getSelectedPrinter(
        this.printers,
        this.selectedPrinterID,
      );
    }
  }

  render(): LitTemplateResult {
    return this.getInitialView();
  }

  renderPrinterPage(): LitTemplateResult {
    return html`
      <div class="header">
        ${this.renderToolbar()}
        <nav class="tabs" role="tablist">
          ${this._renderTab("main", this._tabMain)}
          ${this._renderTab("local-files", this._tabFilesLocal)}
          ${this._renderTab("udisk-files", this._tabFilesUdisk)}
          ${this._renderTab("cloud-files", this._tabFilesCloud)}
          ${this._renderTab("print-no_cloud_save", this._tabPrintNoSave)}
          ${this._renderTab("print-save_in_cloud", this._tabPrintSave)}
          ${DEBUG // eslint-disable-line @typescript-eslint/no-unnecessary-condition
            ? this._renderTab("debug", this._tabDebug)
            : null}
        </nav>
      </div>
      <div class="view">${this.getView(this.route)}</div>
    `;
  }

  private _renderTab(page: string, label: string): LitTemplateResult {
    return html`
      <button
        class=${this.selectedPage === page ? "tab selected" : "tab"}
        data-page=${page}
        role="tab"
        aria-selected=${this.selectedPage === page ? "true" : "false"}
        @click=${this.handlePageSelected}
      >
        ${label}
      </button>
    `;
  }

  renderToolbar(): LitTemplateResult {
    return html`
      <div class="toolbar">
        <ha-menu-button
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div class="main-title">${this._mainTitle}</div>
        <div class="version">v${pkgjson.version}</div>
      </div>
    `;
  }

  private _getPrinterImage(device: HassDevice | undefined): string | undefined {
    const deviceText = `${device?.name ?? ""} ${device?.model ?? ""}`.toLowerCase();

    if (deviceText.includes("kobra x")) {
      return PRINTER_IMAGE_KOBRA_X;
    }

    if (deviceText.includes("kobra 3")) {
      return PRINTER_IMAGE_KOBRA_3;
    }

    return undefined;
  }

  private _renderPrinterSelectBox(printerID: string): LitTemplateResult {
    const printer = this.printers?.[printerID];
    const printerImage = this._getPrinterImage(printer);

    return html`<li
      class="printer-select-box"
      .printer_id=${printerID}
      @click=${this._handlePrinterClick}
    >
      ${printerImage
        ? html`<img
            class="printer-select-image"
            src=${printerImage}
            alt=""
            loading="lazy"
          />`
        : html`<div class="printer-select-placeholder"></div>`}
      <div class="printer-select-name">${printer?.name ?? ""}</div>
    </li>`;
  }

  getInitialView(): LitTemplateResult {
    if (this.selectedPrinterID) {
      return this.renderPrinterPage();
    } else {
      return html`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>${this._selectPrinter}</p>
          <ul class="printers-container">
            ${this.printers
              ? Object.keys(this.printers).map((printerID) =>
                  this._renderPrinterSelectBox(printerID),
                )
              : null}
          </ul>
        </printer-select>
      `;
    }
  }

  getView(route: HassRoute): LitTemplateResult {
    switch (this.selectedPage) {
      case "local-files":
        return html`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_local>
        `;
      case "udisk-files":
        return html`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_udisk>
        `;
      case "cloud-files":
        return html`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_cloud>
        `;
      case "print-no_cloud_save":
        return html`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-no_cloud_save>
        `;
      case "print-save_in_cloud":
        return html`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-save_in_cloud>
        `;
      case "main":
        return html`
          <anycubic-view-main
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-main>
        `;
      case "debug":
        return html`
          <anycubic-view-debug
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .printers=${this.printers}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-debug>
        `;
      default:
        return html`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a
              page from the menu above to continue.
            </div>
          </ha-card>
        `;
    }
  }

  _handlePrinterClick = (ev: DomClickEvent<EvtTargPrinterDevId>): void => {
    navigateToPrinter(this, ev.currentTarget.printer_id);
    this.requestUpdate();
  };

  handlePageSelected = (ev: MouseEvent): void => {
    const newPage = (ev.currentTarget as HTMLElement).dataset.page as string;
    if (newPage !== getPage(this.route)) {
      navigateToPage(this, newPage);
      this.requestUpdate();
    } else {
      scrollTo(0, 0);
    }
  };

  static get styles(): CSSResult {
    return css`
      :host {
        padding: 16px;
        display: block;
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      .tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        display: flex;
        align-items: end;
        gap: 18px;
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tab {
        position: relative;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        min-height: 48px;
        padding: 0;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .tab:hover,
      .tab:focus-visible {
        color: var(--primary-text-color);
      }

      .tab.selected {
        color: var(--primary-text-color);
        font-weight: 700;
      }

      .tab.selected::after {
        background: var(--app-header-selection-bar-color, var(--primary-color));
        bottom: 0;
        content: "";
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
      }

      .version {
        font-size: 14px;
        font-weight: 500;
        color: rgba(var(--rgb-text-primary-color), 0.9);
      }

      printer-select {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }

      .view > * {
        min-width: 600px;
        max-width: 1024px;
      }

      .view > *:last-child {
        margin-bottom: 20px;
      }

      .ac_wide_view {
        width: 100%;
      }

      .printers-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 16px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .printer-select-box {
        cursor: pointer;
        display: grid;
        grid-template-rows: 150px auto;
        gap: 12px;
        min-height: 218px;
        min-width: 250px;
        max-width: 280px;
        border: 2px solid #ccc3;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
        font-weight: 900;
        box-sizing: border-box;
        overflow: hidden;
      }

      .printer-select-box:hover {
        background-color: #ccc3;
        border-color: #ccc9;
      }

      .printer-select-image,
      .printer-select-placeholder {
        width: 100%;
        height: 150px;
        border-radius: 10px;
      }

      .printer-select-image {
        display: block;
        object-fit: contain;
        background: #fff;
      }

      .printer-select-placeholder {
        background: rgba(var(--rgb-primary-text-color), 0.08);
      }

      .printer-select-name {
        align-self: center;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      @media (max-width: 599px) {
        .view > * {
          min-width: 100%;
          max-width: 100%;
        }

        .printer-select-box {
          width: 100%;
          max-width: 320px;
        }
      }
    `;
  }
}
