import { GuestType, Patron, SourceType } from "patron-oop";

type InputValue = number | string;

export class Input implements SourceType<InputValue> {
  public constructor(
    private source: SourceType<InputValue>,
    selector: string,
  ) {
    const el = document.querySelector(selector) as HTMLInputElement;
    this.source.receiving(
      new Patron((value) => {
        el.value = String(value);
      }),
    );
    el.addEventListener("keyup", () => {
      this.receive(el.value);
    });
    el.addEventListener("change", () => {
      this.receive(el.value);
    });
  }

  public receiving(guest: GuestType<InputValue>) {
    this.source.receiving(guest);
    return this;
  }

  public receive(value: InputValue) {
    this.source.receive(value);
    return this;
  }
}
