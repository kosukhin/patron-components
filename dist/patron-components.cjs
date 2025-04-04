'use strict';

var patronOop = require('patron-oop');
var patronWebApi = require('patron-web-api');
var controls = require('src/controls');
var CurrentPage$1 = require('src/navigation/CurrentPage');
var Navigation$1 = require('src/navigation/Navigation');
var PageFetchTransport$1 = require('src/navigation/PageFetchTransport');
var RouteDisplay$1 = require('src/navigation/RouteDisplay');

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
    const all = new patronOop.SourceAll();
    patronOop.value(this.basePath, new patronOop.Patron(all.guestKey("basePath")));
    patronOop.value(this.currentPage, new patronOop.Patron(all.guestKey("currentPage")));
    all.value(
      new patronOop.Patron(({ basePath, currentPage }) => {
        const urlWithoutBasePath = currentPage.replace(basePath, "");
        const routeMatchedToAlias = routes.find(
          (route2) => route2.aliases && (route2.aliases.includes(currentPage) || route2.aliases.includes(urlWithoutBasePath))
        );
        if (routeMatchedToAlias) {
          const correctUrl = basePath + routeMatchedToAlias.url;
          if (correctUrl !== currentPage) {
            patronOop.give(correctUrl, this.currentPage);
            return;
          }
        }
        let route = routes.find((route2) => {
          if (route2.url.indexOf("*") >= 0) {
            const regexp = new RegExp(
              route2.url.replaceAll("*", ".*").replaceAll("/", "/")
            );
            return regexp.test(urlWithoutBasePath);
          }
          return route2.url.replaceAll("*", "") === urlWithoutBasePath;
        });
        if (!route && defaultRoute) {
          route = defaultRoute;
        }
        if (route) {
          const basePathWithoutHash = basePath.replace("/#", "").replace("#", "").replace(/[^/]+\.html$/, "");
          patronOop.give(true, this.loading);
          this.pageTransport.get(basePathWithoutHash, route.template).content((templateContent) => {
            this.display.display(templateContent);
            route.page.mounted();
            patronOop.give(false, this.loading);
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

class Router {
  constructor(loaderSelector, navigationResultSelector, menuSelector) {
    this.loaderSelector = loaderSelector;
    this.navigationResultSelector = navigationResultSelector;
    this.menuSelector = menuSelector;
  }
  routes(routes, currentPage, basePathSource, afterPageLoaded) {
    if (!currentPage) {
      currentPage = new CurrentPage$1.CurrentPage();
    }
    currentPage.value(new patronOop.Patron(new patronWebApi.HistoryNewPage()));
    const [basePath] = location.href.replace(location.origin, "").split("#");
    if (!basePathSource) {
      basePathSource = new patronOop.SourceWithPool(
        `${basePath}#`.replace("index.html", "").replace("//", "/")
      );
    }
    const pageLoading = new patronOop.SourceWithPool(false);
    pageLoading.value(new patronOop.Patron(new controls.Visible(this.loaderSelector)));
    const historyPoppedPage = new patronWebApi.HistoryPoppedPage(currentPage);
    historyPoppedPage.watchPop();
    const navigation = new Navigation$1.Navigation(
      pageLoading,
      basePathSource,
      currentPage,
      new RouteDisplay$1.RouteDisplay(this.navigationResultSelector),
      new patronOop.PrivateClass(PageFetchTransport$1.PageFetchTransport)
    );
    navigation.routes(routes);
    const link = new controls.Link(currentPage, basePathSource);
    link.watchClick(this.menuSelector);
    const urlChain = new patronOop.SourceAll();
    basePathSource.value(new patronOop.Patron(urlChain.guestKey("basePath")));
    currentPage.value(new patronOop.Patron(urlChain.guestKey("page")));
    const url = new patronOop.Source((guest) => {
      urlChain.value(
        new patronOop.GuestCast(guest, ({ basePath: basePath2, page }) => {
          patronOop.give(page.replace(basePath2, ""), guest);
        })
      );
    });
    const activeLink = new controls.ComputedElement(
      [{ source: url, placeholder: "{url}" }],
      `${this.menuSelector} a[href="{url}"]`
    );
    activeLink.element(
      new patronOop.Patron(
        new controls.GroupActiveClass(
          "active",
          `${this.menuSelector} a`,
          patronOop.sourceOf(document)
        )
      )
    );
    pageLoading.value(
      new patronOop.Patron((isInLoading) => {
        if (isInLoading) {
          return;
        }
        if (afterPageLoaded) {
          afterPageLoaded();
        }
        const divDestination = document.querySelector(
          this.navigationResultSelector
        );
        if (divDestination) {
          divDestination.querySelectorAll("script").forEach((x) => {
            const sc = document.createElement("script");
            sc.setAttribute("type", "module");
            sc.appendChild(document.createTextNode(x.innerText));
            divDestination.appendChild(sc);
          });
        }
      })
    );
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

class GroupActiveClass {
  constructor(activeClass, groupSelector, document) {
    this.activeClass = activeClass;
    this.groupSelector = groupSelector;
    this.document = document;
  }
  give(element) {
    patronOop.value(
      this.document,
      new patronOop.PatronOnce((document) => {
        document.querySelectorAll(this.groupSelector).forEach((el) => {
          el.classList.remove(this.activeClass);
        });
        element.classList.add(this.activeClass);
      })
    );
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

exports.ComputedElement = ComputedElement;
exports.CurrentPage = CurrentPage;
exports.EntryPointPage = EntryPointPage;
exports.GroupActiveClass = GroupActiveClass;
exports.Input = Input;
exports.Link = Link;
exports.Navigation = Navigation;
exports.Page = Page;
exports.PageFetchTransport = PageFetchTransport;
exports.RouteDisplay = RouteDisplay;
exports.Router = Router;
exports.Text = Text;
exports.Visible = Visible;
//# sourceMappingURL=patron-components.cjs.map
