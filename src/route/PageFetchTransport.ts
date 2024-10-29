import { give, GuestType } from "patron-oop";
import { RoutePageTransportType } from "src/route/RoutePageTransportType";

export class PageFetchTransport implements RoutePageTransportType {
    public constructor(
        private basePath: string,
        private template: string,
    ) {}

    public content(
        guest: GuestType<string>
    ): void {
        fetch(this.basePath + '/' + this.template)
            .then(result => result.text())
            .then(result => {
                give(result, guest);
            })
    }

}
