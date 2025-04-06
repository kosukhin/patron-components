import { RoutePageType } from "../navigation";

/**
 * @deprecated Move to web api
 */
export class Page implements RoutePageType {
  public constructor(private title: string) {}

  public mounted() {
    document.title = this.title;
  }
}
