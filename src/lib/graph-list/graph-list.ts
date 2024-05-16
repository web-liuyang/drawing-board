import type { GraphListComponentOptions } from "./graph-list-component";
import { GraphListComponent } from "./graph-list-component";

export interface GraphListOptions extends GraphListComponentOptions {}

export class GraphList {
  private component: GraphListComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: GraphListOptions) {
    this.component = new GraphListComponent(options);
  }

  public clean() {
    this.component.clean();
  }

  public render() {
    this.component.render();
  }
}
