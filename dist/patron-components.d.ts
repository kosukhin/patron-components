import { GuestType, SourceType, FactoryType, GuestAwareType, GuestObjectType } from 'patron-oop';
import { HistoryPageDocument } from 'patron-web-api';
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
    constructor(loading: SourceType<boolean>, basePath: SourceType<string>, currentPage: SourceType<HistoryPageDocument>, display: RouteDisplayType$1, pageTransport: FactoryType<RoutePageTransportType$1>);
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
    give(value: string): this;
    value(guest: GuestType<HistoryPageDocument>): GuestType<HistoryPageDocument>;
}

type InputValue = number | string;
declare class Input implements SourceType<InputValue> {
    private source;
    constructor(source: SourceType<InputValue>, selector: string);
    value(guest: GuestType<InputValue>): this;
    give(value: InputValue): this;
}

declare class Visible implements GuestObjectType<boolean> {
    private selector;
    constructor(selector: string);
    give(isVisible: boolean): this;
}

declare class Text implements GuestObjectType {
    private selector;
    constructor(selector: string);
    give(value: unknown): this;
}

declare class Link {
    private linkSource;
    private basePath;
    constructor(linkSource: GuestObjectType<string>, basePath: SourceType<string>);
    watchClick(selector: string): void;
}

type SourceDetailType = {
    source: GuestAwareType;
    placeholder: string;
};
declare class ComputedElement {
    private sources;
    private selectorTemplate;
    constructor(sources: SourceDetailType[], selectorTemplate: string);
    element(guest: GuestType<HTMLElement>): void;
}

declare class ClassToggle implements GuestObjectType<HTMLElement> {
    private toggleClass;
    private resetClassSelector;
    constructor(toggleClass: string, resetClassSelector: string);
    give(element: HTMLElement): this;
}

declare class Page implements RoutePageType {
    private title;
    constructor(title: string);
    mounted(): void;
}

declare class EntryPointPage implements RoutePageType {
    private title;
    private entryPointUrl;
    constructor(title: string, entryPointUrl: string);
    mounted(): void;
}

export { ClassToggle, ComputedElement, CurrentPage, EntryPointPage, Input, Link, Navigation, Page, PageFetchTransport, RouteDisplay, type RouteDisplayType, type RouteDocument, type RoutePageTransportType, type RoutePageType, Text, Visible };
