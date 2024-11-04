import { Factory, give, GuestType, Source } from "patron-oop";
import { PageFake } from "../page/PageFake";
import { expect, test } from "vitest";
import { Navigation } from "./Navigation";
import { RoutePageTransportType } from "./PageFetchTransport";

class FakeTransport implements RoutePageTransportType {
    constructor(basePath = null,private template = 'null') {}
    content(guest: GuestType<string>): void {
        give(this.template, guest)
    }
}

test('navigation', () => {
    const pageLoading = new Source(false);
    const basePath = new Source('/some/path/#');
    const currentPage = new Source('/some/path/catalog/information');
    const display = {
        display(content: string) {
            expect(content).toBe('catalog.html');
        }
    }

    const navigation = new Navigation(
        pageLoading,
        basePath,
        currentPage,
        display,
        new Factory(FakeTransport)
    );

    navigation.routes(
        [
            {
                url: '/',
                template: 'default.html',
                aliases: ['/some/path/'],
                page: new PageFake(),
                default: true,
            },
            {
                url: '/catalog*',
                template: 'catalog.html',
                page: new PageFake(),
            },
        ]
    );

    expect(true).toBe(true);
})
