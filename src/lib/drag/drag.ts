import type { DragComponentOptions } from "./drag-component";
import { DragComponent } from "./drag-component";

export interface DragOptions extends DragComponentOptions {}

export class Drag {
  private component: DragComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: DragOptions) {
    this.component = new DragComponent(options);
  }

  public render(): void {
    this.component.render();
  }
}
