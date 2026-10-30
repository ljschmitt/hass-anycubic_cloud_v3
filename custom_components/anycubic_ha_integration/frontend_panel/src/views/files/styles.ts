import { CSSResult, css } from "lit";

export const commonFilesStyle: CSSResult = css`
  :host {
    padding: 16px;
    display: block;
  }

  .files-card {
    padding: 16px;
    display: block;
    font-size: 18px;
    margin: 0 auto;
    text-align: center;
  }

  .files-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }

  .file-toolbar {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .file-status-msg {
    color: var(--secondary-text-color);
    font-size: 16px;
    font-weight: 700;
    margin: 16px 0 24px;
  }

  .file-info {
    display: flex;
    min-height: 20px;
    min-width: 250px;
    border: 2px solid #ccc3;
    border-radius: 16px;
    padding: 16px 32px;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  .file-actions {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .file-name {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 8px;
    line-height: 20px;
    text-align: left;
    font-weight: 900;
    margin: 6px;
    word-wrap: break-word;
    max-width: none;
    min-width: 0;
  }

  .file-name span {
    overflow-wrap: anywhere;
  }

  .file-open-button {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    width: 100%;
    max-width: none;
    padding: 0;
  }

  .file-info:hover {
    background-color: #ccc3;
    border-color: #ccc9;
  }

  .file-refresh-button {
    padding: 10px;
  }

  .file-refresh-icon {
    --mdc-icon-size: 50px;
  }

  .file-delete-button {
    padding: 4px;
    margin-left: 10px;
  }

  .file-action-button {
    padding: 4px;
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .print-preparation {
    max-width: 760px;
    text-align: left;
  }

  .print-preparation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .print-preparation-header h2 {
    margin: 0;
    font-size: 24px;
  }

  .print-preparation-details {
    display: grid;
    gap: 12px;
    margin: 24px 0;
  }

  .print-preparation-details div {
    display: grid;
    grid-template-columns: minmax(120px, 180px) 1fr;
    gap: 16px;
    align-items: start;
  }

  .print-preparation-details dt {
    font-weight: 700;
    color: var(--secondary-text-color);
  }

  .print-preparation-details dd {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .slot-list-label {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .print-slot-selection {
    margin-top: 24px;
  }

  .print-slot-selection h3 {
    margin: 0 0 6px;
    font-size: 18px;
  }

  .print-slot-selection p,
  .manual-slot-entry p {
    margin: 0 0 14px;
    color: var(--secondary-text-color);
  }

  .print-slot-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
    gap: 10px;
  }

  .print-slot-option {
    position: relative;
    display: grid;
    min-width: 0;
    min-height: 118px;
    padding: 12px 8px 10px;
    place-items: center;
    align-content: start;
    gap: 5px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    cursor: pointer;
  }

  .print-slot-option:hover,
  .print-slot-option.selected {
    border-color: var(--primary-color);
  }

  .print-slot-option.selected {
    background: color-mix(
      in srgb,
      var(--primary-color) 10%,
      var(--card-background-color)
    );
  }

  .print-slot-color {
    display: grid;
    width: 46px;
    height: 46px;
    place-items: center;
    border: 2px solid
      color-mix(in srgb, var(--slot-color) 70%, var(--primary-text-color));
    border-radius: 50%;
    background: var(--slot-color);
    color: var(--slot-contrast);
    font-weight: 700;
  }

  .print-slot-material {
    width: 100%;
    overflow-wrap: anywhere;
    font-weight: 700;
    line-height: 1.15;
    text-align: center;
  }

  .print-slot-source {
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .print-slot-order {
    position: absolute;
    top: 6px;
    right: 6px;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--text-primary-color);
    font-size: 12px;
    font-weight: 700;
  }

  .manual-slot-entry {
    margin-top: 20px;
    padding-top: 2px;
  }

  .manual-slot-entry summary {
    width: fit-content;
    color: var(--secondary-text-color);
    cursor: pointer;
    font-weight: 700;
  }

  .manual-slot-entry[open] summary {
    margin-bottom: 10px;
  }

  .print-preview {
    display: flex;
    width: 100%;
    min-height: 220px;
    max-height: 360px;
    margin: 0 0 24px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--secondary-background-color);
  }

  .print-preview img {
    display: block;
    width: 100%;
    height: 100%;
    max-height: 360px;
    object-fit: contain;
  }

  .print-preview-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  .slot-list-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
  }

  .print-preparation-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .primary-button,
  .secondary-button {
    min-height: 44px;
    padding: 0 18px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .primary-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color);
  }

  .secondary-button {
    background: transparent;
    color: var(--primary-text-color);
  }

  .no-mqtt-msg {
  }

  @media (max-width: 599px) {
    :host {
      padding: 6px;
    }

    .files-card {
      padding: 0px;
    }

    .file-info {
      padding: 6px 6px;
      margin: 6px 0px;
    }

    .print-preparation-details div {
      grid-template-columns: 1fr;
      gap: 4px;
    }

    .print-preparation-actions {
      flex-direction: column-reverse;
    }

    .print-preview {
      min-height: 180px;
      max-height: 280px;
    }
  }
`;
