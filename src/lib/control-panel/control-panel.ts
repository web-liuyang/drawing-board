import type { ConsoleController } from "./console";
import { Console } from "./console";
import { ControlPanelComponent } from "./control-panel-component";

interface ControlPanelOptions {
  consoleController: ConsoleController;
}

export class ControlPanel {
  private component: ControlPanelComponent;

  private console: Console;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: ControlPanelOptions) {
    this.console = new Console({ controller: options.consoleController });
    this.console.render();

    this.component = new ControlPanelComponent({
      items: [
        {
          name: "Console",
          node: this.console.node,
        },
      ],
    });
    this.component.activeName = "Console";
  }

  public update(activeName: string): void {
    this.component.update(activeName);
  }

  public render(): void {
    this.component.render();
  }
}
