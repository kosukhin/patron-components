import { GuestObjectType, SourceType } from "patron-oop";

export class Link {
  public constructor(
    private linkSource: GuestObjectType<string>,
    private basePath: SourceType<string>,
  ) {}

  public watchClick(selector: string) {
    const wrapperEl = document.querySelectorAll(selector);
    if (wrapperEl.length) {
      wrapperEl.forEach((theElement) => {
        theElement.addEventListener("click", (e) => {
          e.preventDefault();
          let href = (e?.target as HTMLElement)?.getAttribute("href");
          if (!href) {
            href = (e?.currentTarget as HTMLElement)?.getAttribute("href");
          }
          if (href) {
            this.basePath.value((basePath) => {
              this.linkSource.give(basePath + href);
            });
          }
        });
      });
    } else {
      throw new Error(`Link wrapper not found for selector ${selector}`);
    }
  }
}
