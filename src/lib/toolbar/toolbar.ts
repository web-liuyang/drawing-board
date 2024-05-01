import { iconName } from "../icon";
import { ValueNotifier } from "../notifier";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export enum ToolState {
  Selection = "Selection",
  Circle = "Circle",
  Rectangle = "Rectangle",
}

export class Toolbar {
  private oToolbar!: HTMLElement;

  public readonly state: ValueNotifier<ToolState> = new ValueNotifier<ToolState>(ToolState.Selection);

  public get node(): HTMLElement {
    return this.oToolbar;
  }

  public ensureInitialized(): void {
    this.initDOM();
    this.bindEvent();
  }

  private bindEvent(): void {
    this.state.addListener(() => {
      this.render();
    });
  }

  private createIconButton(type: ToolState, icon: string): HTMLElement {
    const oButton = document.createElement("button");
    oButton.className = "toolbar__button " + iconName(icon);
    if (this.state.value === type) oButton.className += " selected";
    oButton.title = type;

    const onclick = () => {
      this.state.value = type;
    };

    oButton.addEventListener("click", onclick, false);
    return oButton;
  }

  private initDOM(): void {
    this.oToolbar = document.createElement("div");
    this.oToolbar.className = "toolbar";
  }

  private createToolButton(): HTMLElement[] {
    const oSelection = this.createIconButton(ToolState.Selection, "blank");
    const oCircle = this.createIconButton(ToolState.Circle, "circle");
    const oRectangle = this.createIconButton(ToolState.Rectangle, "primitive-square");
    return [oSelection, oCircle, oRectangle];
  }

  private clean() {
    const oToolbar = this.oToolbar;
    for (let i = 0, len = oToolbar.childElementCount; i < len; i++) {
      const node = oToolbar.firstElementChild;
      node!.remove();
    }
  }

  public render(): void {
    this.clean();
    const oToolButtons = this.createToolButton();
    this.oToolbar.append(...oToolButtons);
  }
}
