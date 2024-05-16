import { ControlPanel } from "../control-panel";
import { Drag } from "../drag";
import { InteractiveCanvas } from "../interactive-canvas";
import { PropertyPanel } from "../property-panel";
import { ResourcePanel } from "../resource-panel";
import { Statusbar } from "../statusbar";
import { Toolbar } from "../toolbar";
import { getRootProperyValue, setRootProperyValue } from "../utils/element-utils";

import "./index.css";

export interface LayoutDesignerComponentOptions {
  resourcePanel: ResourcePanel;
  toolbar: Toolbar;
  interactiveCanvas: InteractiveCanvas;
  propertyPanel: PropertyPanel;
  controlPanel: ControlPanel;
  statusbar: Statusbar;
  onResize: () => void;
}

export class LayoutDesignerComponent implements Component {
  private oLayoutDesigner: HTMLElement;

  private oHeader: HTMLElement;

  private oMain: HTMLElement;

  private oMainLeft: HTMLElement;

  private oMainCenter: HTMLElement;

  private oMainRight: HTMLElement;

  private oFooter: HTMLElement;

  public get node() {
    return this.oLayoutDesigner;
  }

  constructor(options: LayoutDesignerComponentOptions) {
    this.oLayoutDesigner = document.createElement("div");
    this.oLayoutDesigner.id = "layout-designer";

    this.oHeader = document.createElement("div");
    this.oHeader.id = "header";

    this.oMain = document.createElement("div");
    this.oMain.id = "main";

    this.oMainLeft = document.createElement("div");
    this.oMainLeft.id = "main-left";

    this.oMainCenter = document.createElement("div");
    this.oMainCenter.id = "main-center";

    this.oMainRight = document.createElement("div");
    this.oMainRight.id = "main-right";

    this.oFooter = document.createElement("div");
    this.oFooter.id = "footer";

    this.oMain.append(this.oMainLeft, this.oMainCenter, this.oMainRight);

    this.oLayoutDesigner.appendChild(this.oHeader);
    this.oLayoutDesigner.appendChild(this.oMain);
    this.oLayoutDesigner.appendChild(this.oFooter);

    this.oHeader.appendChild(options.toolbar.node);
    this.oMainLeft.append(
      options.resourcePanel.node,
      new Drag({
        direction: ["top", "right"],
        getSize: () => [parseFloat(getRootProperyValue("--main-left-width")), 0],
        setSize: ([w]) => {
          if (w < 200) return;
          setRootProperyValue("--main-left-width", `${w}px`);
          options.onResize();
        },
      }).node,
    );
    this.oMainCenter.appendChild(options.interactiveCanvas.node);
    this.oMainRight.append(
      new Drag({
        direction: ["top", "left"],
        getSize: () => [parseFloat(getRootProperyValue("--main-right-width")), 0],
        setSize: ([w]) => {
          if (w < 200) return;
          setRootProperyValue("--main-right-width", `${w}px`);
          options.onResize();
        },
      }).node,
      options.propertyPanel.node,
    );
    this.oFooter.append(
      new Drag({
        direction: ["top", "left"],
        getSize: () => [0, parseFloat(getRootProperyValue("--control-panel-height"))],
        setSize: ([, h]) => {
          if (h < 0) return;
          setRootProperyValue("--control-panel-height", `${h}px`);
          options.onResize();
        },
      }).node,
      options.controlPanel.node,
      options.statusbar.node,
    );

    this.bindEvent();
  }

  private bindEvent(): void {}

  public clean(): void {}

  public update(): void {}

  public render(): void {}
}
