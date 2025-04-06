import { give, GuestType } from "patron-oop";

export interface RoutePageTransportType {
  content(guest: GuestType<string>): void;
}

/**
 * Not needed anymore same thing in web api existed
 * @deprecated
 */
export class PageFetchTransport implements RoutePageTransportType {
  public constructor(
    private basePath: string,
    private template: string,
  ) {}

  public content(guest: GuestType<string>): void {
    fetch(this.basePath + "/" + this.template)
      .then((result) => {
        return result.text();
      })
      .then((result) => {
        give(result, guest);
      });
  }
}
