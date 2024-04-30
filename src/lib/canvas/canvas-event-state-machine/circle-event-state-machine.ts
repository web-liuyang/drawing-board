import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Circle, generateUUID } from "../../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";

export class CircleEventStateMachine extends CanvasEventStateMachine {
  onmousedown(e: MouseEvent): void {
    const canvas = this.canvas;
    const origin = canvas.toGlobal([e.clientX, e.clientY]);
    const circle = new Circle({
      id: generateUUID(),
      center: origin,
      radius: 0,
    });

    canvas.addGraph(circle);
    canvas.state = new CircleMousedownStateMachine(this.canvas, circle);
  }
}

class CircleMousedownStateMachine extends CanvasEventStateMachine {
  private circle: Circle;

  constructor(canvas: CanvasEventStateMachineOptinos, circle: Circle) {
    super(canvas);
    this.circle = circle;
  }

  onmousedown(): void {
    const { canvas } = this;
    canvas.state = new CircleEventStateMachine(canvas);
  }

  onmousemove(e: MouseEvent): void {
    const { canvas, circle } = this;
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const [x, y] = [position[0] - circle.center[0], position[1] - circle.center[1]];
    const radius = Math.max(Math.abs(x), Math.abs(y));
    const newCircle = circle.clone({ radius });
    canvas.updateGraph(circle.id, newCircle);
  }
}
