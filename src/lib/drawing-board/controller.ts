import { Graph } from "../graph/graph";

export class Controller {
  private readonly _graphs: Graph[] = [];

  public get graphs(): Graph[] {
    return [...this._graphs];
  }

  public addGraph(graph: Graph): void {
    this._graphs.push(graph);
  }

  public updateGraph(id: Graph["id"], newGraph: Graph): void {
    const index = this._graphs.findIndex(g => g.id === id);
    if (index === -1) return;
    this._graphs[index] = newGraph;
  }

  public removeGraph(id: Graph["id"]): void {
    const index = this._graphs.findIndex(g => g.id === id);
    if (index === -1) return;
    this._graphs.splice(index, 1);
  }
}
