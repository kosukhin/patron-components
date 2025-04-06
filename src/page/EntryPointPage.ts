import { RoutePageType } from "../navigation";

/**
 * @deprecated not needed
 */
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
