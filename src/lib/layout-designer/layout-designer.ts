import type { LayoutDesignerComponentOptions } from "./layout-designer-component";
import { LayoutDesignerComponent } from "./layout-designer-component";

interface LayoutDesignerOptions extends LayoutDesignerComponentOptions {}

export class LayoutDesigner {
  private component: LayoutDesignerComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: LayoutDesignerOptions) {
    this.component = new LayoutDesignerComponent(options);
  }

  public render(): void {
    this.component.render();
  }
}
