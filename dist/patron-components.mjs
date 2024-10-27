import { Patron, GuestChain, give } from 'patron-oop';

class Route {
  constructor(basePath, currentPage, newPage) {
    this.basePath = basePath;
    this.currentPage = currentPage;
    this.newPage = newPage;
  }
  page(url) {
    this.basePath.receiving(
      (basePath) => {
        this.newPage.receive({
          url: `${basePath}${url}`,
          title: "\u0418\u0434\u0435\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430",
          data: {
            url: `${basePath}${url}`,
            date: (/* @__PURE__ */ new Date()).getTime()
          }
        });
      }
    );
  }
  handleRoutes(displaySelector, routes) {
    const contentEl = document.querySelector(displaySelector);
    const defaultRoute = routes.find((route) => route.default);
    this.firstLoad(
      () => {
        this.currentPage.page(new Patron((value) => {
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
                fetch(basePath + "/" + route.template).then((result) => result.text()).then((template) => {
                  if (contentEl) {
                    contentEl.innerHTML = template;
                  }
                  route.page?.mounted();
                });
              }
            }
          );
        }));
      }
    );
  }
  firstLoad(guest) {
    const chain = new GuestChain();
    this.basePath.receiving(chain.receiveKey("basePath"));
    this.currentPage.page(chain.receiveKey("currentPage"));
    chain.result(
      ({ basePath, currentPage }) => {
        const correctUrl = location.href.replace(location.origin, "");
        if (currentPage.url !== correctUrl) {
          this.page(correctUrl.replace(basePath, ""));
          setTimeout(() => {
            give(null, guest);
          });
        }
      }
    );
  }
}

if (globalThis) {
  if (!globalThis["GUEST_LIBRARY"]) {
    globalThis["GUEST_LIBRARY"] = {};
  }
  globalThis["GUEST_LIBRARY"]["components"] = {
    Route
  };
}

export { Route };
//# sourceMappingURL=patron-components.mjs.map
