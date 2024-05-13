import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Circle, GraphId, generateUUID } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";

export class CircleEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const origin = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const circle = new Circle({ id: generateUUID(), center: origin, radius: 0, editing: true });

    this.application.graphController.addGraph(circle);
    this.application.drawState = new CircleMousedownStateMachine(this.application, circle.id);
  }
}

class CircleMousedownStateMachine extends CanvasEventStateMachine {
  private id: GraphId;

  constructor(optinos: CanvasEventStateMachineOptinos, id: GraphId) {
    super(optinos);
    this.id = id;
  }

  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const circle = this.application.graphController.findGraph<Circle>(this.id)!;

    this.application.graphController.updateGraph(circle.id, circle.copyWith({ editing: false }));
    this.application.saveState();
    this.application.drawState = new CircleEventStateMachine(this.application);
  }

  override onMousemove(e: MouseEvent): void {
    super.onMousemove(e);

    const circle = this.application.graphController.findGraph<Circle>(this.id)!;
    const position = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const [x, y] = [position[0] - circle.center[0], position[1] - circle.center[1]];
    const radius = Math.max(Math.abs(x), Math.abs(y));

    this.application.graphController.updateGraph(circle.id, circle.copyWith({ radius }));
  }

  override onEscape(): void {
    super.onEscape();

    const circle: Circle = this.application.graphController.findGraph<Circle>(this.id)!;
    this.application.graphController.removeGraph(circle.id);
    this.application.drawState = new CircleEventStateMachine(this.application);
  }
}
