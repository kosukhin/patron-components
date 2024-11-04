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
        const urlWithoutBasePath = currentPage.replace(basePath, '');
        const routeMatchedToAlias = routes.find(
          route => (route.aliases && (route.aliases.includes(currentPage) || route.aliases.includes(urlWithoutBasePath)))
        );

        if (routeMatchedToAlias) {
          const correctUrl = basePath + routeMatchedToAlias.url;

          if (correctUrl !== currentPage) {
            this.currentPage.give(correctUrl);
            return;
          }
        }

        let route = routes.find(
          (route) => {
            if (route.url.indexOf('*') >= 0) {
              const regexp = new RegExp(
                route.url.replaceAll('*', '.*').replaceAll('/', '\/'),
              );
              return regexp.test(urlWithoutBasePath);
            }
            return route.url.replaceAll('*', '') === urlWithoutBasePath
          }
        );

        if (!route && defaultRoute) {
          route = defaultRoute;
        }

        if (route) {
          const basePathWithoutHash = basePath.replace('/#', '');
          this.loading.give(true);
          this.pageTransport
            .create(basePathWithoutHash, route.template)
            .content((templateContent) => {
              this.display.display(templateContent);
              route.page.mounted();
              this.loading.give(false);
            });
        } else {
          throw new Error('No matching route in Navigation');
        }
      }),
    );
  }
}
