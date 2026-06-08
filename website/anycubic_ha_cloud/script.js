const copyButtons = document.querySelectorAll("[data-copy]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.querySelector("span")?.textContent || "Kopieren";
    const label = button.querySelector("span");

    try {
      await navigator.clipboard.writeText(button.dataset.copy || "");
      button.classList.add("copied");
      if (label) {
        label.textContent = "Kopiert";
      }
    } catch {
      if (label) {
        label.textContent = "Markieren";
      }
    }

    window.setTimeout(() => {
      button.classList.remove("copied");
      if (label) {
        label.textContent = originalText;
      }
    }, 1800);
  });
});
