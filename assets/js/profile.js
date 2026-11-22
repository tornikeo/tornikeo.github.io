const portraitLink = document.querySelector("[data-portrait-open]");
const portraitDialog = document.getElementById("portrait-dialog");
const zoomButton = portraitDialog.querySelector("[data-portrait-zoom]");

portraitLink.addEventListener("click", event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !portraitDialog.showModal) return;

  event.preventDefault();
  portraitDialog.showModal();
});

zoomButton.addEventListener("click", () => {
  const zoomed = portraitDialog.toggleAttribute("data-zoomed");
  zoomButton.setAttribute("aria-pressed", zoomed);
});

portraitDialog.addEventListener("click", event => {
  if (event.target === portraitDialog) portraitDialog.close();
});

portraitDialog.addEventListener("close", () => {
  portraitDialog.removeAttribute("data-zoomed");
  zoomButton.setAttribute("aria-pressed", "false");
  portraitLink.focus();
});

const nameButton = document.querySelector("[data-pronunciation]");
const nameAudio = document.getElementById("name-audio");

if (nameButton && nameAudio) {
  function sayName() {
    if (!nameAudio.paused) return;
    nameAudio.currentTime = 0;
    nameAudio.play().catch(() => {});
  }

  nameButton.addEventListener("click", sayName);
  nameButton.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") sayName();
  });

  nameAudio.addEventListener("playing", () => { nameButton.dataset.speaking = ""; });
  for (const event of ["ended", "pause", "error"]) {
    nameAudio.addEventListener(event, () => { delete nameButton.dataset.speaking; });
  }
}
