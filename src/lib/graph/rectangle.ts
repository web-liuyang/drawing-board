import type { CopyWithParameter, GraphOptions } from "./graph";
import { Graph } from "./graph";

export interface RectangleOptions extends GraphOptions {
  // left top x
  x1: number;
  // left top y
  y1: number;
  // right bottom x
  x2: number;
  // right bottom y
  y2: number;
}

export interface RectangleFromCenterOptions extends GraphOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Rectangle extends Graph<RectangleOptions> {
  static fromCenter(options: RectangleFromCenterOptions): Rectangle {
    const [x1, y1] = [options.x - options.width / 2, options.y - options.height / 2];
    const [x2, y2] = [options.x + options.width / 2, options.y + options.height / 2];
    const { id, selected } = options;

    return new Rectangle({
      id,
      x1,
      y1,
      x2,
      y2,
      selected,
    });
  }

  public readonly x1: number;

  public readonly y1: number;

  public readonly x2: number;

  public readonly y2: number;

  public get width(): number {
    const { x1, x2 } = this;
    return Math.abs(x2 - x1);
  }

  public get height(): number {
    const { y1, y2 } = this;
    return Math.abs(y2 - y1);
  }

  constructor(options: RectangleOptions) {
    super(options);
    this.x1 = options.x1;
    this.y1 = options.y1;
    this.x2 = options.x2;
    this.y2 = options.y2;
  }

  public paint(ctx: CanvasRenderingContext2D): void {
    const { x1, y1, x2, y2 } = this;
    const [x, y, w, h] = [x1, y1, x2 - x1, y2 - y1];
    const path = new Path2D();

    this.draw(ctx, () => {
      path.rect(x, y, w, h);
      ctx.stroke(path);
    });
  }

  public copyWith(options: CopyWithParameter<RectangleOptions>): Rectangle {
    return new Rectangle({
      id: this.id,
      x1: options.x1 ?? this.x1,
      y1: options.y1 ?? this.y1,
      x2: options.x2 ?? this.x2,
      y2: options.y2 ?? this.y2,
      selected: options.selected ?? this.selected,
      style: options.style ?? this.style,
    });
  }

  public hit(point: Point): boolean {
    const [x, y] = point;
    const { x1, y1, x2, y2 } = this;
    if (x > x1 && y > y1 && x < x2 && y < y2) return true;
    return false;
  }

  public towingPointPaint(ctx: CanvasRenderingContext2D): void {
    const size = 10;
    const { x1, y1, x2, y2 } = this;
    const leftTop = new Rectangle({
      id: "leftTop",
      x1: x1 - size / 2,
      y1: y1 - size / 2,
      x2: x1 + size / 2,
      y2: y1 + size / 2,
      selected: false,
    });

    const leftBottom = new Rectangle({
      id: "leftBottom",
      x1: x1 - size / 2,
      y1: y2 - size / 2,
      x2: x1 + size / 2,
      y2: y2 + size / 2,
      selected: false,
    });

    const rightTop = new Rectangle({
      id: "rightTop",
      x1: x2 - size / 2,
      y1: y1 - size / 2,
      x2: x2 + size / 2,
      y2: y1 + size / 2,
      selected: false,
    });

    const rightBottom = new Rectangle({
      id: "rightBottom",
      x1: x2 - size / 2,
      y1: y2 - size / 2,
      x2: x2 + size / 2,
      y2: y2 + size / 2,
      selected: false,
    });

    leftTop.paint(ctx);
    leftBottom.paint(ctx);
    rightTop.paint(ctx);
    rightBottom.paint(ctx);
  }
}
