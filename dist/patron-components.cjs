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
    const chain = new patronOop.GuestChain();
    this.basePath.value(new patronOop.Patron(chain.receiveKey("basePath")));
    this.currentPage.value(new patronOop.Patron(chain.receiveKey("currentPage")));
    chain.result(
      new patronOop.Patron(({ basePath, currentPage }) => {
        const urlWithoutBasePath = currentPage.replace(basePath, "");
        const routeMatchedToAlias = routes.find(
          (route2) => route2.aliases && (route2.aliases.includes(currentPage) || route2.aliases.includes(urlWithoutBasePath))
        );
        if (routeMatchedToAlias && routeMatchedToAlias.url !== currentPage) {
          const correctUrl = basePath + routeMatchedToAlias.url;
          this.currentPage.give(correctUrl);
          return;
        }
        let route = routes.find(
          (route2) => route2.url === urlWithoutBasePath
        );
        if (!route && defaultRoute) {
          route = defaultRoute;
        }
        if (route) {
          const basePathWithoutHash = basePath.replace("/#", "");
          this.loading.give(true);
          this.pageTransport.create(basePathWithoutHash, route.template).content((templateContent) => {
            this.display.display(templateContent);
            route.page.mounted();
            this.loading.give(false);
          });
        } else {
          throw new Error("No matching route in Navigation");
        }
      })
    );
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
    __publicField(this, "source");
    const correctUrl = location.href.replace(location.origin, "");
    this.source = new patronOop.Source(correctUrl);
  }
  give(value) {
    this.source.give(value);
    return this;
  }
  value(guest) {
    this.source.value(guest);
    return guest;
  }
}

class Input {
  constructor(source, selector) {
    this.source = source;
    const el = document.querySelector(selector);
    this.source.value(
      new patronOop.Patron((value) => {
        el.value = String(value);
      })
    );
    el.addEventListener("keyup", () => {
      this.give(el.value);
    });
    el.addEventListener("change", () => {
      this.give(el.value);
    });
  }
  value(guest) {
    this.source.value(guest);
    return this;
  }
  give(value) {
    this.source.give(value);
    return this;
  }
}

class Visible {
  constructor(selector) {
    this.selector = selector;
  }
  give(isVisible) {
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
  give(value) {
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
          this.basePath.value((basePath) => {
            this.linkSource.give(basePath + href);
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
      source.source.value(
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

class ClassToggle {
  constructor(toggleClass, resetClassSelector) {
    this.toggleClass = toggleClass;
    this.resetClassSelector = resetClassSelector;
  }
  give(element) {
    document.querySelectorAll(this.resetClassSelector).forEach((el) => {
      el.classList.remove(this.toggleClass);
    });
    element.classList.add(this.toggleClass);
    return this;
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

class EntryPointPage {
  constructor(title, entryPointUrl) {
    this.title = title;
    this.entryPointUrl = entryPointUrl;
  }
  mounted() {
    document.title = this.title;
    import(this.entryPointUrl).then((module) => {
      if (module.main) {
        module.main();
      }
    });
  }
}

exports.ClassToggle = ClassToggle;
exports.ComputedElement = ComputedElement;
exports.CurrentPage = CurrentPage;
exports.EntryPointPage = EntryPointPage;
exports.Input = Input;
exports.Link = Link;
exports.Navigation = Navigation;
exports.Page = Page;
exports.PageFetchTransport = PageFetchTransport;
exports.RouteDisplay = RouteDisplay;
exports.Text = Text;
exports.Visible = Visible;
//# sourceMappingURL=patron-components.cjs.map