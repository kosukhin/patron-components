import {
  GuestType,
  Patron,
  SourceObjectType,
  SourceType,
  SourceWithPool,
  value,
} from "patron-oop";

export class JSDomElement implements SourceObjectType<HTMLElement> {
  private source = new SourceWithPool<HTMLElement>();

  public constructor(documentSource: SourceType<Document>, html: string) {
    value(
      documentSource,
      new Patron((document) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        this.source.give(div.children[0] as HTMLElement);
      }),
    );
  }

  public value(guest: GuestType<HTMLElement>) {
    value(this.source, guest);
    return this;
  }
}
