import { JSDOM } from "jsdom";
import { give, GuestType, SourceObjectType } from "patron-oop";

export class JSDomElement implements SourceObjectType<HTMLElement> {
  private dom = new JSDOM(`<!DOCTYPE html><body></body></html>`);
  private element: HTMLElement;

  public constructor(html: string) {
    const document = this.dom.window.document;
    const div = document.createElement("div");
    div.innerHTML = html;
    this.element = div;
  }

  public value(guest: GuestType<HTMLElement>) {
    give(this.element, guest);
    return this;
  }
}
