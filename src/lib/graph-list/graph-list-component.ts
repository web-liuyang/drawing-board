import { Log } from "@log";
import { Graph, GraphController, GraphId } from "../graph";
import { iconName } from "../icon";
import { removeElementChild } from "../utils/element-utils";
import { Application } from "../application";

import "./index.css";

export interface GraphListComponentOptions {
  graphController: GraphController;
}

export class GraphListComponent implements Component {
  private oGraphList: HTMLElement;

  public get node(): HTMLElement {
    return this.oGraphList;
  }

  private readonly graphController: GraphController;

  constructor(options: GraphListComponentOptions) {
    this.graphController = options.graphController;

    this.oGraphList = document.createElement("div");
    this.oGraphList.className = "graph-list";

    this.graphController.addListener(() => {
      this.render();
    });
  }

  private createGraphItem(graph: Graph): HTMLElement {
    const oGraphItem = document.createElement("div");
    oGraphItem.className = "graph-list__item";
    if (graph.selected) oGraphItem.className += " selected";
    const oSpan = document.createElement("span");
    oSpan.textContent = `${graph.type} (${graph.id.slice(0, 8)})`;
    const oRemoveButton = document.createElement("button");
    oRemoveButton.className = iconName("remove");
    oGraphItem.append(oSpan, oRemoveButton);

    oRemoveButton.addEventListener("click", () => this.onRemoveGraph(graph));
    oGraphItem.addEventListener("click", () => this.onClickGraph(graph.id));
    return oGraphItem;
  }

  private onRemoveGraph(graph: Graph): void {
    this.graphController.removeGraph(graph.id);
    Log.info(`Removed Done ${graph.type}: ${graph.id}`);
    Application.instance!.saveState();
  }

  private onClickGraph(id: GraphId): void {
    const graph = this.graphController.findGraph(id);
    if (!graph) return;

    this.graphController.updateGraphs([
      ...this.graphController.selectedGraphs.map(item => item.copyWith({ selected: false })),
      graph.copyWith({ selected: true }),
    ]);
  }

  public clean(): void {
    removeElementChild(this.oGraphList);
  }

  public update(): void {}

  public render(): void {
    this.clean();

    for (const graph of this.graphController.graphs) {
      const oGraphItem = this.createGraphItem(graph);
      this.oGraphList.append(oGraphItem);
    }
  }
}
