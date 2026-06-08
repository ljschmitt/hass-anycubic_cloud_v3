import { state } from "lit/decorators.js";

import { AnycubicViewPrintBase } from "./view-print-base";
import { customElementIfUndef } from "../../internal/register-custom-element";

@customElementIfUndef("anycubic-view-print-no_cloud_save")
export class AnycubicViewPrintNoCloudSave extends AnycubicViewPrintBase {
  @state()
  protected _serviceName: string = "print_and_upload_no_cloud_save";
}
