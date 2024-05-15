import type { ConsoleComponentOptions } from "./console-component";
import { ConsoleComponent } from "./console-component";

export interface ConsoleOptions extends ConsoleComponentOptions {}

export class Console {
  private component: ConsoleComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: ConsoleOptions) {
    this.component = new ConsoleComponent(options);
  }

  public update(): void {
    this.component.update();
  }

  public render(): void {
    this.component.render();
  }
}
