import { GuestSync, SourceWithPool } from "patron-oop";
import { Dirty } from "../behaviors/Dirty";
import { expect, test } from "vitest";

test("GroupActiveClass.test", () => {
  const form = new SourceWithPool({
    name: "one",
    surname: "two",
  });
  const dirtyForm = new Dirty(form);
  dirtyForm.give({
    name: "new",
    surname: "two",
  });

  const g = new GuestSync(null as unknown);
  dirtyForm.value(g);

  expect(g.value).toBe({ name: "new" });
});
