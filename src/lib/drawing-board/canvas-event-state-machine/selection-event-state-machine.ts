import { CanvasEventStateMachine } from "./canvas-event-state-machine";

export class SelectionEventStateMachine extends CanvasEventStateMachine {
  onmousedown(): void {
    this.canvas.setState(new SelectionMousedownStateMachine(this.canvas));
  }

  onmousemove(): void {}

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
  onmousedown(): void {}

  onmousemove(e: MouseEvent): void {
    const canvas = this.canvas;
    const [x, y] = [e.movementX, e.movementY];
    const matrix = canvas.matrix.translate(x, y);
    canvas.setTransform(matrix);
  }

  onmouseup(): void {
    this.canvas.setState(new SelectionEventStateMachine(this.canvas));
  }
}
