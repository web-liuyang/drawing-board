import { StatusbarComponent } from "./statusbar-component";

import "@vscode/codicons/dist/codicon.css";
import "./index.css";

export class Statusbar {
  private component: StatusbarComponent = new StatusbarComponent();

  public get node(): HTMLElement {
    return this.component.node;
  }

  public update({ position, stateText }: { position?: Point; stateText?: string }): void {
    this.component.update(position ?? this.component.position, stateText ?? this.component.stateText);
  }

  public render(position: Point, stateText: string): void {
    this.component.position = position;
    this.component.stateText = stateText;
    this.component.render();
  }
}
