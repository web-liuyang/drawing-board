import type { Graph } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";

export class SelectionEventStateMachine extends CanvasEventStateMachine {
  private hasKeydown: boolean = false;

  override onMousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;
    this.hasKeydown = true;
  }

  override onMousemove(): void {
    if (!this.hasKeydown) return;
    this.application.drawState = new SelectionMousedownStateMachine(this.application);
  }

  override onMouseup(e: MouseEvent): void {
    this.hasKeydown = false;

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

class SelectionMousedownStateMachine extends CanvasEventStateMachine {
  override onMousemove(e: MouseEvent): void {
    const [x, y] = [e.movementX, e.movementY];
    const matrix = this.application.interactiveCanvas.matrix.translate(x, y);
    this.application.interactiveCanvas.setTransform(matrix);
  }

  override onMouseup(): void {
    this.application.drawState = new SelectionEventStateMachine(this.application);
  }
}
