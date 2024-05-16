import "./index.css";

export class ResourcePanelComponent implements Component {
  private oResourcePanel: HTMLElement;

  private oTitlebar: HTMLElement;

  public get node(): HTMLElement {
    return this.oResourcePanel;
  }

  constructor() {
    this.oResourcePanel = document.createElement("div");
    this.oResourcePanel.className = "resource-panel";

    this.oTitlebar = document.createElement("div");
    this.oTitlebar.className = "resource-panel__titlebar";
    this.oTitlebar.textContent = "Resource Panel";

    this.oResourcePanel.append(this.oTitlebar);
  }

  public clean(): void {}

  public update(): void {}

  public render(): void {}
}
