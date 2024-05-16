import { GraphList } from "../graph-list";

import "./index.css";

export interface ResourcePanelComponentOptions {
  graphList: GraphList;
}

export class ResourcePanelComponent implements Component {
  private oResourcePanel: HTMLElement;

  public get node(): HTMLElement {
    return this.oResourcePanel;
  }

  private oTitlebar: HTMLElement;

  private oContent: HTMLElement;

  private graphList: GraphList;

  constructor(options: ResourcePanelComponentOptions) {
    this.graphList = options.graphList;

    this.oResourcePanel = document.createElement("div");
    this.oResourcePanel.className = "resource-panel";

    this.oTitlebar = document.createElement("div");
    this.oTitlebar.className = "resource-panel__titlebar";
    this.oTitlebar.textContent = "Resource Panel";

    this.oContent = document.createElement("div");
    this.oContent.className = "resource-panel__content";

    this.oResourcePanel.append(this.oTitlebar, this.oContent);

    this.oContent.append(this.graphList.node);
  }

  public clean(): void {
    this.graphList.clean();
  }

  public update(): void {}

  public render(): void {}
}
