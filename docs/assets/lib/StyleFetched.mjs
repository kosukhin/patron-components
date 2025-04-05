export class StyleFetched {
  constructor(styleUrl) {
    this.styleUrl = styleUrl;
  }

  install() {
    fetch(this.styleUrl)
      .then((r) => r.text())
      .then((styleContent) => {
        const styleEl = document.createElement("style");
        styleEl.textContent = styleContent;
        document.head.appendChild(styleEl);
        document.body.classList.remove("body-loading");
      });
  }
}
