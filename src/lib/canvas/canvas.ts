import type { ChangeCallback } from "../notifier/notifier";
import type { GraphController } from "../drawing-board/graph-controller";
import { Matrix } from "../matrix";
import { ChangeNotifier, ValueNotifier } from "../notifier";
import { CanvasEventStateMachine, SelectionEventStateMachine } from "./canvas-event-state-machine";
import { GraphId } from "../graph";

/**
 * [x, y, w, h]
 */
type Viewbox = [number, number, number, number];

export interface CanvasOptions {
  width: number;
  height: number;
  graphController: GraphController;
  selectedGraphIdNotifier: ValueNotifier<GraphId | undefined>;
  matrix?: Matrix;
  state?: CanvasEventStateMachine;
}

export class Canvas {
  private options: CanvasOptions;

  private oCanvas!: HTMLCanvasElement;

  public readonly drawState: ValueNotifier<CanvasEventStateMachine> = new ValueNotifier<CanvasEventStateMachine>(
    new SelectionEventStateMachine(this),
  );

  private _graphController!: GraphController;

  private _selectedGraphIdNotifier!: ValueNotifier<GraphId | undefined>;

  private matrixNotifier: ChangeNotifier = new ChangeNotifier();

  private _matrix!: Matrix;

  private _viewbox: Viewbox = [0, 0, 0, 0];

  public get graphController() {
    return this._graphController;
  }

  public get selectedGraphIdNotifier() {
    return this._selectedGraphIdNotifier;
  }

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
    const { width, height } = this.options;
    const {
      graphController,
      selectedGraphIdNotifier: selectedGraphNotifier,
      matrix = new Matrix([1, 0, 0, 1, width / 2, height / 2]),
    } = this.options;

    this._graphController = graphController;
    this._selectedGraphIdNotifier = selectedGraphNotifier;
    this.initDOM();
    // this.initState();
    this.bindEvent();
    this.setTransform(matrix);
  }

  // private initState() {
  //   const { state } = this.options;
  //   state ? (this._state = state) : this.resetState();
  // }

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
    const drawState = this.drawState;
    window.addEventListener("keydown", e => drawState.value.onkeydown(e), false);
    this.oCanvas.addEventListener("wheel", e => drawState.value.onwheel(e), false);
    this.oCanvas.addEventListener("mousedown", e => drawState.value.onmousedown(e), false);
    this.oCanvas.addEventListener("mousemove", e => drawState.value.onmousemove(e), false);
    this.oCanvas.addEventListener("mouseup", e => drawState.value.onmouseup(e), false);
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

  // public resetState(): void {
  //   this._state = new SelectionEventStateMachine(this);
  // }

  // public addGraph(graph: Graph) {
  //   this._graphController.addGraph(graph);
  // }

  // public updateGraph(id: GraphId, newGraph: Graph) {
  //   this._graphController.updateGraph(id, newGraph);
  // }

  // public removeGraph(id: GraphId) {
  //   this._graphController.removeGraph(id);
  // }
}
