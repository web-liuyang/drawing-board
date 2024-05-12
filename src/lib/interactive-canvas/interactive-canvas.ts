import type { InteractiveCanvasComponentOptions } from "./interactive-canvas-component";
import { Matrix } from "../matrix";
import { InteractiveCanvasComponent } from "./interactive-canvas-component";

interface InteractiveCanvasOptions extends InteractiveCanvasComponentOptions {}

export class InteractiveCanvas {
  private component: InteractiveCanvasComponent;

  public get matrix(): Matrix {
    return this.component.matrix;
  }

  public get node(): HTMLCanvasElement {
    return this.component.node;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.component.ctx;
  }

  constructor(options: InteractiveCanvasOptions) {
    this.component = new InteractiveCanvasComponent(options);
  }

  public setTransform(matrix: Matrix): void {
    this.component.setTransform(matrix);
  }

  public toGlobal(point: Point): Point {
    const [startX, startY] = this.component.viewbox;
    const { a, d } = this.matrix;
    const [x, y] = point;

    return [startX + x / a, startY + y / d];
  }

  public update(): void {
    this.component.update();
  }

  public render(): void {
    this.component.render();
  }
}
