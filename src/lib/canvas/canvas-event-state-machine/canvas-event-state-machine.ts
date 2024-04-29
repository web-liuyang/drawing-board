import { Canvas } from "../canvas";

export interface CanvasEvent {
  onwheel(e: WheelEvent): void;
  onmousedown(e: MouseEvent): void;
  onmousemove(e: MouseEvent): void;
  onmouseup(e: MouseEvent): void;
}

export type CanvasEventStateMachineOptinos = Canvas;

export abstract class CanvasEventStateMachine implements CanvasEvent {
  protected canvas: Canvas;

  constructor(canvas: CanvasEventStateMachineOptinos) {
    this.canvas = canvas;
  }

  onwheel(e: WheelEvent): void {}

  onmousedown(e: MouseEvent): void {}

  onmousemove(e: MouseEvent): void {}

  onmouseup(e: MouseEvent): void {}
}
