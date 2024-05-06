import "./index.css";

export class Propertybar {
  private oPropertybar: HTMLElement;

  get node(): HTMLElement {
    return this.oPropertybar;
  }

  constructor() {
    this.oPropertybar = document.createElement("div");
    this.oPropertybar.className = "propertybar";
  }

  public render(): void {}
}
