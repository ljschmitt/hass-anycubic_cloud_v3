"use strict";

// Only public shell commands are copied here. Tokens stay on the user's device.
document.querySelectorAll("[data-copy-command]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copyCommand);
    const status = document.getElementById(button.getAttribute("aria-describedby"));
    const command = code.textContent;
    const previousFocus = document.activeElement;
    button.disabled = true;
    status.textContent = "";
    let copied = false;

    try {
      await navigator.clipboard.writeText(command);
      copied = true;
    } catch {
      // Also support browsers that deny the asynchronous clipboard API.
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.readOnly = true;
      textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(textarea);
      try {
        textarea.focus();
        textarea.select();
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        textarea.remove();
      }
    } finally {
      button.disabled = false;
      previousFocus?.focus();
    }

    if (!copied) {
      // Keep the complete command selected for manual Ctrl+C / Cmd+C.
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    status.textContent = copied ? button.dataset.success : button.dataset.failure;
  });
});
