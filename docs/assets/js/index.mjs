import { CurrentPage, Link, Page, Router } from "patron-components";
import { SourceWithPool } from "patron-oop";
import { StyleFetched } from "../lib/StyleFetched.mjs";

new StyleFetched(
  "https://raw.githubusercontent.com/kosukhin/patorn-design-system/refs/heads/main/dist/assets/index.css",
).install();

const routing = new Router(".loader", ".page-area", ".menu");

const [basePath] = location.href.replace(location.origin, "").split("#");
const currentPage = new CurrentPage();
const basePathSource = new SourceWithPool(
  `${basePath}#`.replace("index.html", "").replace("//", "/"),
);

const link = new Link(currentPage, basePathSource);
link.watchClick(".global-body", ".dynamic-navigation > a");

routing.routes(
  [
    {
      url: "/",
      template: "pages/index.html",
      aliases: [basePath, `${basePath}index.html`, ""],
      page: new Page("Patron Components"),
    },
    {
      url: "",
      template: "pages/404.html",
      page: new Page("Страница не найдена"),
      default: true,
    },
  ],
  currentPage,
  basePathSource,
);
