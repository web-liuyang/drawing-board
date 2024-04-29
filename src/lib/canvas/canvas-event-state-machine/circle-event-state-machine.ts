import { Circle, generateUUID } from "../../graph";
import { CanvasEventStateMachine, CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";

export class CircleEventStateMachine extends CanvasEventStateMachine {
  onmousedown(e: MouseEvent): void {
    const canvas = this.canvas;
    const origin = canvas.toGlobal([e.clientX, e.clientY]);

    canvas.state = new CircleMousedownStateMachine(this.canvas, origin);
  }
}

class CircleMousedownStateMachine extends CanvasEventStateMachine {
  private origin: Point;

  private radius: number = 0;

  constructor(canvas: CanvasEventStateMachineOptinos, origin: Point) {
    super(canvas);
    this.origin = origin;
  }

  onmousedown(): void {
    const { canvas, origin, radius } = this;

    const circle = new Circle({
      id: generateUUID(),
      center: origin,
      radius: radius,
    });

    canvas.addGraph(circle);
    canvas.state = new CircleEventStateMachine(canvas);
  }

  onmousemove(e: MouseEvent): void {
    const canvas = this.canvas;
    const origin = this.origin;
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const [x, y] = [position[0] - origin[0], position[1] - origin[1]];
    const radius = Math.max(Math.abs(x), Math.abs(y));
    this.radius = radius;
  }
}
