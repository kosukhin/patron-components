import { GuestObjectType } from "patron-oop";

export class Text implements GuestObjectType {
  public constructor(private selector: string) {}

  public receive(value: unknown) {
    const element = document.querySelector(this.selector) as HTMLElement;
    if (element) {
      element.innerText = String(value);
    }
    return this;
  }
}
