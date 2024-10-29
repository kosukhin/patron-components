import { GuestType } from "patron-oop";

export interface RoutePageTransportType {
    content(guest: GuestType<string>): void;
}
