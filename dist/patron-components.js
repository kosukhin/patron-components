'use strict';

var patronOop = require('patron-oop');

class PageFetchTransport {
  constructor(basePath, template) {
    this.basePath = basePath;
    this.template = template;
  }
  content(guest) {
    fetch(this.basePath + "/" + this.template).then((result) => {
      return result.text();
    }).then((result) => {
      patronOop.give(result, guest);
    });
  }
}

class Navigation {
  constructor(loading, basePath, currentPage, display, pageTransport) {
    this.loading = loading;
    this.basePath = basePath;
    this.currentPage = currentPage;
    this.display = display;
    this.pageTransport = pageTransport;
  }
  routes(routes) {
    const defaultRoute = routes.find((route) => route.default);
    this.firstLoad(() => {
      this.currentPage.page(
        new patronOop.Patron((value) => {
          this.loading.receive(true);
          this.basePath.receiving((basePath) => {
            basePath = basePath.replace("/#", "");
            let currentUrl = value.url === "/" ? basePath + "/" : value.url;
            currentUrl = currentUrl.replace("#", "").replace("//", "/");
            let route = routes.find(
              (route2) => basePath + route2.url === currentUrl
            );
            if (!route && defaultRoute) {
              route = defaultRoute;
            }
            if (route) {
              this.pageTransport.create(basePath, route.template).content((templateContent) => {
                this.display.display(templateContent);
                route.page.mounted();
                this.loading.receive(false);
              });
            }
          });
        })
      );
    });
  }
  firstLoad(guest) {
    const chain = new patronOop.GuestChain();
    this.basePath.receiving(chain.receiveKey("basePath"));
    this.currentPage.page(chain.receiveKey("currentPage"));
    chain.result(() => {
      patronOop.give(null, guest);
    });
  }
}

class RouteDisplay {
  constructor(selector) {
    this.selector = selector;
  }
  display(content) {
    const contentEl = document.querySelector(this.selector);
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class CurrentPage {
  constructor() {
    __publicField(this, "source", new patronOop.Source("/"));
    const correctUrl = location.href.replace(location.origin, "");
    this.source.receive(correctUrl);
  }
  receive(value) {
    this.source.receive(value);
    return this;
  }
  receiving(guest) {
    this.source.receiving(
      new patronOop.GuestMiddle(guest, (url) => {
        patronOop.give(
          {
            title: "Loading",
            url
          },
          guest
        );
      })
    );
    return guest;
  }
}

class Input {
  constructor(source, selector) {
    this.source = source;
    const el = document.querySelector(selector);
    this.source.receiving(
      new patronOop.Patron((value) => {
        el.value = String(value);
      })
    );
    el.addEventListener("keyup", () => {
      this.receive(el.value);
    });
    el.addEventListener("change", () => {
      this.receive(el.value);
    });
  }
  receiving(guest) {
    this.source.receiving(guest);
    return this;
  }
  receive(value) {
    this.source.receive(value);
    return this;
  }
}

class Visible {
  constructor(selector) {
    this.selector = selector;
  }
  receive(isVisible) {
    const el = document.querySelector(this.selector);
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
    return this;
  }
}

class Text {
  constructor(selector) {
    this.selector = selector;
  }
  receive(value) {
    const element = document.querySelector(this.selector);
    if (element) {
      element.innerText = String(value);
    }
    return this;
  }
}

class Link {
  constructor(linkSource, basePath) {
    this.linkSource = linkSource;
    this.basePath = basePath;
  }
  watchClick(selector) {
    const wrapperEl = document.querySelector(selector);
    if (wrapperEl) {
      wrapperEl.addEventListener("click", (e) => {
        e.preventDefault();
        let href = e?.target?.getAttribute("href");
        if (!href) {
          href = e?.currentTarget?.getAttribute("href");
        }
        if (href) {
          this.basePath.receiving((basePath) => {
            this.linkSource.receive(basePath + href);
          });
        }
      });
    } else {
      throw new Error(`Link wrapper not found for selector ${selector}`);
    }
  }
}

class ComputedElement {
  constructor(sources, selectorTemplate) {
    this.sources = sources;
    this.selectorTemplate = selectorTemplate;
  }
  element(guest) {
    const chain = new patronOop.GuestChain();
    this.sources.forEach((source) => {
      source.source.receiving(
        new patronOop.GuestCast(guest, chain.receiveKey(source.placeholder))
      );
    });
    chain.result(
      new patronOop.GuestMiddle(
        guest,
        (placeholders) => {
          let selectorTemplate = this.selectorTemplate;
          Object.entries(placeholders).map((entry) => {
            selectorTemplate = selectorTemplate.replaceAll(entry[0], entry[1]);
          });
          const element = document.querySelector(
            selectorTemplate
          );
          if (element) {
            patronOop.give(element, guest);
          }
        }
      )
    );
  }
}

class Page {
  constructor(title) {
    this.title = title;
  }
  mounted() {
    document.title = this.title;
  }
}

exports.ComputedElement = ComputedElement;
exports.CurrentPage = CurrentPage;
exports.Input = Input;
exports.Link = Link;
exports.Navigation = Navigation;
exports.Page = Page;
exports.PageFetchTransport = PageFetchTransport;
exports.RouteDisplay = RouteDisplay;
exports.Text = Text;
exports.Visible = Visible;
//# sourceMappingURL=patron-components.js.map
