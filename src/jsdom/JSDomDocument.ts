import { JSDOM } from "jsdom";
import { give, GuestType, SourceObjectType } from "patron-oop";

export class JSDomDocument implements SourceObjectType<Document> {
  private dom: JSDOM;

  public constructor(body: string = "") {
    this.dom = new JSDOM(`<!DOCTYPE html><body>${body}</body></html>`);
  }

  public value(guest: GuestType<Document>) {
    give(this.dom.window.document, guest);
    return this;
  }
}
