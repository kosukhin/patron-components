import {
  FactoryType,
  give,
  GuestChain,
  GuestType,
  Patron,
  SourceType,
} from "patron-oop";
import { HistoryPageDocument } from "patron-web-api";
import { RoutePageTransportType } from "src/navigation/PageFetchTransport";
import { RouteDisplayType } from "src/navigation/RouteDisplay";
import { RoutePageType } from "src/navigation/RoutePageType";

export interface RouteDocument {
  url: string;
  template: string;
  page: RoutePageType;
  default?: boolean;
}

export class Navigation {
  public constructor(
    private loading: SourceType<boolean>,
    private basePath: SourceType<string>,
    private currentPage: SourceType<HistoryPageDocument>,
    private display: RouteDisplayType,
    private pageTransport: FactoryType<RoutePageTransportType>,
  ) {}

  public routes(routes: RouteDocument[]) {
    const defaultRoute = routes.find((route) => route.default);
    this.firstLoad(() => {
      this.currentPage.receiving(
        new Patron((value) => {
          this.loading.receive(true);
          this.basePath.receiving((basePath) => {
            basePath = basePath.replace("/#", "");
            let currentUrl = value.url === "/" ? basePath + "/" : value.url;
            currentUrl = currentUrl.replace("#", "").replace("//", "/");
            let route = routes.find(
              (route) => basePath + route.url === currentUrl,
            );

            if (!route && defaultRoute) {
              route = defaultRoute;
            }

            if (route) {
              this.pageTransport
                .create(basePath, route.template)
                .content((templateContent) => {
                  this.display.display(templateContent);
                  route.page.mounted();
                  this.loading.receive(false);
                });
            }
          });
        }),
      );
    });
  }

  private firstLoad(guest: GuestType) {
    const chain = new GuestChain();
    this.basePath.receiving(chain.receiveKey("basePath"));
    this.currentPage.receiving(chain.receiveKey("currentPage"));
    chain.result(() => {
      give(null, guest);
    });
  }
}
