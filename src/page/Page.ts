export class Page {
    public constructor(private title: string) {
    }

    public mounted() {
        document.title = this.title;
    }
}
