import {
  give,
  GuestAwareType,
  GuestCast,
  GuestChain,
  GuestMiddle,
  GuestType,
} from "patron-oop";

type SourceDetailType = {
  source: GuestAwareType;
  placeholder: string;
};

export class ComputedElement {
  public constructor(
    private sources: SourceDetailType[],
    private selectorTemplate: string,
  ) {}

  public element(guest: GuestType<HTMLElement>) {
    const chain = new GuestChain();
    this.sources.forEach((source) => {
      source.source.value(
        new GuestCast(guest as GuestType, chain.receiveKey(source.placeholder)),
      );
    });

    chain.result(
      new GuestMiddle(
        guest as GuestType,
        (placeholders: Record<string, string>) => {
          let selectorTemplate = this.selectorTemplate;

          Object.entries(placeholders).map((entry) => {
            selectorTemplate = selectorTemplate.replaceAll(entry[0], entry[1]);
          });

          const element = document.querySelector(
            selectorTemplate,
          ) as HTMLElement;
          if (element) {
            give(element, guest);
          }
        },
      ),
    );
  }
}
