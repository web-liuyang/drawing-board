import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Rectangle, generateUUID } from "../../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../../constant/event";

export class RectangleEventStateMachine extends CanvasEventStateMachine {
  onmousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;
    const canvas = this.canvas;
    const [x, y] = canvas.toGlobal([e.clientX, e.clientY]);
    const rectangle = new Rectangle({
      id: generateUUID(),
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    });

    canvas.graphController.addGraph(rectangle);
    canvas.drawState.value = new RectangleMousedownStateMachine(this.canvas, rectangle);
  }
}

class RectangleMousedownStateMachine extends CanvasEventStateMachine {
  private rectangle: Rectangle;

  constructor(canvas: CanvasEventStateMachineOptinos, rectangle: Rectangle) {
    super(canvas);
    this.rectangle = rectangle;
  }

  onmousedown(e: MouseEvent): void {
    if (e.button !== MouseEventButton.Primary) return;
    const { canvas } = this;
    const rectangle = canvas.graphController.findGraph<Rectangle>(this.rectangle.id);
    if (rectangle && rectangle.x1 === rectangle.x2 && rectangle.y1 === rectangle.y2) {
      canvas.graphController.removeGraph(rectangle.id);
    }

    canvas.drawState.value = new RectangleEventStateMachine(canvas);
  }

  onmousemove(e: MouseEvent): void {
    const { canvas, rectangle } = this;
    const { x1, y1, x2, y2 } = rectangle;
    const [x, y] = canvas.toGlobal([e.clientX, e.clientY]);
    const [dx, dy] = [x - x2, y - y2];

    let newRectangle: Rectangle = rectangle;

    if (dx > 0 && dy > 0) {
      newRectangle = rectangle.copyWith({ x1: x1, y1: y1, x2: x, y2: y });
    }

    if (dx > 0 && dy < 0) {
      newRectangle = rectangle.copyWith({ x1: x1, y1: y, x2: x, y2: y2 });
    }
    if (dx < 0 && dy > 0) {
      newRectangle = rectangle.copyWith({ x1: x, y1: y1, x2: x2, y2: y });
    }
    if (dx < 0 && dy < 0) {
      newRectangle = rectangle.copyWith({ x1: x, y1: y, x2: x2, y2: y2 });
    }

    canvas.graphController.updateGraph(rectangle.id, newRectangle);
  }

  onescape(): void {
    const { canvas, rectangle } = this;
    canvas.graphController.removeGraph(rectangle.id);
    canvas.drawState.value = new RectangleEventStateMachine(canvas);
  }
}
