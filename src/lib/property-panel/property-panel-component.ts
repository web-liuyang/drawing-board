import type { Graph } from "../graph";
import { DynamicForm } from "../dynamic-form";
import { formValuesToGraph, graphToFormGroups } from "./transfer-utils";
import { removeElementChild } from "../utils/element-utils";

export interface PropertyPanelComponentOptions {
  onChangedGraph: (graph: Graph) => void;
}

export class PropertyPanelComponent implements Component {
  private oPropertyPanel: HTMLElement;

  private dynamicForm?: DynamicForm;

  private onChangedGraph: PropertyPanelComponentOptions["onChangedGraph"];

  get node(): HTMLElement {
    return this.oPropertyPanel;
  }

  private _graph: Graph | undefined;

  public get graph(): Graph | undefined {
    return this._graph;
  }

  public set graph(graph: Graph | undefined) {
    this._graph = graph;
  }

  constructor(options: PropertyPanelComponentOptions) {
    this.oPropertyPanel = document.createElement("div");
    this.oPropertyPanel.className = "property-panel";
    this.onChangedGraph = options.onChangedGraph;
  }

  public clean(): void {
    this.dynamicForm?.clean();
    this.dynamicForm = undefined;
    removeElementChild(this.oPropertyPanel);
  }

  public update(graph: Graph): void {
    const oldGraph = this._graph;
    const newGraph = graph;
    if (oldGraph === newGraph) return;
    this._graph = newGraph;

    if (!this.dynamicForm) {
      this.render();
    } else if (newGraph === undefined || oldGraph === undefined) {
      this.clean();
    } else if (newGraph.id !== oldGraph.id) {
      this.render();
    } else if (!oldGraph.equals(newGraph)) {
      this.dynamicForm.update(graphToFormGroups(newGraph));
    }
  }

  public render(): void {
    this.clean();
    this.dynamicForm = new DynamicForm({
      onChanged: values => {
        if (!this.graph) return;
        if (!this.dynamicForm!.isValid()) return;
        const graph = formValuesToGraph(values, this.graph);
        const isEqual = this._graph!.equals(graph);
        if (isEqual) return;

        this._graph = graph;
        this.onChangedGraph(graph);
      },
    });

    this.dynamicForm.render(this.graph ? graphToFormGroups(this.graph) : []);
    this.oPropertyPanel.append(this.dynamicForm.node);
  }
}
