import { icon } from "../icon";
import { removeElementChild, setRootProperyValue } from "../utils/element-utils";

import "./index.css";

export interface ControlPanelComponentOptions {
  items: ControlPanelItem[];
  onResize: () => void;
}

export interface ControlPanelItem {
  name: string;
  node: HTMLElement;
}

export class ControlPanelComponent implements Component {
  private oControlPanel: HTMLElement;

  public get node(): HTMLElement {
    return this.oControlPanel;
  }

  private items: ControlPanelItem[];

  private onResize: ControlPanelComponentOptions["onResize"];

  private _activeName?: string;

  public get activeName(): string | undefined {
    return this._activeName;
  }

  public set activeName(value: string | undefined) {
    this._activeName = value;
  }

  public constructor(options: ControlPanelComponentOptions) {
    this.items = options.items;
    this.onResize = options.onResize;
    this.oControlPanel = document.createElement("div");
    this.oControlPanel.className = "control-panel";
  }

  public clean(): void {
    removeElementChild(this.oControlPanel);
  }

  public update(activeName: string): void {
    if (this._activeName === activeName) return;
    this._activeName = activeName;
  }

  private createClose(): HTMLElement {
    const oClose = document.createElement("div");
    oClose.className = "close";
    oClose.append(icon("close"));
    oClose.addEventListener("click", () => {
      setRootProperyValue("--control-panel-height", `0px`);
      this.onResize();
    });

    return oClose;
  }

  public render(): void {
    this.clean();

    const oTabbar = document.createElement("div");
    oTabbar.className = "tabbar";

    const oClose = this.createClose();
    oTabbar.append(oClose);

    const oTabview = document.createElement("div");
    oTabview.className = "tabview";

    for (const item of this.items) {
      const oTab = document.createElement("div");
      oTab.className = "tab";
      oTab.textContent = item.name;
      oTabbar.append(oTab);
      if (item.name === this._activeName) {
        oTabview.append(item.node);
      }
    }

    this.oControlPanel.append(oTabbar, oTabview);
  }
}
