import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Any, GraphId, generateUUID } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";
import { Log } from "@log";

export class AnyEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const origin = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const graph = new Any({ id: generateUUID(), points: [origin], editing: true });

    this.application.graphController.addGraph(graph);
    this.application.drawState = new AnyMousedownStateMachine(this.application, graph.id);

    Log.info(`Draw Start ${graph.type}: ${graph.id}`);
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
    const graph = this.application.graphController.findGraph<Any>(this.id)!;

    this.application.graphController.updateGraph(graph.id, graph.copyWith({ editing: false }));
    this.application.saveState();
    this.application.drawState = new AnyEventStateMachine(this.application);
    Log.info(`Draw Done ${graph.type}: ${graph.id}`);
  }

  override onMousemove(e: MouseEvent): void {
    super.onMousemove(e);

    const any = this.application.graphController.findGraph<Any>(this.id)!;
    const position = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);

    this.application.graphController.updateGraph(any.id, any.copyWith({ points: [...any.points, position] }));
  }

  override onEscape(): void {
    super.onEscape();

    const graph: Any = this.application.graphController.findGraph<Any>(this.id)!;
    this.application.graphController.removeGraph(graph.id);
    this.application.drawState = new AnyEventStateMachine(this.application);
    Log.info(`Draw Cancel ${graph.type}: ${graph.id}`);
  }
}
