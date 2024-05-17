import type { Graph, GraphId } from ".";
import { ChangeNotifier } from "../notifier";

export class GraphController extends ChangeNotifier {
  private readonly _graphs: Graph[] = [];

  public get graphs(): Graph[] {
    return [...this._graphs];
  }

  public get selectedGraphs(): Graph[] {
    return this._graphs.filter(g => g.selected);
  }

  public setGraphs(graphs: Graph[]): void {
    this._graphs.length = 0;
    this._graphs.push(...graphs);
    this.notifyListeners();
  }

  public addGraph(graph: Graph): void {
    this._graphs.push(graph);
    this.notifyListeners();
  }

  public has(id: GraphId): boolean {
    return this._graphs.some(g => g.id === id);
  }

  public findGraph<T extends Graph>(id: GraphId): T | undefined {
    return this._graphs.find(g => g.id === id) as T | undefined;
  }

  public findIndexGraph(id: GraphId): number {
    return this._graphs.findIndex(g => g.id === id);
  }

  public updateGraph(id: GraphId, newGraph: Graph): void {
    const index = this._graphs.findIndex(g => g.id === id);
    if (index === -1) return;
    this._graphs[index] = newGraph;
    this.notifyListeners();
  }

  public updateGraphs(graphs: Graph[]): void {
    for (let i = 0, len = graphs.length; i < len; i++) {
      const graph = graphs[i];
      const index = this.findIndexGraph(graph.id);
      if (index === -1) continue;
      this._graphs[index] = graph;
    }

    this.notifyListeners();
  }

  public removeGraph(id: GraphId): void {
    const index = this.findIndexGraph(id);
    if (index === -1) return;
    this._graphs.splice(index, 1);
    this.notifyListeners();
  }
}
