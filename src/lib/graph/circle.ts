import type { CopyWithParameter, GraphOptions } from "./graph";
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

  public copyWith(options: CopyWithParameter<CircleOptions>): Circle {
    return new Circle({
      id: this.id,
      center: options.center ?? this.center,
      radius: options.radius ?? this.radius,
    });
  }

  public hit(point: Point): boolean {
    const [x, y] = point;
    const {
      center: [cx, cy],
      radius,
    } = this;

    if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2)) return true;

    return false;
  }

  public towingPointPaint(ctx: CanvasRenderingContext2D): void {
    console.log(this);
  }
}
