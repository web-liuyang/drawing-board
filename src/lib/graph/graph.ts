export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export type GraphId = string;

export interface GraphOptions {
  id: GraphId;
  selected: boolean;
}

export type CopyWithParameter<T extends GraphOptions> = Partial<Omit<T, "id">>;

export abstract class Graph implements Drawable {
  public readonly id: GraphOptions["id"];

  public readonly selected: GraphOptions["selected"];

  constructor(options: GraphOptions) {
    this.id = options.id;
    this.selected = options.selected;
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;

  public abstract copyWith(options: CopyWithParameter<GraphOptions>): Graph;

  public abstract hit(point: Point): boolean;

  public abstract towingPointPaint(ctx: CanvasRenderingContext2D): void;
}
