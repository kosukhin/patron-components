import {
  FactoryType,
  GuestChain,
  Patron,
  SourceType
} from "patron-oop";
import { RoutePageTransportType } from "src/navigation/PageFetchTransport";
import { RouteDisplayType } from "src/navigation/RouteDisplay";
import { RoutePageType } from "src/navigation/RoutePageType";

export interface RouteDocument {
  url: string;
  template: string;
  aliases?: string[];
  page: RoutePageType;
  default?: boolean;
}

export class Navigation {
  public constructor(
    private loading: SourceType<boolean>,
    private basePath: SourceType<string>,
    private currentPage: SourceType<string>,
    private display: RouteDisplayType,
    private pageTransport: FactoryType<RoutePageTransportType>,
  ) {}

  public routes(routes: RouteDocument[]) {
    const defaultRoute = routes.find((route) => route.default);
    const chain = new GuestChain<{basePath: string, currentPage: string}>();
    this.basePath.value(new Patron(chain.receiveKey("basePath")));
    this.currentPage.value(new Patron(chain.receiveKey("currentPage")));
    chain.result(
      new Patron(({basePath, currentPage}) => {
        basePath = basePath.replace("/#", "");
        let currentUrl = currentPage === "/" ? basePath + "/" : currentPage;
        currentUrl = currentUrl.replace("#", "").replace("//", "/");
        const routeMatchedToAlias = routes.find(
          route => (route.aliases ?? []).includes(currentUrl) && route.url !== currentUrl
        );

        if (routeMatchedToAlias && routeMatchedToAlias.url !== currentPage) {
          console.log('reload to corect url', routeMatchedToAlias, currentUrl);
        }
        // if (routeMatchedToAlias && routeMatchedToAlias.url !== currentPage) {
        //   console.log('reload to corect url', routeMatchedToAlias, currentUrl);
        //   const correctUrl = basePath + routeMatchedToAlias.url;
        //   // if matched to alias go to correct url
        //   this.currentPage.give(correctUrl);
        //   return;
        // }

        let route = routes.find(
          (route) => basePath + route.url === currentUrl
        );

        if (!route && defaultRoute) {
          route = defaultRoute;
        }

        if (route) {
          this.loading.give(true);
          this.pageTransport
            .create(basePath, route.template)
            .content((templateContent) => {
              this.display.display(templateContent);
              route.page.mounted();
              this.loading.give(false);
            });
        }
      }),
    );
  }
}
