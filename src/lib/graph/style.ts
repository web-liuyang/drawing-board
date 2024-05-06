import { Fill } from "./fill";
import { Stroke } from "./stroke";

interface StyleOptions {
  stroke: Stroke;
  fill: Fill;
}

export class Style implements Cloneable<StyleOptions> {
  static default() {
    return new Style({
      stroke: new Stroke({
        color: "#000",
        width: 1,
        cap: "butt",
        join: "miter",
      }),
      fill: new Fill({
        color: "#fff",
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
}
