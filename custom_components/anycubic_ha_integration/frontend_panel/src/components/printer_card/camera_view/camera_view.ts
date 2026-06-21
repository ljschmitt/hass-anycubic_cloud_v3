import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack,
  EncryptionMode,
} from "agora-rtc-sdk-ng";
import {
  mdiFullscreen,
  mdiMagnifyMinusOutline,
  mdiMagnifyPlusOutline,
  mdiRefresh,
} from "@mdi/js";
import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { styleMap } from "lit/directives/style-map.js";

import { localize } from "../../../../localize/localize";
import { customElementIfUndef } from "../../../internal/register-custom-element";
import { buildCameraUrlFromEntity } from "../../../helpers";
import { HassEntity, HomeAssistant, LitTemplateResult } from "../../../types";

interface AnycubicCameraSession {
  appid: string;
  channel: string;
  rtc_token: string;
  client_uid: number;
  printer_uid: number | null;
  encryption_kdf_salt: string;
  encryption_key: string;
  encryption_mode: string;
}

@customElementIfUndef("anycubic-printercard-camera_view")
export class AnycubicPrintercardCameraview extends LitElement {
  @query(".ac-camera-video")
  private _videoElement!: HTMLElement;

  @query(".ac-camera-wrapper")
  private _cameraWrapper!: HTMLElement;

  @property()
  public hass!: HomeAssistant;

  @property()
  public language?: string;

  @property({ attribute: "show-video" })
  public showVideo?: boolean | undefined;

  @property({ attribute: "toggle-video" })
  public toggleVideo?: () => void;

  @property({ attribute: "camera-entity" })
  public cameraEntity: HassEntity | undefined;

  @property({ attribute: "config-entry-id" })
  public configEntryId: string | undefined;

  @property({ attribute: "printer-id" })
  public printerId: string | undefined;

  @property({ attribute: "show-controls", type: Boolean })
  public showControls?: boolean = false;

  @state()
  private camImgString: string = "none";

  @state()
  private cloudCameraStatus: "idle" | "connecting" | "connected" | "error" =
    "idle";

  @state()
  private cloudCameraError: string | undefined;

  private _agoraClient: IAgoraRTCClient | undefined;
  private _cameraKeepaliveTimer: number | undefined;
  private _remoteVideoTrack: IRemoteVideoTrack | undefined;
  private _startRequest = 0;
  private _zoom = 1;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("showVideo") ||
      changedProperties.has("cameraEntity")
    ) {
      this.camImgString =
        this.showVideo && !!this.cameraEntity
          ? `url('${buildCameraUrlFromEntity(this.cameraEntity)}')`
          : "none";
    }
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("showVideo") ||
      changedProperties.has("cameraEntity") ||
      changedProperties.has("configEntryId") ||
      changedProperties.has("printerId")
    ) {
      this._syncCloudCamera();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    void this._stopCloudCamera();
  }

  render(): LitTemplateResult {
    const stylesView = {
      display: this.showVideo ? "block" : "none",
    };
    return html`
      <div
        class="ac-printercard-cameraview"
        style=${styleMap(stylesView)}
        @click=${this._handleToggleClick}
      >
        ${this.showVideo ? this._renderInner() : nothing}
      </div>
    `;
  }

  private _renderInner(): LitTemplateResult {
    const stylesMedia = {
      transform: `scale(${this._zoom})`,
    };
    const stylesImage = {
      "background-image": this.camImgString,
      ...stylesMedia,
    };

    return html`
      <div class="ac-camera-wrapper">
        ${!this.cameraEntity
          ? html`
              <div
                class="ac-camera-video ac-camera-media"
                style=${styleMap(stylesMedia)}
              ></div>
              ${this.cloudCameraStatus !== "connected"
                ? html`<div class="ac-camera-status">
                    ${this.cloudCameraStatus === "error"
                      ? this.cloudCameraError ||
                        this._localize("camera.errors.unavailable")
                      : this._localize("camera.status.connecting")}
                  </div>`
                : nothing}
            `
          : nothing}
        ${this.cameraEntity
          ? html`<div
              class="ac-camera-media ac-camera-image-zoom"
              style=${styleMap(stylesImage)}
            ></div>`
          : nothing}
        ${this.showControls ? this._renderControls() : nothing}
      </div>
    `;
  }

  private _renderControls(): LitTemplateResult {
    return html`
      <div class="ac-camera-controls" @click=${this._stopClickPropagation}>
        <button
          class="ac-camera-control"
          @click=${this._zoomOut}
          title=${this._localize("camera.controls.zoom_out")}
          aria-label=${this._localize("camera.controls.zoom_out")}
        >
          <ha-svg-icon .path=${mdiMagnifyMinusOutline}></ha-svg-icon>
        </button>
        <span class="ac-camera-zoom">${Math.round(this._zoom * 100)}%</span>
        <button
          class="ac-camera-control"
          @click=${this._zoomIn}
          title=${this._localize("camera.controls.zoom_in")}
          aria-label=${this._localize("camera.controls.zoom_in")}
        >
          <ha-svg-icon .path=${mdiMagnifyPlusOutline}></ha-svg-icon>
        </button>
        <button
          class="ac-camera-control"
          @click=${this._resetZoom}
          title=${this._localize("camera.controls.reset_zoom")}
          aria-label=${this._localize("camera.controls.reset_zoom")}
        >
          <ha-svg-icon .path=${mdiRefresh}></ha-svg-icon>
        </button>
        <button
          class="ac-camera-control"
          @click=${this._toggleFullscreen}
          title=${this._localize("camera.controls.fullscreen")}
          aria-label=${this._localize("camera.controls.fullscreen")}
        >
          <ha-svg-icon .path=${mdiFullscreen}></ha-svg-icon>
        </button>
      </div>
    `;
  }

  private _handleToggleClick = (): void => {
    if (this.toggleVideo) {
      this.toggleVideo();
    }
  };

  private _stopClickPropagation = (ev: Event): void => {
    ev.stopPropagation();
  };

  private _zoomIn = (ev: Event): void => {
    ev.stopPropagation();
    this._zoom = Math.min(4, Math.round((this._zoom + 0.25) * 100) / 100);
    this.requestUpdate();
  };

  private _zoomOut = (ev: Event): void => {
    ev.stopPropagation();
    this._zoom = Math.max(1, Math.round((this._zoom - 0.25) * 100) / 100);
    this.requestUpdate();
  };

  private _resetZoom = (ev: Event): void => {
    ev.stopPropagation();
    this._zoom = 1;
    this.requestUpdate();
  };

  private _toggleFullscreen = (ev: Event): void => {
    ev.stopPropagation();
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void this._cameraWrapper?.requestFullscreen();
  };

  private _hasCloudCameraConfig(): boolean {
    return !!(this.hass && this.configEntryId && this.printerId);
  }

  private _syncCloudCamera(): void {
    if (this.cameraEntity) {
      void this._stopCloudCamera();
      return;
    }

    if (this.showVideo && this._hasCloudCameraConfig()) {
      void this._startCloudCamera();
      return;
    }

    void this._stopCloudCamera();
  }

  private async _startCloudCamera(): Promise<void> {
    const requestId = ++this._startRequest;

    await this._stopCloudCamera(false);

    if (!this._hasCloudCameraConfig()) {
      return;
    }

    this.cloudCameraStatus = "connecting";
    this.cloudCameraError = undefined;

    try {
      const session = await this.hass.callWS<AnycubicCameraSession>({
        type: "anycubic_ha_integration/camera_session",
        config_entry: this.configEntryId,
        printer_id: Number(this.printerId),
      });

      if (requestId !== this._startRequest || !this.showVideo) {
        return;
      }

      const client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264",
        role: "host",
      });
      this._agoraClient = client;

      client.on(
        "user-published",
        (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
          if (mediaType === "video") {
            void this._subscribeRemoteVideo(user);
          }
        },
      );

      client.on("user-unpublished", () => {
        this._remoteVideoTrack?.stop();
        this._remoteVideoTrack = undefined;
        this.cloudCameraStatus = "error";
        this.cloudCameraError = this._localize("camera.errors.stream_interrupted");
      });

      client.on("user-left", () => {
        this._remoteVideoTrack?.stop();
        this._remoteVideoTrack = undefined;
        this.cloudCameraStatus = "error";
        this.cloudCameraError = this._localize("camera.errors.camera_left");
      });

      client.on("connection-state-change", (currentState: string) => {
        if (["DISCONNECTED", "FAILED"].includes(currentState)) {
          this.cloudCameraStatus = "error";
          this.cloudCameraError = this._localize("camera.errors.connection_lost");
        }
      });

      client.on("token-privilege-will-expire", () => {
        void this._renewCloudCameraToken();
      });

      client.on("token-privilege-did-expire", () => {
        this.cloudCameraStatus = "error";
        this.cloudCameraError = this._localize("camera.errors.session_expired");
      });

      if (!window.isSecureContext || !window.crypto?.subtle) {
        throw new Error("secure_context_required");
      }

      client.setEncryptionConfig(
        this._normaliseEncryptionMode(session.encryption_mode),
        session.encryption_key,
        this._base64ToUint8Array(session.encryption_kdf_salt),
      );
      await client.setClientRole("host");
      await client.join(
        session.appid,
        session.channel,
        session.rtc_token || null,
        session.client_uid || null,
      );

      if (requestId !== this._startRequest || !this.showVideo) {
        await this._stopCloudCamera(false);
        return;
      }

      await Promise.all(
        client.remoteUsers
          .filter((user) => user.hasVideo)
          .map((user) => this._subscribeRemoteVideo(user)),
      );

      if (requestId === this._startRequest) {
        this._startCameraKeepalive();
        this.cloudCameraStatus = "connected";
      }
    } catch (err) {
      if (requestId !== this._startRequest) {
        return;
      }
      this.cloudCameraError = this._formatCloudCameraError(err);
      this.cloudCameraStatus = "error";
      await this._stopCloudCamera(false);
    }
  }

  private async _subscribeRemoteVideo(
    user: IAgoraRTCRemoteUser,
  ): Promise<void> {
    if (!this._agoraClient || !this._videoElement) {
      return;
    }

    const track = await this._agoraClient.subscribe(user, "video");
    this._remoteVideoTrack?.stop();
    this._remoteVideoTrack = track;
    track.play(this._videoElement);
    this.cloudCameraStatus = "connected";
  }

  private async _stopCloudCamera(
    invalidateStartRequest: boolean = true,
  ): Promise<void> {
    if (invalidateStartRequest) {
      this._startRequest++;
    }

    this._remoteVideoTrack?.stop();
    this._remoteVideoTrack = undefined;
    this._stopCameraKeepalive();

    const client = this._agoraClient;
    this._agoraClient = undefined;
    if (client) {
      client.removeAllListeners();
      try {
        await client.leave();
      } catch (_err) {
        // The client can already be leaving when the user closes the overlay.
      }
    }

    if (!this.showVideo) {
      this.cloudCameraStatus = "idle";
      this.cloudCameraError = undefined;
    }
  }

  private _normaliseEncryptionMode(mode: string): EncryptionMode {
    return mode.toLowerCase().replace(/_/g, "-") as EncryptionMode;
  }

  private _base64ToUint8Array(value: string): Uint8Array {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private async _renewCloudCameraToken(): Promise<void> {
    if (!this._agoraClient || !this._hasCloudCameraConfig()) {
      return;
    }

    try {
      const session = await this.hass.callWS<AnycubicCameraSession>({
        type: "anycubic_ha_integration/camera_session",
        config_entry: this.configEntryId,
        printer_id: Number(this.printerId),
      });
      await this._agoraClient.renewToken(session.rtc_token);
    } catch (_err) {
      this.cloudCameraStatus = "error";
      this.cloudCameraError = this._localize("camera.errors.session_renew_failed");
    }
  }

  private _startCameraKeepalive(): void {
    this._stopCameraKeepalive();
    this._cameraKeepaliveTimer = window.setInterval(() => {
      void this._renewCloudCameraToken();
    }, 10000);
  }

  private _stopCameraKeepalive(): void {
    if (this._cameraKeepaliveTimer === undefined) {
      return;
    }

    window.clearInterval(this._cameraKeepaliveTimer);
    this._cameraKeepaliveTimer = undefined;
  }

  private _formatCloudCameraError(err: unknown): string {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("secure_context_required") ||
      message.includes("importKey") ||
      message.includes("crypto")
    ) {
      return this._localize("camera.errors.secure_context_required");
    }

    return message;
  }

  private _localize(key: string): string {
    return localize(key, this.language || this.hass?.language || "en");
  }

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
      }

      .ac-printercard-cameraview {
        background-color: black;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }

      .ac-camera-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      .ac-camera-video {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .ac-camera-media {
        transform-origin: center;
        transition: transform 160ms ease;
      }

      .ac-camera-image-zoom {
        background-position: center;
        background-size: cover;
        position: absolute;
        inset: 0;
      }

      .ac-camera-video video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ac-camera-status {
        color: white;
        font-size: 14px;
        left: 50%;
        line-height: 1.3;
        max-width: min(80%, 320px);
        position: absolute;
        text-align: center;
        text-shadow: 0 1px 2px rgb(0 0 0 / 70%);
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .ac-camera-controls {
        align-items: center;
        background: rgb(0 0 0 / 62%);
        border-radius: 8px;
        bottom: 12px;
        color: white;
        display: flex;
        gap: 6px;
        left: 50%;
        padding: 6px;
        position: absolute;
        transform: translateX(-50%);
        z-index: 2;
      }

      .ac-camera-control {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        display: inline-flex;
        height: 36px;
        justify-content: center;
        padding: 0;
        width: 36px;
      }

      .ac-camera-control:hover,
      .ac-camera-control:focus-visible {
        background: rgb(255 255 255 / 18%);
      }

      .ac-camera-control ha-svg-icon {
        width: 22px;
        height: 22px;
      }

      .ac-camera-zoom {
        font-size: 13px;
        font-weight: 700;
        min-width: 42px;
        text-align: center;
      }
    `;
  }
}
