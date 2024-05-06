import { v4 as uuid } from "uuid";
import { Style } from "./style";
import { Stroke } from "./stroke";
import { Fill } from "./fill";

export function generateUUID(): string {
  return uuid();
}

export function getStyle(ctx: CanvasRenderingContext2D): Style {
  return new Style({
    stroke: new Stroke({
      color: ctx.strokeStyle as string,
      width: ctx.lineWidth,
      cap: ctx.lineCap,
      join: ctx.lineJoin,
    }),
    fill: new Fill({
      color: ctx.fillStyle as string,
    }),
  });
}
