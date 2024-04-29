export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export interface GraphOptions {
  id: number;
}

export abstract class Graph implements Drawable {
  public readonly id: GraphOptions["id"];

  constructor(options: GraphOptions) {
    this.id = options.id;
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;
}
