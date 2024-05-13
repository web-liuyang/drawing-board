import type { Graph } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";
import { PanEventStateMachine } from "./pan-event-state-machine";

export class SelectionEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    if (e.button === MouseEventButton.Middle)
      this.application.drawState = new PanEventStateMachine(this.application, this);
  }

  override onMouseup(e: MouseEvent): void {
    if (e.button === MouseEventButton.Primary) {
      const position = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
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

  override onWheel(e: WheelEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const { interactiveCanvas } = this.application;
    const sign = Math.sign(e.deltaY);
    const position = interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const scale = sign > 0 ? 0.9 : 1.1;
    const matrix = interactiveCanvas.matrix.scale(scale, scale, position);
    interactiveCanvas.setTransform(matrix);
  }
}
