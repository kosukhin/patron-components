import { GuestSync, Patron } from "patron-oop";
import { SourceResetable } from "../behviours/SourceResetable";
import { expect, test } from "vitest";

test("SourceResetable.test", () => {
  const info = new SourceResetable({
    name: "initial",
    surname: "initial",
  });

  info.give({
    name: "new",
    surname: "new",
  });

  const g = new GuestSync<any>(null);
  info.value(new Patron(g));

  expect(g.value()?.name).toBe("new");

  info.reset().give();
  expect(g.value()?.name).toBe("initial");
});
