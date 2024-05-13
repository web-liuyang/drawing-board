import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Any, GraphId, generateUUID } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";

export class AnyEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const origin = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const any = new Any({ id: generateUUID(), points: [origin], editing: true });

    this.application.graphController.addGraph(any);
    this.application.drawState = new AnyMousedownStateMachine(this.application, any.id);
  }
}

class AnyMousedownStateMachine extends CanvasEventStateMachine {
  private id: GraphId;

  constructor(optinos: CanvasEventStateMachineOptinos, id: GraphId) {
    super(optinos);
    this.id = id;
  }

  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const any = this.application.graphController.findGraph<Any>(this.id)!;

    this.application.graphController.updateGraph(any.id, any.copyWith({ editing: false }));
    this.application.saveState();
    this.application.drawState = new AnyEventStateMachine(this.application);
  }

  override onMousemove(e: MouseEvent): void {
    super.onMousemove(e);

    const any = this.application.graphController.findGraph<Any>(this.id)!;
    const position = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);

    this.application.graphController.updateGraph(any.id, any.copyWith({ points: [...any.points, position] }));
  }

  override onEscape(): void {
    super.onEscape();

    const any: Any = this.application.graphController.findGraph<Any>(this.id)!;
    this.application.graphController.removeGraph(any.id);
    this.application.drawState = new AnyEventStateMachine(this.application);
  }
}
