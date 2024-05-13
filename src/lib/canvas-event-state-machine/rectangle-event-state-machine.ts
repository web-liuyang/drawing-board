import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { GraphId, Rectangle, generateUUID } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";

export class RectangleEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const [x, y] = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const rectangle = new Rectangle({
      id: generateUUID(),
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      editing: true,
    });

    this.application.graphController.addGraph(rectangle);
    this.application.drawState = new RectangleMousedownStateMachine(this.application, rectangle.id);
  }
}

class RectangleMousedownStateMachine extends CanvasEventStateMachine {
  private id: GraphId;

  private rectangle: Rectangle;

  constructor(canvas: CanvasEventStateMachineOptinos, id: GraphId) {
    super(canvas);
    this.id = id;
    this.rectangle = this.application.graphController.findGraph<Rectangle>(this.id)!;
  }

  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const rectangle = this.application.graphController.findGraph<Rectangle>(this.id)!;
    this.application.graphController.updateGraph(rectangle.id, rectangle.copyWith({ editing: false }));
    this.application.saveState();
    this.application.drawState = new RectangleEventStateMachine(this.application);
  }

  override onMousemove(e: MouseEvent): void {
    super.onMousemove(e);

    const rectangle = this.rectangle;
    const [x, y] = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const { x1, y1, x2, y2 } = rectangle;
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

    this.application.graphController.updateGraph(rectangle.id, newRectangle);
  }

  override onEscape(): void {
    super.onEscape();

    const rectangle = this.application.graphController.findGraph<Rectangle>(this.id)!;
    this.application.graphController.removeGraph(rectangle.id);
    this.application.drawState = new RectangleEventStateMachine(this.application);
  }
}
