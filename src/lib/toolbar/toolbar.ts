import { iconName } from "../icon";
import { ValueNotifier } from "../notifier";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export enum ToolButton {
  Backward = "Backward",
  Forward = "Forward",
  Selection = "Selection",
  Circle = "Circle",
  Rectangle = "Rectangle",
}

interface ToolbarOptions {
  onClick: (button: ToolButton) => void;
}

export class Toolbar {
  private onClick: ToolbarOptions["onClick"];

  private _seletedToolButton: ToolButton = ToolButton.Selection;

  public get seletedToolButton(): ToolButton {
    return this._seletedToolButton;
  }

  public set seletedToolButton(button: ToolButton) {
    this._seletedToolButton = button;
  }

  private oToolbar!: HTMLElement;

  constructor(options: ToolbarOptions) {
    this.onClick = options.onClick;
    this.initDOM();
    this.bindEvent();
  }

  public get node(): HTMLElement {
    return this.oToolbar;
  }

  private bindEvent(): void {
    // this.state.addListener(() => {
    //   this.render();
    // });
  }

  private createIconButton(title: string, icon: string): HTMLElement {
    const oButton = document.createElement("button");
    oButton.className = "toolbar__button " + iconName(icon);
    oButton.title = title;
    return oButton;
  }

  private initDOM(): void {
    this.oToolbar = document.createElement("div");
    this.oToolbar.className = "toolbar";
  }

  private createToolButton(button: ToolButton, icon: string): HTMLElement {
    const oButton = this.createIconButton(button, icon);
    const onclick = () => this.onClick(button);
    if (this.seletedToolButton === button) oButton.className += " selected";
    oButton.title = button;
    oButton.addEventListener("click", onclick, false);

    return oButton;
  }

  private createToolButtons(): HTMLElement[] {
    const oBackward = this.createToolButton(ToolButton.Backward, "debug-step-back");
    const oForward = this.createToolButton(ToolButton.Forward, "debug-step-over");
    const oSelection = this.createToolButton(ToolButton.Selection, "blank");
    const oCircle = this.createToolButton(ToolButton.Circle, "circle");
    const oRectangle = this.createToolButton(ToolButton.Rectangle, "primitive-square");

    return [oBackward, oForward, oSelection, oCircle, oRectangle];
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
    const oToolButtons = this.createToolButtons();
    this.oToolbar.append(...oToolButtons);
  }
}
