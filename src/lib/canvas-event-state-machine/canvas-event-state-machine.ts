import { Application } from "../application";

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

  constructor(application: CanvasEventStateMachineOptinos) {
    this.application = application;
  }

  onKeydown(e: KeyboardEvent): void {}

  onWheel(e: WheelEvent): void {}

  onMousedown(e: MouseEvent): void {}

  onMousemove(e: MouseEvent): void {}

  onMouseup(e: MouseEvent): void {}

  onEscape(): void {}
}
