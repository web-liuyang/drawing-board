import type { ChangeCallback } from "../notifier/notifier";
import type { GraphController } from "../graph/graph-controller";
import { Matrix } from "../matrix";
import { ChangeNotifier, ValueNotifier } from "../notifier";
import { CanvasEventStateMachine, SelectionEventStateMachine } from "../canvas-event-state-machine";
import { GraphId } from "../graph";
import { absoluteError } from "../math";

/**
 * [x, y, w, h]
 */
type Viewbox = [number, number, number, number];

interface CanvasEvent {
  onMatrixChange: ValueFunction<Matrix>;

  onKeydown: ValueFunction<KeyboardEvent>;
  onWheel: ValueFunction<WheelEvent>;
  onMousedown: ValueFunction<MouseEvent>;
  onMousemove: ValueFunction<MouseEvent>;
  onMouseup: ValueFunction<MouseEvent>;

  onEscape: VoidFunction;
}

export interface CanvasOptions {
  width: number;
  height: number;
  event: CanvasEvent;
}

export class InteractiveCanvas {
  private oCanvas: HTMLCanvasElement;

  private event: CanvasOptions["event"];

  // public readonly drawState: ValueNotifier<CanvasEventStateMachine> = new ValueNotifier<CanvasEventStateMachine>(
  //   new SelectionEventStateMachine(this),
  // );

  private _matrix: Matrix = new Matrix([1, 0, 0, 1, 0, 0]);

  private _viewbox: Viewbox = [0, 0, 0, 0];

  public get matrix(): Matrix {
    return this._matrix.clone();
  }

  public get viewbox(): Viewbox {
    return [...this._viewbox];
  }

  public get node(): HTMLCanvasElement {
    return this.oCanvas;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.oCanvas.getContext("2d")!;
  }

  public readonly width: number;

  public readonly height: number;

  constructor(options: CanvasOptions) {
    this.width = options.width;
    this.height = options.height;
    this.event = options.event;
    this._matrix = new Matrix([1, 0, 0, 1, this.width / 2, this.height / 2]);
    this.oCanvas = this.createCanvas(this.width, this.height);

    this.setLineWidth(this._matrix);
    this.ctx.setTransform(this._matrix);
    this.setViewbox(this._matrix);

    this.bindEvent();
  }

  private createCanvas(w: number, h: number): HTMLCanvasElement {
    const node = document.createElement("canvas");
    node.width = w;
    node.height = h;
    node.style.width = `${w}`;
    node.style.height = `${h}`;
    return node;
  }

  private bindEvent(): void {
    // const drawState = this.drawState;
    const { event } = this;
    // window.addEventListener("keydown", e => drawState.value.onkeydown(e), false);
    // this.oCanvas.addEventListener("wheel", e => drawState.value.onwheel(e), false);
    // this.oCanvas.addEventListener("mousedown", e => drawState.value.onmousedown(e), false);
    // this.oCanvas.addEventListener("mousemove", e => drawState.value.onmousemove(e), false);
    // this.oCanvas.addEventListener("mouseup", e => drawState.value.onmouseup(e), false);
    window.addEventListener(
      "keydown",
      e => {
        if (e.key === "Escape") event.onEscape();
        event.onKeydown(e);
      },
      false,
    );
    this.oCanvas.addEventListener("wheel", e => event.onWheel(e), false);
    this.oCanvas.addEventListener("mousedown", e => event.onMousedown(e), false);
    this.oCanvas.addEventListener("mousemove", e => event.onMousemove(e), false);
    this.oCanvas.addEventListener("mouseup", e => event.onMouseup(e), false);
  }

  public setTransform(matrix: Matrix): void {
    const { ctx, event } = this;
    this._matrix = matrix;
    ctx.setTransform(this._matrix);
    this.setLineWidth(this._matrix);
    this.setViewbox(this._matrix);
    event.onMatrixChange(this._matrix);
  }

  private setLineWidth(matrix: Matrix): void {
    this.ctx.lineWidth = 1 / ((matrix.a + matrix.d) / 2);
  }

  private setViewbox(matrix: Matrix): void {
    const { width, height } = this;
    this._viewbox = [-matrix.e / matrix.a, -matrix.f / matrix.d, width / matrix.a, height / matrix.d];
  }

  public toGlobal(point: Point): Point {
    const [startX, startY] = this._viewbox;
    const { a, d } = this._matrix;
    const [x, y] = point;

    return [startX + x / a, startY + y / d];
  }

  public clean(): void {
    const ctx = this.ctx;
    ctx.clearRect(...this._viewbox);
  }

  public background(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.viewbox;
    const gap = 20;
    const xLen = Math.ceil(absoluteError(x, x + w) / gap) + 1;
    const yLen = Math.ceil(absoluteError(y, y + h) / gap) + 1;
    const xStart = x - (x % gap);
    const yStart = y - (y % gap);
    const path = new Path2D();

    for (let i = 0; i < xLen; i++) {
      path.moveTo(xStart + i * gap, y);
      path.lineTo(xStart + i * gap, y + h);
    }

    for (let i = 0; i < yLen; i++) {
      path.moveTo(x, yStart + i * gap);
      path.lineTo(x + w, yStart + i * gap);
    }

    const strokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = "grey";
    ctx.stroke(path);
    ctx.strokeStyle = strokeStyle;
  }

  public render() {
    this.clean();
    this.background(this.ctx);
  }
}
