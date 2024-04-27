import { Canvas } from "./canvas";
import { Draw } from "./draw";

export interface DrawingBoardOptions {
  width: number;
  height: number;
}

export class DrawingBoard {
  private options: DrawingBoardOptions;

  private canvas!: Canvas;

  private draw!: Draw;

  get node(): HTMLCanvasElement {
    return this.canvas.node;
  }

  constructor(options: DrawingBoardOptions) {
    this.options = options;
  }

  public ensureInitialized(): void {
    this.initCanvas();
    this.initDraw();
    this.bindEvent();
    this.render();
  }

  private initCanvas(): void {
    const { width, height } = this.options;
    this.canvas = new Canvas({ width, height });
    this.canvas.ensureInitialized();
  }

  private initDraw() {
    this.draw = new Draw({ ctx: this.canvas.ctx });
  }

  private bindEvent(): void {
    const canvas = this.canvas;

    canvas.addMatrixListener(() => {
      this.render();
    });

    canvas.addMousemoveListener(() => {});
  }

  public render(): void {
    this.canvas.clean();
    const ctx = this.canvas.ctx;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}
