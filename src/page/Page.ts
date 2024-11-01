import { RoutePageType } from "../navigation";

export class Page implements RoutePageType {
  public constructor(private title: string) {}

  public mounted() {
    document.title = this.title;
  }
}
