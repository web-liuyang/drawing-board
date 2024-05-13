import type { StrokeCap, StrokeJoin } from "./stroke";
import { v4 as uuid } from "uuid";
import { Style } from "./style";
import { Stroke } from "./stroke";
import { Fill } from "./fill";

export function generateUUID(): string {
  return uuid();
}

export type GetStyleOptions = Pick<CanvasFillStrokeStyles, "strokeStyle" | "fillStyle"> &
  Pick<CanvasPathDrawingStyles, "lineWidth" | "lineCap" | "lineJoin">;

export function getStyle(options: GetStyleOptions): Style {
  return new Style({
    stroke: new Stroke({
      color: options.strokeStyle as string,
      width: options.lineWidth,
      cap: options.lineCap as StrokeCap,
      join: options.lineJoin as StrokeJoin,
    }),
    fill: new Fill({ color: options.fillStyle as string }),
  });
}
