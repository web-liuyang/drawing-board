import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export class Statusbar {
  private oStatusbar: HTMLElement;

  public mousePosition: Point = [0, 0];

  public stateText: string = "";

  constructor() {
    this.oStatusbar = document.createElement("div");
    this.oStatusbar.className = "statusbar";
  }

  public get node(): HTMLElement {
    return this.oStatusbar;
  }

  private createMousePosition(point: Point): HTMLElement {
    const node = document.createElement("div");
    const [x, y] = point;
    node.className = "mouse-position";
    node.textContent = `${x}, ${y}`;

    return node;
  }

  private createDivider(): HTMLElement {
    const node = document.createElement("div");
    node.className = "divider";
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
        const oDivider = this.createDivider();
        oGroup.append(oDivider);
      }
    }

    return oGroup;
  }

  private clean() {
    const oStatusbar = this.oStatusbar;
    for (let i = 0, len = oStatusbar.childElementCount; i < len; i++) {
      const node = oStatusbar.firstElementChild;
      node!.remove();
    }
  }

  public render(): void {
    this.clean();
    const oDrawingState = this.createDrawingState(this.stateText);
    const oMousePosition = this.createMousePosition(this.mousePosition);
    const oGroup = this.createGroup([[oDrawingState], [oMousePosition]]);
    this.oStatusbar.append(oGroup);
  }
}
