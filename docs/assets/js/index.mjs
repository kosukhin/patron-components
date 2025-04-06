import { CurrentPage, Link, Page, Router } from "patron-components";
import { Patron, PatronOnce, SourceWithPool, sourceOf } from "patron-oop";
import { Attribute, Element, Fetched, StyleInstalled } from "patron-web-api";
import { StyleFetched } from "../lib/StyleFetched.mjs";

new StyleFetched(
  "https://raw.githubusercontent.com/kosukhin/patorn-design-system/refs/heads/main/dist/assets/index.css",
).install();

const routing = new Router(".loader", ".page-area", ".menu");

const [basePath] = location.href.replace(location.origin, "").split("#");
const cleanBasePath = basePath.replace(/[^/]+\.html$/, "");
const currentPage = new CurrentPage();
const basePathSource = new SourceWithPool(
  `${basePath}#`.replace("index.html", "").replace("//", "/"),
);

const link = new Link(currentPage, basePathSource);
link.watchClick(".global-body", "a.dynamic-navigation");

const dynamicPage = new Page("Dynamic page");

const errors = new SourceWithPool();
const routesTransport = new Fetched(errors);

routesTransport.do().give({
  url: `${cleanBasePath}routes.json`,
  asJson: true,
});

const styleLink = new Attribute(
  new Element(sourceOf(".style-link")),
  "data-style",
);
const styleTransport = new Fetched(errors);
styleLink.value((url) => {
  styleTransport.do().give({ url });
});
styleTransport.result().value(new PatronOnce(new StyleInstalled()));

routesTransport.result().value(
  new Patron((routes) => {
    const dynamicRoutes = routes.map((route) => ({
      url: "/" + route.replace("pages/", "").replace(".html", "").trim(),
      template: route,
      page: dynamicPage,
    }));

    routing.routes(
      [
        {
          url: "/",
          template: "pages/index.html",
          aliases: [basePath, `${basePath}index.html`, ""],
          page: new Page("Patron Components"),
        },
        ...dynamicRoutes,
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
  }),
);
