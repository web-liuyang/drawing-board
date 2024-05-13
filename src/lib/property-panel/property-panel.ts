import type { Graph } from "../graph";
import type { PropertyPanelComponentOptions } from "./property-panel-component";
import { PropertyPanelComponent } from "./property-panel-component";

import "./index.css";

export interface PropertyPanelOptions extends PropertyPanelComponentOptions {}

export class PropertyPanel {
  private component: PropertyPanelComponent;

  get node(): HTMLElement {
    return this.component.node;
  }

  public get graph(): Graph | undefined {
    return this.component.graph;
  }

  constructor(options: PropertyPanelOptions) {
    this.component = new PropertyPanelComponent(options);
  }

  public update(graph: Graph) {
    this.component.update(graph);
  }

  public render(graph: Graph | undefined) {
    this.component.graph = graph;
    this.component.render();
  }
}
