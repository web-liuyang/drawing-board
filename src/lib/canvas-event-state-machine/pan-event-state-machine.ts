import { CanvasEventStateMachine, CanvasEventStateMachineOptinos } from "./canvas-event-state-machine";

export class PanEventStateMachine extends CanvasEventStateMachine {
  private parent: CanvasEventStateMachine;

  constructor(application: CanvasEventStateMachineOptinos, parent: CanvasEventStateMachine) {
    super(application);
    this.parent = parent;
  }

  override onMousemove(e: MouseEvent): void {
    const [x, y] = [e.movementX, e.movementY];
    const matrix = this.application.interactiveCanvas.matrix.translate(x, y);
    this.application.interactiveCanvas.setTransform(matrix);
  }

  override onMouseup(): void {
    this.application.drawState = this.parent;
  }
}
