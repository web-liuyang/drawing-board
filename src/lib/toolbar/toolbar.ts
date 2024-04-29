import { iconName } from "../icon";
import { ValueNotifier } from "../notifier";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export enum ToolButtons {
  Selection = "Selection",
  Circle = "Circle",
  Rectangle = "Rectangle",
}

export class Toolbar {
  private oToolbar!: HTMLElement;

  public readonly toolState: ValueNotifier<ToolButtons> = new ValueNotifier<ToolButtons>(ToolButtons.Selection);

  public get node(): HTMLElement {
    return this.oToolbar;
  }

  public ensureInitialized(): void {
    this.initDOM();
    this.bindEvent();
  }

  private bindEvent(): void {
    this.toolState.addListener(() => {
      this.render();
    });
  }

  private createIconButton(type: ToolButtons, icon: string): HTMLElement {
    const oButton = document.createElement("button");
    oButton.className = "toolbar__button " + iconName(icon);
    if (this.toolState.value === type) oButton.className += " selected";
    oButton.title = type;

    const onclick = () => {
      this.toolState.value = type;
    };

    oButton.addEventListener("click", onclick, false);
    return oButton;
  }

  private initDOM(): void {
    this.oToolbar = document.createElement("div");
    this.oToolbar.className = "toolbar";
  }

  private createToolButton(): HTMLElement[] {
    const oSelection = this.createIconButton(ToolButtons.Selection, "blank");
    const oCircle = this.createIconButton(ToolButtons.Circle, "circle");
    const oRectangle = this.createIconButton(ToolButtons.Rectangle, "primitive-square");
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
