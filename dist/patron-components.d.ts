import { GuestType, Source, FactoryType, GuestAwareType, GuestObjectType, SourceType } from 'patron-oop';
import { HistoryCurrentPage, HistoryPageDocument } from 'patron-web-api';
import { RoutePageTransportType as RoutePageTransportType$1 } from 'src/navigation/PageFetchTransport';
import { RouteDisplayType as RouteDisplayType$1 } from 'src/navigation/RouteDisplay';
import { RoutePageType as RoutePageType$1 } from 'src/navigation/RoutePageType';

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
declare class Navigation {
    private loading;
    private basePath;
    private currentPage;
    private display;
    private pageTransport;
    constructor(loading: Source<boolean>, basePath: Source<string>, currentPage: HistoryCurrentPage, display: RouteDisplayType$1, pageTransport: FactoryType<RoutePageTransportType$1>);
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

declare class CurrentPage implements GuestAwareType<HistoryPageDocument>, GuestObjectType<string> {
    private source;
    constructor();
    receive(value: string): this;
    receiving(guest: GuestType<HistoryPageDocument>): GuestType<HistoryPageDocument>;
}

type InputValue = number | string;
declare class Input implements SourceType<InputValue> {
    private source;
    constructor(source: SourceType<InputValue>, selector: string);
    receiving(guest: GuestType<InputValue>): this;
    receive(value: InputValue): this;
}

declare class Visible implements GuestObjectType<boolean> {
    private selector;
    constructor(selector: string);
    receive(isVisible: boolean): this;
}

declare class Text implements GuestObjectType {
    private selector;
    constructor(selector: string);
    receive(value: unknown): this;
}

declare class Link {
    private linkSource;
    private basePath;
    constructor(linkSource: GuestObjectType<string>, basePath: SourceType<string>);
    watchClick(selector: string): void;
}

declare class Page {
    private title;
    constructor(title: string);
    mounted(): void;
}

export { CurrentPage, Input, Link, Navigation, Page, PageFetchTransport, RouteDisplay, type RouteDisplayType, type RouteDocument, type RoutePageTransportType, type RoutePageType, Text, Visible };
