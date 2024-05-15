import type { CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";
import { Circle, GraphId, generateUUID } from "../graph";
import { CanvasEventStateMachine } from "./canvas-event-state-machine";
import { MouseEventButton } from "../constant/event";
import { Log } from "@log";

export class CircleEventStateMachine extends CanvasEventStateMachine {
  override onMousedown(e: MouseEvent): void {
    super.onMousedown(e);

    if (e.button !== MouseEventButton.Primary) return;
    const origin = this.application.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
    const graph = new Circle({ id: generateUUID(), center: origin, radius: 0, editing: true });

    this.application.graphController.addGraph(graph);
    this.application.drawState = new CircleMousedownStateMachine(this.application, graph.id);
    Log.info(`Draw Start ${graph.type}: ${graph.id}`);
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
    const graph = this.application.graphController.findGraph<Circle>(this.id)!;

    this.application.graphController.updateGraph(graph.id, graph.copyWith({ editing: false }));
    this.application.saveState();
    this.application.drawState = new CircleEventStateMachine(this.application);
    Log.info(`Draw Done ${graph.type}: ${graph.id}`);
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

    const graph: Circle = this.application.graphController.findGraph<Circle>(this.id)!;
    this.application.graphController.removeGraph(graph.id);
    this.application.drawState = new CircleEventStateMachine(this.application);
    Log.info(`Draw Cancel ${graph.type}: ${graph.id}`);
  }
}
