import type { CanvasEventStateMachineOptinos } from "../canvas/canvas-event-state-machine";
import { absoluteError } from "../math";
import { Canvas } from "../canvas/canvas";
import { CanvasEventStateMachine } from "../canvas/canvas-event-state-machine";
import { GraphController } from "../graph/graph-controller";
import { ValueNotifier } from "../notifier";

export interface DrawingBoardOptions {
  width: number;
  height: number;
}

export class DrawingBoard {
  private options: DrawingBoardOptions;

  private canvas!: Canvas;

  public readonly graphController: GraphController = new GraphController();

  get node(): HTMLCanvasElement {
    return this.canvas.node;
  }

  get drawState(): ValueNotifier<CanvasEventStateMachine> {
    return this.canvas.drawState;
  }

  constructor(options: DrawingBoardOptions) {
    this.options = options;
  }

  public ensureInitialized(): void {
    this.initCanvas();
    this.bindEvent();
  }

  private initCanvas(): void {
    const { width, height } = this.options;
    this.canvas = new Canvas({
      width,
      height,
      graphController: this.graphController,
    });
    this.canvas.ensureInitialized();
  }

  private bindEvent(): void {
    const { canvas, graphController } = this;

    canvas.addMatrixListener(() => {
      this.render();
    });

    graphController.addListener(() => {
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
    this.background(ctx);

    const graphs = this.graphController.graphs;
    for (const graph of graphs) {
      graph.paint(ctx);
      if (graph.selected) graph.towingPointPaint(ctx);
    }
  }

  public setDrawState(State: new (options: CanvasEventStateMachineOptinos) => CanvasEventStateMachine): void {
    this.canvas.drawState.value = new State(this.canvas);
  }
}
