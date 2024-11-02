import { GuestObjectType } from "patron-oop";

export class ClassToggle implements GuestObjectType<HTMLElement> {
  public constructor(
    private toggleClass: string,
    private resetClassSelector: string,
  ) {}

  public give(element: HTMLElement): this {
    document.querySelectorAll(this.resetClassSelector).forEach((el) => {
      el.classList.remove(this.toggleClass);
    });
    element.classList.add(this.toggleClass);
    return this;
  }
}
