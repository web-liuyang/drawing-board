import type { CloneParameter, GraphOptions } from "./graph";
import { Graph } from "./graph";

export interface CircleOptions extends GraphOptions {
  center: Point;
  radius: number;
}

export class Circle extends Graph {
  public readonly radius: number;

  public readonly center: Point;

  constructor(options: CircleOptions) {
    super(options);
    this.radius = options.radius;
    this.center = options.center;
  }

  public paint(ctx: CanvasRenderingContext2D): void {
    const [x, y] = this.center;
    const radius = this.radius;
    const path = new Path2D();

    path.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke(path);
  }

  public clone(options: CloneParameter<CircleOptions>): Circle {
    return new Circle({
      id: this.id,
      center: options.center ?? this.center,
      radius: options.radius ?? this.radius,
    });
  }
}
