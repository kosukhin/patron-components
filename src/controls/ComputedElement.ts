import {
  give,
  GuestAwareAll,
  GuestAwareObjectType,
  GuestCast,
  GuestType
} from "patron-oop";

type SourceDetailType = {
  source: GuestAwareObjectType<any>;
  placeholder: string;
};

export class ComputedElement {
  public constructor(
    private sources: SourceDetailType[],
    private selectorTemplate: string,
  ) { }

  public element(guest: GuestType<HTMLElement>) {
    const chain = new GuestAwareAll();
    this.sources.forEach((source) => {
      source.source.value(
        new GuestCast(guest as GuestType, chain.guestKey(source.placeholder)),
      );
    });

    chain.value(
      new GuestCast(
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
