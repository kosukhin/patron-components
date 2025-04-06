import {
  Guest,
  GuestObjectType,
  GuestType,
  SourceObjectType,
  SourceWithPool,
  value,
} from "patron-oop";

export class SourceResetable<T>
  implements SourceObjectType<T>, GuestObjectType<T>
{
  private source: SourceWithPool<T>;
  private firstValue: string;

  public constructor(firstValue: T) {
    this.firstValue = JSON.stringify(firstValue);
    this.source = new SourceWithPool(JSON.parse(this.firstValue));
  }

  public reset() {
    return new Guest<void>(() => {
      if (this.firstValue) {
        this.source.give(JSON.parse(this.firstValue));
      }
    });
  }

  public give(value: T): this {
    this.source.give(value);
    return this;
  }

  public value(guest: GuestType<T>) {
    value(this.source, guest);
    return this;
  }
}
