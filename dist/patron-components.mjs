import { give, Patron, GuestChain } from 'patron-oop';

class PageFetchTransport {
  constructor(basePath, template) {
    this.basePath = basePath;
    this.template = template;
  }
  content(guest) {
    fetch(this.basePath + "/" + this.template).then((result) => {
      return result.text();
    }).then((result) => {
      give(result, guest);
    });
  }
}

class Route {
  constructor(loading, basePath, currentPage, newPage, display, pageTransport) {
    this.loading = loading;
    this.basePath = basePath;
    this.currentPage = currentPage;
    this.newPage = newPage;
    this.display = display;
    this.pageTransport = pageTransport;
  }
  page(url) {
    this.basePath.receiving((basePath) => {
      this.newPage.receive({
        url: `${basePath}${url}`,
        title: "\u0418\u0434\u0435\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430",
        data: {
          url: `${basePath}${url}`,
          date: (/* @__PURE__ */ new Date()).getTime()
        }
      });
    });
  }
  routes(routes) {
    const defaultRoute = routes.find((route) => route.default);
    this.firstLoad(() => {
      this.currentPage.page(new Patron((value) => {
        this.loading.receive(true);
        this.basePath.receiving(
          (basePath) => {
            basePath = basePath.replace("/#", "");
            let currentUrl = value.url === "/" ? basePath + "/" : value.url;
            currentUrl = currentUrl.replace("#", "").replace("//", "/");
            let route = routes.find((route2) => basePath + route2.url === currentUrl);
            if (!route && defaultRoute) {
              route = defaultRoute;
            }
            if (route) {
              this.pageTransport.create(
                basePath,
                route.template
              ).content(
                (templateContent) => {
                  this.display.display(templateContent);
                  route.page.mounted();
                  this.loading.receive(false);
                }
              );
            }
          }
        );
      }));
    });
  }
  firstLoad(guest) {
    const chain = new GuestChain();
    this.basePath.receiving(chain.receiveKey("basePath"));
    this.currentPage.page(chain.receiveKey("currentPage"));
    chain.result(() => {
      give(null, guest);
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

export { PageFetchTransport, Route, RouteDisplay };
//# sourceMappingURL=patron-components.mjs.map
