import { absoluteError } from "../math";
import { Canvas } from "./canvas";
import { Controller } from "./controller";
import { Draw } from "./draw";

export interface DrawingBoardOptions {
  width: number;
  height: number;
}

export class DrawingBoard {
  private options: DrawingBoardOptions;

  private canvas!: Canvas;

  private draw!: Draw;

  public readonly controller: Controller = new Controller();

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
  }

  private background(ctx: CanvasRenderingContext2D): void {
    const [x, y, w, h] = this.canvas.viewbox;
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

  public render(): void {
    this.canvas.clean();
    const ctx = this.canvas.ctx;
    const graphs = this.controller.graphs;
    this.background(ctx);

    for (const graph of graphs) {
      graph.paint(ctx);
    }
  }
}
