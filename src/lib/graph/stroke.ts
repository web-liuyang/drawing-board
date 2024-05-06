interface StrokeOptions {
  color: string;
  width: number;
  cap: CanvasLineCap;
  join: CanvasLineJoin;
}

export class Stroke implements Cloneable<StrokeOptions> {
  public readonly color: StrokeOptions["color"];

  public readonly width: StrokeOptions["width"];

  public readonly cap: StrokeOptions["cap"];

  public readonly join: StrokeOptions["join"];

  constructor(options: StrokeOptions) {
    this.color = options.color;
    this.width = options.width;
    this.cap = options.cap;
    this.join = options.join;
  }

  public copyWith(options: Partial<StrokeOptions>): Stroke {
    return new Stroke({
      color: options.color ?? this.color,
      width: options.width ?? this.width,
      cap: options.cap ?? this.cap,
      join: options.join ?? this.join,
    });
  }
}
