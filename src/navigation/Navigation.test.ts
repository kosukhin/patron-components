import { Factory, give, GuestType, Source } from "patron-oop";
import { PageFake } from "src/page/PageFake";
import { expect, test } from "vitest";
import { Navigation } from "./Navigation";
import { RoutePageTransportType } from "./PageFetchTransport";

class FakeTransport implements RoutePageTransportType {
    content(guest: GuestType<string>): void {
        give('fake data', guest)
    }
}

test('navigation', () => {
    const pageLoading = new Source(false);
    const basePath = new Source('/some/path/#');
    const currentPage = new Source('/some/path/');
    const display = {
        display(content: string) {
            expect(content).toBe('fake data');
            console.log(content);
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
                template: 'main.html',
                aliases: ['/some/path/'],
                page: new PageFake(),
            },
        ]
    );

    expect(true).toBe(true);
})
