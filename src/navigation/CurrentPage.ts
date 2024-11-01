import {
  give,
  GuestAwareType,
  GuestMiddle,
  GuestObjectType,
  GuestType,
  Source,
  SourceType,
} from "patron-oop";
import { HistoryPageDocument } from "patron-web-api";

export class CurrentPage
  implements GuestAwareType<HistoryPageDocument>, GuestObjectType<string>
{
  private source: SourceType<string>;

  public constructor() {
    const correctUrl = location.href.replace(location.origin, "");
    console.log("url from consttructor", correctUrl);
    this.source = new Source(correctUrl);
  }

  public receive(value: string): this {
    console.log("receive outside");
    this.source.receive(value);
    return this;
  }

  public receiving(guest: GuestType<HistoryPageDocument>) {
    this.source.receiving(
      new GuestMiddle(guest as GuestType<unknown>, (url) => {
        console.trace("new url is", url);

        give(
          {
            title: "Loading",
            url,
          },
          guest,
        );
      }),
    );
    return guest;
  }
}
