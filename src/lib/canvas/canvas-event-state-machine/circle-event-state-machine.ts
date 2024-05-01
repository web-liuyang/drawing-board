import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Circle, generateUUID } from "../../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../../constant/event";

export class CircleEventStateMachine extends CanvasEventStateMachine {
  onmousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;

    const { canvas } = this;
    const origin = canvas.toGlobal([e.clientX, e.clientY]);
    const circle = new Circle({
      id: generateUUID(),
      center: origin,
      radius: 0,
    });

    canvas.graphController.addGraph(circle);
    canvas.drawState.value = new CircleMousedownStateMachine(this.canvas, circle);
  }
}

class CircleMousedownStateMachine extends CanvasEventStateMachine {
  private circle: Circle;

  constructor(canvas: CanvasEventStateMachineOptinos, circle: Circle) {
    super(canvas);
    this.circle = circle;
  }

  onmousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;
    const { canvas } = this;
    canvas.drawState.value = new CircleEventStateMachine(canvas);
  }

  onmousemove(e: MouseEvent): void {
    const { canvas, circle } = this;
    const position = canvas.toGlobal([e.clientX, e.clientY]);
    const [x, y] = [position[0] - circle.center[0], position[1] - circle.center[1]];
    const radius = Math.max(Math.abs(x), Math.abs(y));
    const newCircle = circle.copyWith({ radius });
    canvas.graphController.updateGraph(circle.id, newCircle);
  }

  onescape(): void {
    const { canvas, circle } = this;
    canvas.graphController.removeGraph(circle.id);
    canvas.drawState.value = new CircleEventStateMachine(canvas);
  }
}
