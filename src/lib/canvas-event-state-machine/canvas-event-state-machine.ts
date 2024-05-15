import type { Application } from "../application";
import { MouseEventButton } from "../constant/event";

export interface CanvasEvent {
  onKeydown(e: KeyboardEvent): void;
  onWheel(e: WheelEvent): void;
  onMousedown(e: MouseEvent): void;
  onMousemove(e: MouseEvent): void;
  onMouseup(e: MouseEvent): void;

  onEscape(): void;
}

export type CanvasEventStateMachineOptinos = Application;

export abstract class CanvasEventStateMachine implements CanvasEvent {
  protected readonly application: Application;

  private panStart: boolean = false;

  constructor(application: CanvasEventStateMachineOptinos) {
    this.application = application;
  }

  public onKeydown(e: KeyboardEvent): void {}

  public onWheel(e: WheelEvent): void {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.x);
    // console.log(e.pageX);
    // console.log(e.layerX);
    // console.log(e.clientX);
    console.log(e.offsetX);
    console.log(e.offsetY);
    // console.log(e.screenX);
    // console.log(e.movementX);
    const { interactiveCanvas } = this.application;
    const sign = Math.sign(e.deltaY);
    const position = interactiveCanvas.toGlobal([e.offsetX, e.offsetY]);
    console.log(position);
    const scale = sign > 0 ? 0.9 : 1.1;
    const matrix = interactiveCanvas.matrix.scale(scale, scale, position);
    interactiveCanvas.setTransform(matrix);
  }

  public onMousedown(e: MouseEvent): void {
    if (e.button === MouseEventButton.Middle) this.panStart = true;
  }

  public onMousemove(e: MouseEvent): void {
    if (this.panStart) {
      const [x, y] = [e.movementX, e.movementY];
      const matrix = this.application.interactiveCanvas.matrix.translate(x, y);
      this.application.interactiveCanvas.setTransform(matrix);
    }
  }

  public onMouseup(e: MouseEvent): void {
    if (e.button === MouseEventButton.Middle) this.panStart = false;
  }

  public onEscape(): void {}
}
