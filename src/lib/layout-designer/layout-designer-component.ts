import { ControlPanel } from "../control-panel";
import { InteractiveCanvas } from "../interactive-canvas";
import { PropertyPanel } from "../property-panel";
import { Statusbar } from "../statusbar";
import { Toolbar } from "../toolbar";

import "./index.css";

export interface LayoutDesignerComponentOptions {
  toolbar: Toolbar;
  interactiveCanvas: InteractiveCanvas;
  propertyPanel: PropertyPanel;
  controlPanel: ControlPanel;
  statusbar: Statusbar;
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
    this.oMainCenter.appendChild(options.interactiveCanvas.node);
    this.oMainRight.appendChild(options.propertyPanel.node);
    this.oFooter.append(options.controlPanel.node, options.statusbar.node);
  }

  public clean(): void {}

  public update(): void {}

  public render(): void {}
}
