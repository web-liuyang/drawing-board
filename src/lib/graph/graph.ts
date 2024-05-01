export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export type GraphId = string;

export interface GraphOptions {
  id: GraphId;
}

export type CopyWithParameter<T> = Partial<Omit<T, "id">>;

export abstract class Graph implements Drawable {
  public readonly id: GraphOptions["id"];

  constructor(options: GraphOptions) {
    this.id = options.id;
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;

  public abstract copyWith(options: CopyWithParameter<unknown>): Graph;

  public abstract hit(point: Point): boolean;

  public abstract towingPointPaint(ctx: CanvasRenderingContext2D): void;
}
