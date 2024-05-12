export enum StrokeCap {
  butt = "butt",
  round = "round",
  square = "square",
}

export enum StrokeJoin {
  miter = "miter",
  round = "round",
  bevel = "bevel",
}

interface StrokeOptions {
  color: string;
  width: number;
  cap: StrokeCap;
  join: StrokeJoin;
}

export class Stroke implements Cloneable<StrokeOptions>, Equatable<Stroke> {
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

  public equals(other: Stroke): boolean {
    return (
      this === other ||
      (this.color === other.color && this.width === other.width && this.cap === other.cap && this.join === other.join)
    );
  }
}
