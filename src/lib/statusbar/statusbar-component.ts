import { removeElementChild } from "../utils/element-utils";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export class StatusbarComponent implements Component {
  private oStatusbar: HTMLElement;

  public get node(): HTMLElement {
    return this.oStatusbar;
  }

  public position: Point = [0, 0];

  private oPosition = this.createPosition(this.position);

  public stateText: string = "";

  private oDrawingState = this.createDrawingState(this.stateText);

  constructor() {
    this.oStatusbar = document.createElement("div");
    this.oStatusbar.className = "statusbar";
  }

  private createPosition(point: Point): HTMLElement {
    const node = document.createElement("div");
    const [x, y] = point;
    node.className = "mouse-position";
    node.textContent = `${x}, ${y}`;

    return node;
  }

  private createDrawingState(text: string): HTMLElement {
    const node = document.createElement("div");
    node.className = "drawing-state";
    node.textContent = text;
    return node;
  }

  private createGroup(groups: HTMLElement[][]): HTMLElement {
    const oGroup = document.createElement("div");
    oGroup.className = "group";
    for (let i = 0, len = groups.length; i < len; i++) {
      const nodes = groups[i];
      const oGroupItem = document.createElement("div");
      oGroupItem.className = "group-item";
      for (const node of nodes) {
        oGroupItem.append(node);
      }

      oGroup.append(oGroupItem);

      if (i !== len - 1) {
        const oDivider = createDivider();
        oGroup.append(oDivider);
      }
    }

    return oGroup;
  }

  public clean(): void {
    removeElementChild(this.oStatusbar);
  }

  public update(position: Point, stateText: string): void {
    if (position[0] !== this.position[0] || position[1] !== this.position[1]) {
      this.position = position;
      this.oPosition.textContent = `${position[0]}, ${position[1]}`;
    }

    if (stateText !== this.stateText) {
      this.stateText = stateText;
      this.oDrawingState.textContent = stateText;
    }
  }

  public render(): void {
    this.clean();
    const oGroup = this.createGroup([[this.oDrawingState], [this.oPosition]]);
    this.oStatusbar.append(oGroup);
  }
}

function createDivider(): HTMLElement {
  const node = document.createElement("div");
  node.className = "divider";
  return node;
}
