import { GuestSync } from "patron-oop";
import { JSDomQuerySelector } from "../jsdom/JSDomQuerySelector";
import { expect, test } from "vitest";
import { JSDomDocument } from "../jsdom/JSDomDocument";
import { GroupActiveClass } from "./GroupActiveClass";

test("GroupActiveClass.test", () => {
  const document = new JSDomDocument(`<div class="menu">
    <div id="prev-active" class="menu-link active">One</div>
    <div class="menu-link">Two</div>
    <div id="next-active" class="menu-link">Three</div>
  </div>`);
  const element = new JSDomQuerySelector(document, "#next-active");
  const classActive = new GroupActiveClass("active", ".menu-link", document);
  const g = new GuestSync<Document>(null as unknown as Document);

  element.value(classActive);
  document.value(g);

  expect(g.value().body.innerHTML).toContain(
    'id="next-active" class="menu-link active"',
  );
  expect(g.value().body.innerHTML).toContain(
    'id="prev-active" class="menu-link"',
  );
});
