import { Fill } from "./fill";
import { Stroke, StrokeCap, StrokeJoin } from "./stroke";

interface StyleOptions {
  stroke: Stroke;
  fill: Fill;
}

export class Style implements Cloneable<StyleOptions>, Equatable<Style> {
  static default() {
    return new Style({
      stroke: new Stroke({
        color: "#000",
        width: 1,
        cap: StrokeCap.butt,
        join: StrokeJoin.miter,
      }),
      fill: new Fill({
        color: "transparent",
      }),
    });
  }

  public readonly stroke: Stroke;

  public readonly fill: Fill;

  constructor(options: StyleOptions) {
    this.stroke = options.stroke;
    this.fill = options.fill;
  }

  public copyWith(options: Partial<StyleOptions>): Style {
    return new Style({
      stroke: options.stroke ?? this.stroke,
      fill: options.fill ?? this.fill,
    });
  }

  public equals(other: Style): boolean {
    return this.stroke.equals(other.stroke) && this.fill.equals(other.fill);
  }
}
