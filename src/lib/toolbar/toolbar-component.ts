import { iconName } from "../icon";
import { removeElementChild } from "../utils/element-utils";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export enum ToolButton {
  Backward = "Backward",
  Forward = "Forward",
  Selection = "Selection",
  Circle = "Circle",
  Rectangle = "Rectangle",
  Any = "Any",
}

export interface ToolbarComponentOptions {
  onClick: (button: ToolButton) => void;
}

export class ToolbarComponent implements Component {
  private oToolbar: HTMLElement;

  private toolButtons: HTMLButtonElement[] = [];

  public get node(): HTMLElement {
    return this.oToolbar;
  }

  private onClick: ToolbarComponentOptions["onClick"];

  private _seletedToolButton: ToolButton = ToolButton.Selection;

  public get seletedToolButton(): ToolButton {
    return this._seletedToolButton;
  }

  public set seletedToolButton(seletedToolButton: ToolButton) {
    this._seletedToolButton = seletedToolButton;
  }

  constructor(options: ToolbarComponentOptions) {
    this.onClick = options.onClick;
    this.oToolbar = document.createElement("div");
    this.oToolbar.className = "toolbar";
  }

  private createIconButton(title: string, icon: string): HTMLButtonElement {
    const oButton = document.createElement("button");
    oButton.className = "toolbar__button " + iconName(icon);
    oButton.title = title;
    return oButton;
  }

  private createToolButton(button: ToolButton, icon: string): HTMLButtonElement {
    const oButton = this.createIconButton(button, icon);
    const onclick = () => this.onClick(button);
    if (this.seletedToolButton === button) oButton.className += " selected";
    oButton.title = button;
    oButton.addEventListener("click", onclick, false);

    return oButton;
  }

  private createToolButtons(): HTMLButtonElement[] {
    const oBackward = this.createToolButton(ToolButton.Backward, "debug-step-back");
    const oForward = this.createToolButton(ToolButton.Forward, "debug-step-over");
    const oSelection = this.createToolButton(ToolButton.Selection, "blank");
    const oCircle = this.createToolButton(ToolButton.Circle, "circle");
    const oRectangle = this.createToolButton(ToolButton.Rectangle, "primitive-square");
    const oAny = this.createToolButton(ToolButton.Any, "edit");

    return [oBackward, oForward, oSelection, oCircle, oRectangle, oAny];
  }

  public clean(): void {
    removeElementChild(this.oToolbar);
  }

  public update(seletedToolButton: ToolButton): void {
    if (this.seletedToolButton === seletedToolButton) return;

    for (const oButton of this.toolButtons) {
      oButton.classList.remove("selected");

      if (oButton.title === seletedToolButton) {
        oButton.classList.add("selected");
      }
    }

    this._seletedToolButton = seletedToolButton;
  }

  public render(): void {
    this.clean();
    this.toolButtons = this.createToolButtons();
    this.oToolbar.append(...this.toolButtons);
  }
}
