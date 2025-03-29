import {
  give,
  GuestCast,
  GuestType,
  SourceObjectType,
  SourceType,
  value,
} from "patron-oop";

export class JSDomQuerySelector implements SourceObjectType<HTMLElement> {
  public constructor(
    private documentSource: SourceType<Document>,
    private selector: string,
  ) {}

  public value(guest: GuestType<HTMLElement>) {
    value(
      this.documentSource,
      new GuestCast(guest, (document) => {
        const el = document.querySelector(this.selector) as HTMLElement;
        if (el) {
          give(el, guest);
        }
      }),
    );
    return this;
  }
}
