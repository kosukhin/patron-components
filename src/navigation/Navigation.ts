import {
  SourceAll,
  Patron,
  PrivateType,
  SourceType,
  value,
  give,
  SourceWithPoolType,
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
    private loading: SourceWithPoolType<boolean>,
    private basePath: SourceType<string>,
    private currentPage: SourceWithPoolType<string>,
    private display: RouteDisplayType,
    private pageTransport: PrivateType<RoutePageTransportType>,
  ) {}

  public routes(routes: RouteDocument[]) {
    const defaultRoute = routes.find((route) => route.default);
    const all = new SourceAll<{
      basePath: string;
      currentPage: string;
    }>();
    value(this.basePath, new Patron(all.guestKey("basePath")));
    value(this.currentPage, new Patron(all.guestKey("currentPage")));

    all.value(
      new Patron(({ basePath, currentPage }) => {
        const urlWithoutBasePath = currentPage.replace(basePath, "");
        const routeMatchedToAlias = routes.find(
          (route) =>
            route.aliases &&
            (route.aliases.includes(currentPage) ||
              route.aliases.includes(urlWithoutBasePath)),
        );

        if (routeMatchedToAlias) {
          const correctUrl = basePath + routeMatchedToAlias.url;

          if (correctUrl !== currentPage) {
            give(correctUrl, this.currentPage);
            return;
          }
        }

        let route = routes.find((route) => {
          if (route.url.indexOf("*") >= 0) {
            const regexp = new RegExp(
              route.url.replaceAll("*", ".*").replaceAll("/", "/"),
            );
            return regexp.test(urlWithoutBasePath);
          }
          return route.url.replaceAll("*", "") === urlWithoutBasePath;
        });

        if (!route && defaultRoute) {
          route = defaultRoute;
        }

        if (route) {
          const basePathWithoutHash = basePath
            .replace("/#", "")
            .replace("#", "")
            .replace(/[^/]+\.html$/, "");
          give(true, this.loading);
          this.pageTransport
            .get(basePathWithoutHash, route.template)
            .content((templateContent) => {
              this.display.display(templateContent);
              route.page.mounted();
              give(false, this.loading);
            });
        } else {
          throw new Error("No matching route in Navigation");
        }
      }),
    );
  }
}
