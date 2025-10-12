import { CSSResult, LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";
import { LitTemplateResult } from "../../../types";

@customElementIfUndef("anycubic-printercard-stat-line")
export class AnycubicPrintercardStatLine extends LitElement {
  @property({ type: String })
  public name: string;

  @property({ type: String })
  public value: string;

  @property({ type: String })
  public unit?: string = "";

  render(): LitTemplateResult {
    return html`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}${this.unit}</p>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: inline-block;
        max-width: calc(100% - 120px);
        text-align: right;
        word-wrap: break-word;
      }

      .ac-stat-heading {
        font-weight: bold;
        max-width: unset;
        overflow: unset;
      }
    `;
  }
}
