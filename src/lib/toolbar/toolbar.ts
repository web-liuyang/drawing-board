import type { ToolButton, ToolbarComponentOptions } from "./toolbar-component";
import { ToolbarComponent } from "./toolbar-component";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

interface ToolbarOptions extends ToolbarComponentOptions {}

export class Toolbar {
  private component: ToolbarComponent;

  public get seletedToolButton(): ToolButton {
    return this.component.seletedToolButton;
  }

  constructor(options: ToolbarOptions) {
    this.component = new ToolbarComponent(options);
  }

  public get node(): HTMLElement {
    return this.component.node;
  }

  public update(seletedToolButton: ToolButton): void {
    this.component.update(seletedToolButton);
  }

  public render(seletedToolButton: ToolButton): void {
    this.component.seletedToolButton = seletedToolButton;
    this.component.render();
  }
}
