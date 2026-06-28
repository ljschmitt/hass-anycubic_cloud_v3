import { PropertyValues } from "lit";

import { AnycubicViewFilesBase } from "./view-files_base";
import { platform } from "../../const";
import { customElementIfUndef } from "../../internal/register-custom-element";
import {
  getEntityState,
  getFileListUdiskFilesEntity,
  getFileListUdiskRefreshEntity,
} from "../../helpers";
import {
  AnycubicFileListEntity,
  AnycubicFileLocal,
  DomClickEvent,
  EvtTargFileInfo,
} from "../../types";

@customElementIfUndef("anycubic-view-files_udisk")
export class AnycubicViewFilesUdisk extends AnycubicViewFilesBase {
  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      const fileListState: AnycubicFileListEntity | undefined = getEntityState(
        this.hass,
        getFileListUdiskFilesEntity(this.printerEntities),
      );
      this._fileArray = fileListState
        ? fileListState.attributes.file_info
        : undefined;
      this._currentPath = this.normalizePath(fileListState?.attributes.path);
      this._listRefreshEntity = getFileListUdiskRefreshEntity(
        this.printerEntities,
      );
    }
  }

  protected requestFileList = (path: string): void => {
    this.requestFileListService("request_file_list_udisk", path);
  };

  deleteFile = (ev: DomClickEvent<EvtTargFileInfo>): void => {
    const fileInfo: AnycubicFileLocal = ev.currentTarget
      .file_info as AnycubicFileLocal;
    if (this.selectedPrinterDevice && fileInfo.name) {
      this._isDeleting = true;
      this.hass
        .callService(platform, "delete_file_udisk", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          filename: fileInfo.name,
          path: this._currentPath,
        })
        .then(() => {
          this._isDeleting = false;
        })
        .catch((_e: unknown) => {
          this._isDeleting = false;
        });
    }
  };
}
