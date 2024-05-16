import { ResourcePanelComponent } from "./resource-panel-component";

export interface ResourcePanelOptions {}

export class ResourcePanel {
  private component: ResourcePanelComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: ResourcePanelOptions) {
    this.component = new ResourcePanelComponent();
  }

  public render(): void {
    this.component.render();
  }
}
