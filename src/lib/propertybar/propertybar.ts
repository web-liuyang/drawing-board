import type { Graph } from "../graph";
import { DynamicForm } from "../dynamic-form";
import { formValuesToGraph, graphToFormGroups } from "./utils";

import "./index.css";

export interface PropertybarOptions {
  onChangedGraph: (graph: Graph) => void;
}

export class Propertybar {
  private oPropertybar: HTMLElement;

  private dynamicForm: DynamicForm;

  get node(): HTMLElement {
    return this.oPropertybar;
  }

  private _graph: Graph | undefined;

  public get graph(): Graph | undefined {
    return this._graph;
  }

  public set graph(graph: Graph | undefined) {
    const oldGraph = this._graph;
    const newGraph = graph;
    if (oldGraph === newGraph) return;

    if (newGraph === undefined) {
      this.dynamicForm.render([]);
    } else if (oldGraph === undefined) {
      this.dynamicForm.render(graphToFormGroups(newGraph));
    } else if (newGraph.id !== oldGraph.id) {
      this.dynamicForm.render(graphToFormGroups(newGraph));
    } else if (!oldGraph.equals(newGraph)) {
      this.dynamicForm.update(graphToFormGroups(newGraph));
    }

    this._graph = newGraph;
  }

  constructor(options: PropertybarOptions) {
    this.oPropertybar = document.createElement("div");
    this.oPropertybar.className = "propertybar";
    this.dynamicForm = new DynamicForm({
      onChanged: () => {
        if (!this.graph) return;
        if (!this.dynamicForm.isValid()) return;
        const values = this.dynamicForm.getValues();
        const graph = formValuesToGraph(values, this.graph);
        const isEqual = this._graph!.equals(graph);
        if (isEqual) return;
        this._graph = graph;
        options.onChangedGraph(graph);
      },
    });

    this.oPropertybar.append(this.dynamicForm.node);
  }
}
