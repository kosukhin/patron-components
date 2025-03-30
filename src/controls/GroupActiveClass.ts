import { GuestObjectType, PatronOnce, SourceType, value } from "patron-oop";

/**
 * Sets activeClass to one element of group
 * and resets activeClass on other group elements
 * suitable for menu active class
 */
export class GroupActiveClass implements GuestObjectType<HTMLElement> {
  public constructor(
    private activeClass: string,
    private groupSelector: string,
    private document: SourceType<Document>,
  ) {}

  public give(element: HTMLElement): this {
    value(
      this.document,
      new PatronOnce((document) => {
        document.querySelectorAll(this.groupSelector).forEach((el) => {
          el.classList.remove(this.activeClass);
        });
        element.classList.add(this.activeClass);
      }),
    );
    return this;
  }
}
