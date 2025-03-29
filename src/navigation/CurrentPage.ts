import { GuestType, SourceWithPool, SourceWithPoolType } from "patron-oop";

export class CurrentPage implements SourceWithPoolType<string> {
  private source: SourceWithPoolType<string>;

  public constructor() {
    const correctUrl = location.href.replace(location.origin, "");
    this.source = new SourceWithPool(correctUrl);
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
