import {give, GuestChain, Patron, Source} from "patron-oop";
import {HistoryCurrentPage, HistoryNewPage, HistoryPageDocument} from "patron-web-api";

class Route {
    public constructor(
        private basePath: Source<string>,
        private currentPage: HistoryCurrentPage,
        private newPage: HistoryNewPage
    ) {}

    public page(url) {
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

    public handleRoutes(
        displaySelector,
        routes,
    ) {
        const contentEl = document.querySelector(displaySelector);
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
                                fetch(basePath + '/' + route.template).then(result => result.text()).then(template => {
                                    contentEl.innerHTML = template;
                                    route.page?.mounted();
                                });
                            }
                        },
                    );
                }));
            },
        );
    }

    private firstLoad(guest) {
        const chain = new GuestChain<any>();
        this.basePath.receiving(chain.receiveKey('basePath'));
        this.currentPage.page(chain.receiveKey('currentPage'));
        chain.result(
            ({basePath, currentPage}) => {
                const correctUrl = location.href.replace(location.origin, '');

                if (currentPage.url !== correctUrl) {
                    this.page(correctUrl.replace(basePath, ''));
                    setTimeout(() => {
                        give(null, guest);
                    });
                }
            },
        );
    }
}
