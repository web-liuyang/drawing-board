import type { Graph } from "../../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../../constant/event";

export class SelectionEventStateMachine extends CanvasEventStateMachine {
  private hasKeydown: boolean = false;

  onmousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;
    this.hasKeydown = true;
  }

  onmousemove(): void {
    if (!this.hasKeydown) return;
    this.canvas.drawState.value = new SelectionMousedownStateMachine(this.canvas);
  }

  onmouseup(e: MouseEvent): void {
    this.hasKeydown = false;
    const { canvas } = this;
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const graphs = canvas.graphController.graphs;

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

    canvas.graphController.updateGraphs(newGraphs);
  }

  onwheel(e: WheelEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const canvas = this.canvas;
    const sign = Math.sign(e.deltaY);
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const scale = sign > 0 ? 0.9 : 1.1;
    const matrix = canvas.matrix.scale(scale, scale, position);
    canvas.setTransform(matrix);
  }
}

class SelectionMousedownStateMachine extends CanvasEventStateMachine {
  onmousemove(e: MouseEvent): void {
    const canvas = this.canvas;
    const [x, y] = [e.movementX, e.movementY];
    const matrix = canvas.matrix.translate(x, y);
    canvas.setTransform(matrix);
  }

  onmouseup(): void {
    this.canvas.drawState.value = new SelectionEventStateMachine(this.canvas);
  }
}
