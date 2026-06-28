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

  .file-name {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 20px;
    text-align: left;
    font-weight: 900;
    margin: 6px;
    word-wrap: break-word;
    max-width: calc(100% - 58px);
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
    margin-left: 10px;
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
  }
`;
