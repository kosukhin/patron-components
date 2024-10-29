import { give, GuestChain, GuestType, Patron, Source } from "patron-oop";
import { HistoryCurrentPage, HistoryNewPage, HistoryPageDocument } from "patron-web-api";
import { RouteDisplayType } from "src/route/RouteDisplayType";
import { RoutePageTransportType } from "src/route/RoutePageTransportType";
import { RoutePageType } from "src/route/RoutePageType";

export interface RouteDocument {
    url: string,
    template: string,
    page: RoutePageType,
    default?: boolean,
}

export class Route {
    public constructor(
        private basePath: Source<string>,
        private currentPage: HistoryCurrentPage,
        private newPage: HistoryNewPage,
        private display: RouteDisplayType,
        private pageTransport: RoutePageTransportType,
    ) { }

    public page(url: string) {
        this.basePath.receiving(
            (basePath) => {
                this.newPage.receive({
                    url: `${basePath}${url}`,
                    title: 'Идет загрузка',
                    data: {
                        url: `${basePath}${url}`,
                        date: new Date().getTime(),
                    },
                } as any);
            },
        );
    }

    public handleRoutes(routes: RouteDocument[]) {
        const defaultRoute = routes.find(route => route.default);
        this.firstLoad(
            () => {
                this.currentPage.page(new Patron((value) => {
                    this.basePath.receiving(
                        (basePath) => {
                            basePath = basePath.replace('/#', '');
                            let currentUrl = value.url === '/' ? basePath + '/' : value.url;
                            currentUrl = currentUrl.replace('#', '').replace('//', '/');
                            let route = routes.find(route => basePath + route.url === currentUrl);

                            if (!route && defaultRoute) {
                                route = defaultRoute;
                            }

                            if (route) {
                                this.pageTransport.content(
                                    basePath,
                                    route.template,
                                    (templateContent) => {
                                        this.display.display(templateContent);
                                        route.page.mounted();
                                    }
                                );
                            }
                        },
                    );
                }));
            },
        );
    }

    private firstLoad(guest: GuestType) {
        const chain = new GuestChain<any>();
        this.basePath.receiving(chain.receiveKey('basePath'));
        this.currentPage.page(chain.receiveKey('currentPage'));
        chain.result(() => {
            setTimeout(() => {
                give(null, guest);
            });
        });
    }
}
