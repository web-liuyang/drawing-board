import { icon } from "../icon";
import { removeElementChild } from "../utils/element-utils";

import "./index.css";

export interface ControlPanelComponentOptions {
  items: ControlPanelItem[];
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

  private height: number = 200;

  private items: ControlPanelItem[];

  private _activeName?: string;

  public get activeName(): string | undefined {
    return this._activeName;
  }

  public set activeName(value: string | undefined) {
    this._activeName = value;
  }

  public constructor(options: ControlPanelComponentOptions) {
    this.items = options.items;
    this.oControlPanel = document.createElement("div");
    this.oControlPanel.className = "control-panel";
    this.oControlPanel.style.height = `${this.height}px`;
  }

  public clean(): void {
    removeElementChild(this.oControlPanel);
  }

  public update(activeName: string): void {
    if (this._activeName === activeName) return;
    this._activeName = activeName;
  }

  private createDrag(): HTMLElement {
    const oDrag = document.createElement("div");
    oDrag.className = "drag";

    oDrag.addEventListener("mousedown", e => {
      const y = e.clientY;

      const onMousemove = (e: MouseEvent) => {
        const dy = e.clientY - y;
        const height = this.height - dy < 0 ? 0 : this.height - dy;
        this.oControlPanel.style.height = `${height}px`;
      };

      const onMouseup = () => {
        this.height = parseFloat(this.oControlPanel.style.height);
        window.removeEventListener("mousemove", onMousemove, false);
        window.removeEventListener("mouseup", onMouseup, false);
      };

      window.addEventListener("mousemove", onMousemove, false);
      window.addEventListener("mouseup", onMouseup, false);
    });

    return oDrag;
  }

  private createClose(): HTMLElement {
    const oClose = document.createElement("div");
    oClose.className = "close";
    oClose.append(icon("close"));

    oClose.addEventListener("click", () => {
      this.height = 0;
      this.oControlPanel.style.height = `0px`;
    });

    return oClose;
  }

  public render(): void {
    this.clean();
    const oDrag = this.createDrag();

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

    this.oControlPanel.append(oDrag, oTabbar, oTabview);
  }
}
