import { give, GuestAwareType, GuestType } from "patron-oop";
import { HistoryPageDocument } from "patron-web-api";

export class CurrentPage implements GuestAwareType<HistoryPageDocument> {
    public receiving(guest: GuestType<HistoryPageDocument>) {
        const correctUrl = location.href.replace(location.origin, '');
        give(
            {
                title: 'Loading',
                url: correctUrl,
            },
            guest
        );
        return guest;
    }
}
