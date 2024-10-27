import {Route} from "./route/Route";

export * from './route/Route';

declare var globalThis: any;

if (globalThis) {
    if (!globalThis["GUEST_LIBRARY"]) {
        globalThis["GUEST_LIBRARY"] = {};
    }

    globalThis["GUEST_LIBRARY"]['components'] = {
        Route,
    }
}
