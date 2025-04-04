import {
  Source,
  SourceAll,
  GuestCast,
  Patron,
  PrivateClass,
  SourceWithPool,
  give,
  sourceOf,
} from "patron-oop";
import { HistoryNewPage, HistoryPoppedPage } from "patron-web-api";
import { ComputedElement, GroupActiveClass, Link, Visible } from "src/controls";
import { CurrentPage } from "src/navigation/CurrentPage";
import { Navigation } from "src/navigation/Navigation";
import { PageFetchTransport } from "src/navigation/PageFetchTransport";
import { RouteDisplay } from "src/navigation/RouteDisplay";

type Route = {
  url: string;
  template: string;
  aliases: string[];
  page: any;
};

export class Router {
  public constructor(
    private loaderSelector: string,
    private navigationResultSelector: string,
    private menuSelector: string,
  ) {}

  routes(
    routes: Route[],
    currentPage: any,
    basePathSource: any,
    afterPageLoaded?: () => void,
  ) {
    if (!currentPage) {
      currentPage = new CurrentPage();
    }
    currentPage.value(new Patron(new HistoryNewPage()));

    const [basePath] = location.href.replace(location.origin, "").split("#");
    if (!basePathSource) {
      basePathSource = new SourceWithPool(
        `${basePath}#`.replace("index.html", "").replace("//", "/"),
      );
    }

    const pageLoading = new SourceWithPool(false);
    pageLoading.value(new Patron(new Visible(this.loaderSelector)));

    const historyPoppedPage = new HistoryPoppedPage(currentPage);
    historyPoppedPage.watchPop();

    const navigation = new Navigation(
      pageLoading,
      basePathSource,
      currentPage,
      new RouteDisplay(this.navigationResultSelector),
      new PrivateClass(PageFetchTransport),
    );
    navigation.routes(routes);

    const link = new Link(currentPage, basePathSource);
    link.watchClick(this.menuSelector);

    const urlChain = new SourceAll<any>();
    basePathSource.value(new Patron(urlChain.guestKey("basePath")));
    currentPage.value(new Patron(urlChain.guestKey("page")));
    const url = new Source((guest) => {
      urlChain.value(
        new GuestCast(guest, ({ basePath, page }) => {
          give(page.replace(basePath, ""), guest);
        }),
      );
    });

    const activeLink = new ComputedElement(
      [{ source: url, placeholder: "{url}" }],
      `${this.menuSelector} a[href="{url}"]`,
    );
    activeLink.element(
      new Patron(
        new GroupActiveClass(
          "active",
          `${this.menuSelector} a`,
          sourceOf(document),
        ),
      ),
    );

    pageLoading.value(
      new Patron((isInLoading) => {
        if (isInLoading) {
          return;
        }

        if (afterPageLoaded) {
          afterPageLoaded();
        }

        const divDestination = document.querySelector(
          this.navigationResultSelector,
        );
        if (divDestination) {
          // Оживляем script тэги
          divDestination.querySelectorAll("script").forEach((x) => {
            const sc = document.createElement("script");
            sc.setAttribute("type", "module");
            sc.appendChild(document.createTextNode(x.innerText));
            divDestination.appendChild(sc);
          });
        }
      }),
    );
  }
}
