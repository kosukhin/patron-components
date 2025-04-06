import { GuestObjectType } from "patron-oop";

/**
 * @deprecated Move to web api
 */
export class Text implements GuestObjectType {
  public constructor(private selector: string) {}

  public give(value: unknown) {
    const element = document.querySelector(this.selector) as HTMLElement;
    if (element) {
      element.innerText = String(value);
    }
    return this;
  }
}
