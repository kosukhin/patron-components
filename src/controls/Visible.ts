import { GuestObjectType } from "patron-oop";

export class Visible implements GuestObjectType<boolean> {
  public constructor(private selector: string) {}

  public receive(isVisible: boolean): this {
    const el = document.querySelector(this.selector) as HTMLElement;
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
    return this;
  }
}
