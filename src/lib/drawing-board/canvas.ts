import type { ChangeCallback } from "../notifier/notifier";
import { Matrix } from "../matrix";
import { ChangeNotifier } from "../notifier";
import { CanvasEventStateMachine } from "./canvas-event-state-machine/canvas-event-state-machine";
import { SelectionEventStateMachine } from "./canvas-event-state-machine/selection-event-state-machine";

/**
 * [x, y, w, h]
 */
type Viewbox = [number, number, number, number];

export interface CanvasOptions {
  width: number;
  height: number;
  matrix?: Matrix;
  state?: CanvasEventStateMachine;
}

export class Canvas {
  private oCanvas!: HTMLCanvasElement;

  private state!: CanvasEventStateMachine;

  private matrixNotifier: ChangeNotifier = new ChangeNotifier();

  private options: CanvasOptions;

  private _matrix!: Matrix;

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

  constructor(options: CanvasOptions) {
    this.options = options;
  }

  public ensureInitialized(): void {
    this.initDOM();
    this.initState();
    this.bindEvent();
    this.setTransform(this.options.matrix ?? new Matrix([1, 0, 0, 1, 0, 0]));
  }

  private initState() {
    const { state } = this.options;
    this.state = state ?? new SelectionEventStateMachine(this);
  }

  private initDOM() {
    this.oCanvas = this.createCanvas();
  }

  private createCanvas(): HTMLCanvasElement {
    const node = document.createElement("canvas");
    const { width, height } = this.options;
    node.width = width;
    node.height = height;
    node.style.width = `${width}`;
    node.style.height = `${height}`;
    return node;
  }

  private bindEvent(): void {
    this.oCanvas.addEventListener("wheel", e => this.state.onwheel(e), false);
    this.oCanvas.addEventListener("mousedown", e => this.state.onmousedown(e), false);
    this.oCanvas.addEventListener("mousemove", e => this.state.onmousemove(e), false);
    this.oCanvas.addEventListener("mouseup", e => this.state.onmouseup(e), false);
  }

  public setTransform(matrix: Matrix): void {
    const ctx = this.ctx;
    ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    this._matrix = matrix;
    this.setLineWidth(matrix);
    this.setViewbox(matrix);
    this.matrixNotifier.notifyListeners();
  }

  private setLineWidth(matrix: Matrix): void {
    const ctx = this.ctx;
    ctx!.lineWidth = 1 / ((matrix.a + matrix.d) / 2);
  }

  private setViewbox(matrix: Matrix): void {
    const { width, height } = this.options;
    this._viewbox = [-matrix.tx / matrix.a, -matrix.ty / matrix.d, width / matrix.a, height / matrix.d];
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

  public addMatrixListener(cb: ChangeCallback): void {
    this.matrixNotifier.addListener(cb);
  }

  public setState(state: CanvasEventStateMachine): void {
    this.state = state;
  }
}
