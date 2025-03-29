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
    const chain = new patronOop.GuestAwareAll();
    this.basePath.value(new patronOop.Patron(chain.guestKey("basePath")));
    this.currentPage.value(new patronOop.Patron(chain.guestKey("currentPage")));
    chain.value(
      new patronOop.Patron(({ basePath, currentPage }) => {
        const urlWithoutBasePath = currentPage.replace(basePath, "");
        const routeMatchedToAlias = routes.find(
          (route2) => route2.aliases && (route2.aliases.includes(currentPage) || route2.aliases.includes(urlWithoutBasePath))
        );
        if (routeMatchedToAlias) {
          const correctUrl = basePath + routeMatchedToAlias.url;
          if (correctUrl !== currentPage) {
            this.currentPage.give(correctUrl);
            return;
          }
        }
        let route = routes.find(
          (route2) => {
            if (route2.url.indexOf("*") >= 0) {
              const regexp = new RegExp(
                route2.url.replaceAll("*", ".*").replaceAll("/", "/")
              );
              return regexp.test(urlWithoutBasePath);
            }
            return route2.url.replaceAll("*", "") === urlWithoutBasePath;
          }
        );
        if (!route && defaultRoute) {
          route = defaultRoute;
        }
        if (route) {
          const basePathWithoutHash = basePath.replace("/#", "");
          this.loading.give(true);
          this.pageTransport.get(basePathWithoutHash, route.template).content((templateContent) => {
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
    this.source = new patronOop.SourceWithPool(correctUrl);
  }
  give(value) {
    this.source.give(value);
    return this;
  }
  value(guest) {
    this.source.value(guest);
    return guest;
  }
  pool() {
    return this.source.pool();
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
  pool() {
    return this.source.pool();
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
  watchClick(selector, subselector) {
    const wrapperEl = document.querySelectorAll(selector);
    if (wrapperEl.length) {
      wrapperEl.forEach((theElement) => {
        theElement.addEventListener("click", (e) => {
          if (subselector) {
            theElement.querySelectorAll(subselector).forEach((theSubElement) => {
              if (e?.target === theSubElement || e?.currentTarget === theSubElement) {
                this.handleClick({
                  preventDefault: e.preventDefault.bind(e),
                  target: theSubElement
                });
              }
            });
          } else {
            this.handleClick(e);
          }
        });
      });
    } else {
      throw new Error(`Link wrapper not found for selector ${selector}`);
    }
  }
  handleClick(e) {
    let href = e?.target?.getAttribute("href");
    if (!href) {
      href = e?.currentTarget?.getAttribute("href");
    }
    if (href && href.indexOf("http") !== 0) {
      e.preventDefault();
      patronOop.value(this.basePath, (basePath) => {
        this.linkSource.give(basePath + href);
      });
    }
  }
}

class ComputedElement {
  constructor(sources, selectorTemplate) {
    this.sources = sources;
    this.selectorTemplate = selectorTemplate;
  }
  element(guest) {
    const chain = new patronOop.SourceAll();
    this.sources.forEach((source) => {
      source.source.value(
        new patronOop.GuestCast(guest, chain.guestKey(source.placeholder))
      );
    });
    chain.value(
      new patronOop.GuestCast(
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
