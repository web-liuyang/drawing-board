import type { CloneParameter, GraphOptions } from "./graph";
import { Graph } from "./graph";

export interface RectangleOptions extends GraphOptions {
  width: number;
  height: number;
  center: Point;
}

export class Rectangle extends Graph {
  public readonly width: number;

  public readonly height: number;

  public readonly center: Point;

  constructor(options: RectangleOptions) {
    super(options);
    this.width = options.width;
    this.height = options.height;
    this.center = options.center;
  }

  public paint(ctx: CanvasRenderingContext2D): void {
    const width = this.width;
    const height = this.height;
    const [x, y] = [this.center[0] - width / 2, this.center[1] - height / 2];
    const path = new Path2D();
    path.rect(x, y, width, height);
    ctx.stroke(path);
  }

  public clone(options: CloneParameter<Rectangle>): Rectangle {
    return new Rectangle({
      id: this.id,
      width: options.width ?? this.width,
      height: options.height ?? this.height,
      center: options.center ?? this.center,
    });
  }
}
