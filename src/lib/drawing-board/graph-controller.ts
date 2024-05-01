import type { Graph, GraphId } from "../graph";
import { ChangeNotifier } from "../notifier";

export class GraphController extends ChangeNotifier {
  private readonly _graphs: Graph[] = [];

  public get graphs(): Graph[] {
    return [...this._graphs];
  }

  public addGraph(graph: Graph): void {
    this._graphs.push(graph);
    this.notifyListeners();
  }

  public findGraph<T extends Graph>(id: GraphId): T | undefined {
    return this._graphs.find(g => g.id === id) as T | undefined;
  }

  public updateGraph(id: GraphId, newGraph: Graph): void {
    const index = this._graphs.findIndex(g => g.id === id);
    if (index === -1) return;
    this._graphs[index] = newGraph;
    this.notifyListeners();
  }

  public removeGraph(id: GraphId): void {
    const index = this._graphs.findIndex(g => g.id === id);
    if (index === -1) return;
    this._graphs.splice(index, 1);
    this.notifyListeners();
  }
}
