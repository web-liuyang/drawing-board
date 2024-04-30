import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Rectangle, generateUUID } from "../../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";

export class RectangleEventStateMachine extends CanvasEventStateMachine {
  onmousedown(e: MouseEvent): void {
    const canvas = this.canvas;
    const origin = canvas.toGlobal([e.clientX, e.clientY]);
    const rectangle = new Rectangle({
      id: generateUUID(),
      height: 0,
      width: 0,
      center: origin,
    });

    canvas.addGraph(rectangle);
    canvas.state = new RectangleMousedownStateMachine(this.canvas, rectangle);
  }
}

class RectangleMousedownStateMachine extends CanvasEventStateMachine {
  private rectangle: Rectangle;

  constructor(canvas: CanvasEventStateMachineOptinos, rectangle: Rectangle) {
    super(canvas);
    this.rectangle = rectangle;
  }

  onmousedown(): void {
    const { canvas } = this;
    canvas.state = new RectangleEventStateMachine(canvas);
  }

  onmousemove(e: MouseEvent): void {
    const { canvas, rectangle } = this;
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const [x, y] = [position[0] - rectangle.center[0], position[1] - rectangle.center[1]];
    const [w, h] = [Math.abs(x) * 2, Math.abs(y) * 2];
    const newRectangle = rectangle.clone({ width: w, height: h });
    canvas.updateGraph(rectangle.id, newRectangle);
  }
}
