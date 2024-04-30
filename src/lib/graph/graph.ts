export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export interface GraphOptions {
  id: string;
}

export type CloneParameter<T> = Partial<Omit<T, "id">>;

export abstract class Graph implements Drawable {
  public readonly id: GraphOptions["id"];

  constructor(options: GraphOptions) {
    this.id = options.id;
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;

  public abstract clone(options: CloneParameter<unknown>): Graph;
}
