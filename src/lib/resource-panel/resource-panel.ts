import { ResourcePanelComponent, ResourcePanelComponentOptions } from "./resource-panel-component";

export interface ResourcePanelOptions extends ResourcePanelComponentOptions {}

export class ResourcePanel {
  private component: ResourcePanelComponent;

  public get node(): HTMLElement {
    return this.component.node;
  }

  constructor(options: ResourcePanelOptions) {
    this.component = new ResourcePanelComponent(options);
  }

  public render(): void {
    this.component.render();
  }
}
