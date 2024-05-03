export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export type GraphId = string;

export interface GraphOptions {
  id: GraphId;
  selected?: boolean;
  editing?: boolean;
}

export type CopyWithParameter<T extends GraphOptions> = Partial<Omit<T, "id">>;

export abstract class Graph implements Drawable {
  public readonly id: GraphOptions["id"];

  public readonly selected: boolean;

  public readonly editing: boolean;

  constructor(options: GraphOptions) {
    this.id = options.id;
    this.selected = options.selected ?? false;
    this.editing = options.editing ?? false;
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;

  public abstract copyWith(options: CopyWithParameter<GraphOptions>): Graph;

  public abstract hit(point: Point): boolean;

  public abstract towingPointPaint(ctx: CanvasRenderingContext2D): void;
}
