import { Canvas } from "../canvas";

export interface CanvasEvent {
  onkeydown(e: KeyboardEvent): void;
  onwheel(e: WheelEvent): void;
  onmousedown(e: MouseEvent): void;
  onmousemove(e: MouseEvent): void;
  onmouseup(e: MouseEvent): void;

  onescape(): void;
}

export type CanvasEventStateMachineOptinos = Canvas;

export abstract class CanvasEventStateMachine implements CanvasEvent {
  protected canvas: Canvas;

  constructor(canvas: CanvasEventStateMachineOptinos) {
    this.canvas = canvas;
  }

  onkeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") this.onescape();
  }

  onwheel(e: WheelEvent): void {}

  onmousedown(e: MouseEvent): void {}

  onmousemove(e: MouseEvent): void {}

  onmouseup(e: MouseEvent): void {}

  onescape(): void {
    this.canvas.drawState.reset();
  }
}
