import { Matrix } from "../matrix";
import { absoluteError } from "../math";

/**
 * [x, y, w, h]
 */
type Viewbox = [number, number, number, number];

interface InteractiveCanvasEvent {
  onMatrixChange: ValueFunction<Matrix>;

  onKeydown: ValueFunction<KeyboardEvent>;
  onWheel: ValueFunction<WheelEvent>;
  onMousedown: ValueFunction<MouseEvent>;
  onMousemove: ValueFunction<MouseEvent>;
  onMouseup: ValueFunction<MouseEvent>;

  onEscape: VoidFunction;
}

export interface InteractiveCanvasComponentOptions {
  width: number;
  height: number;
  event: InteractiveCanvasEvent;
}

export class InteractiveCanvasComponent implements Component {
  private oCanvas: HTMLCanvasElement;

  private event: InteractiveCanvasComponentOptions["event"];

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

  constructor(options: InteractiveCanvasComponentOptions) {
    this.width = options.width;
    this.height = options.height;
    this.event = options.event;
    this._matrix = new Matrix([1, 0, 0, 1, this.width / 2, this.height / 2]);
    this.oCanvas = createCanvas(this.width, this.height);

    this.setLineWidth(this._matrix);
    this.ctx.setTransform(this._matrix);
    this.setViewbox(this._matrix);

    this.bindEvent(options.event);
  }

  private bindEvent(event: InteractiveCanvasComponentOptions["event"]): void {
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

  private background(ctx: CanvasRenderingContext2D, viewbox: Viewbox): void {
    const [x, y, w, h] = viewbox;
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

  public clean(): void {
    const ctx = this.ctx;
    ctx.clearRect(...this._viewbox);
  }

  public update(): void {
    this.render();
  }

  public render() {
    this.clean();
    this.background(this.ctx, this.viewbox);
  }
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const node = document.createElement("canvas");
  node.width = w;
  node.height = h;
  node.style.width = `${w}`;
  node.style.height = `${h}`;
  return node;
}
