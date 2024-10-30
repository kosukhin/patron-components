import { GuestType, Source, FactoryType } from 'patron-oop';
import { HistoryCurrentPage, HistoryNewPage } from 'patron-web-api';
import { RouteDisplayType as RouteDisplayType$1 } from 'src/route/RouteDisplay';
import { RoutePageTransportType as RoutePageTransportType$1 } from 'src/route/PageFetchTransport';
import { RoutePageType as RoutePageType$1 } from 'src/route/RoutePageType';

interface RoutePageTransportType {
    content(guest: GuestType<string>): void;
}
declare class PageFetchTransport implements RoutePageTransportType {
    private basePath;
    private template;
    constructor(basePath: string, template: string);
    content(guest: GuestType<string>): void;
}

interface RouteDocument {
    url: string;
    template: string;
    page: RoutePageType$1;
    default?: boolean;
}
declare class Route {
    private loading;
    private basePath;
    private currentPage;
    private newPage;
    private display;
    private pageTransport;
    constructor(loading: Source<boolean>, basePath: Source<string>, currentPage: HistoryCurrentPage, newPage: HistoryNewPage, display: RouteDisplayType$1, pageTransport: FactoryType<RoutePageTransportType$1>);
    page(url: string): void;
    routes(routes: RouteDocument[]): void;
    private firstLoad;
}

interface RouteDisplayType {
    display(content: string): void;
}
declare class RouteDisplay implements RouteDisplayType {
    private selector;
    constructor(selector: string);
    display(content: string): void;
}

interface RoutePageType {
    mounted(): void;
}

export { PageFetchTransport, Route, RouteDisplay, type RouteDisplayType, type RouteDocument, type RoutePageTransportType, type RoutePageType };
