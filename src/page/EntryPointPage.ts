import { RoutePageType } from "../navigation";

export class EntryPointPage implements RoutePageType {
  public constructor(
    private title: string,
    private entryPointUrl: string,
  ) {}

  public mounted() {
    document.title = this.title;
    import(this.entryPointUrl).then((module) => {
      if (module.main) {
        module.main();
      }
    });
  }
}
