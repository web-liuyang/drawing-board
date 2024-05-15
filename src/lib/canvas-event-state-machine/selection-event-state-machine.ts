import type { Graph } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";

export class SelectionEventStateMachine extends CanvasEventStateMachine {
  override onMouseup(e: MouseEvent): void {
    super.onMouseup(e);

    if (e.button !== MouseEventButton.Primary) return;
    const position = this.application.interactiveCanvas.toGlobal([e.offsetX, e.offsetY]);
    const graphs = this.application.graphController.graphs;

    const newGraphs: Graph[] = Array(graphs.length);
    let hasSelected = false;
    for (let i = graphs.length - 1; i >= 0; i--) {
      const graph = graphs[i];
      const selected = graph.hit(position);

      if (hasSelected || !selected) {
        const newGraph = graph.copyWith({ selected: false });
        newGraphs[i] = newGraph;
        continue;
      }

      if (selected) {
        hasSelected = true;
        const newGraph = graph.copyWith({ selected: true });
        newGraphs[i] = newGraph;
        continue;
      }

      newGraphs[i] = graph;
    }

    this.application.graphController.updateGraphs(newGraphs);
  }
}
