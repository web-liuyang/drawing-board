import { Style } from "./style";
import { getStyle } from "./utils";

export interface Drawable {
  paint(ctx: CanvasRenderingContext2D): void;
}

export type GraphId = string;

export interface GraphOptions {
  id: GraphId;
  selected?: boolean;
  editing?: boolean;
  style?: Style;
}

export type CopyWithParameter<T extends GraphOptions> = Partial<Omit<T, "id">>;

export abstract class Graph<T extends GraphOptions = GraphOptions>
  implements Drawable, Cloneable<CopyWithParameter<T>>, Equatable<Graph>
{
  public abstract readonly type: string;

  public readonly id: T["id"];

  public readonly selected: boolean;

  public readonly editing: boolean;

  public readonly style: Style;

  constructor(options: T) {
    this.id = options.id;
    this.selected = options.selected ?? false;
    this.editing = options.editing ?? false;
    this.style = options.style ?? Style.default();
  }

  public abstract paint(ctx: CanvasRenderingContext2D): void;

  public abstract copyWith(options: CopyWithParameter<T>): Graph<T>;

  public abstract hit(point: Point): boolean;

  public abstract towingPointPaint(ctx: CanvasRenderingContext2D): void;

  public draw(ctx: CanvasRenderingContext2D, fn: () => void): void {
    const style = getStyle(ctx);
    this.applyStyle(ctx, this.style);
    fn();
    this.applyStyle(ctx, style);
  }

  private applyStyle(ctx: CanvasRenderingContext2D, style: Style): void {
    ctx.strokeStyle = style.stroke.color;
    ctx.lineWidth = style.stroke.width;
    ctx.lineCap = style.stroke.cap;
    ctx.lineJoin = style.stroke.join;
    ctx.fillStyle = style.fill.color;
  }

  public equals(other: Graph): boolean {
    return (
      this.type === other.type &&
      this.id === other.id &&
      this.style.equals(other.style) &&
      this.selected === other.selected &&
      this.editing === other.editing
    );
  }
}
