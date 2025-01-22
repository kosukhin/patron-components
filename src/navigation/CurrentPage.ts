import {
  GuestType,
  Source,
  SourceType
} from "patron-oop";

export class CurrentPage implements SourceType<string> {
  private source: SourceType<string>;

  public constructor() {
    const correctUrl = location.href.replace(location.origin, "");
    this.source = new Source(correctUrl);
  }

  public give(value: string): this {
    this.source.give(value);
    return this;
  }

  public value(guest: GuestType<string>) {
    this.source.value(guest);
    return guest;
  }

  public pool() {
    return this.source.pool();
  }
}
