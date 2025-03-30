import { GuestType, Patron, SourceWithPoolType } from "patron-oop";

type InputValue = number | string;

export class Input implements SourceWithPoolType<InputValue> {
  public constructor(
    private source: SourceWithPoolType<InputValue>,
    selector: string,
  ) {
    const el = document.querySelector(selector) as HTMLInputElement;
    this.source.value(
      new Patron((value) => {
        el.value = String(value);
      }),
    );
    el.addEventListener("keyup", () => {
      this.give(el.value);
    });
    el.addEventListener("change", () => {
      this.give(el.value);
    });
  }

  public value(guest: GuestType<InputValue>) {
    this.source.value(guest);
    return this;
  }

  public give(value: InputValue) {
    this.source.give(value);
    return this;
  }

  public pool() {
    return this.source.pool();
  }
}
