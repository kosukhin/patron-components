export interface RouteDisplayType {
  display(content: string): void;
}

/**
 * Renders content on selector
 */
export class RouteDisplay implements RouteDisplayType {
  public constructor(private selector: string) {}

  public display(content: string): void {
    const contentEl = document.querySelector(this.selector);
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }
}
