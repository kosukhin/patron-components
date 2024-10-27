import { Source } from 'patron-oop';
import { HistoryCurrentPage, HistoryNewPage } from 'patron-web-api';

interface RouteDocument {
    url: string;
    template: string;
    page: {
        mounted: () => void;
    };
    default?: boolean;
}
declare class Route {
    private basePath;
    private currentPage;
    private newPage;
    constructor(basePath: Source<string>, currentPage: HistoryCurrentPage, newPage: HistoryNewPage);
    page(url: string): void;
    handleRoutes(displaySelector: string, routes: RouteDocument[]): void;
    private firstLoad;
}

export { Route, type RouteDocument };
