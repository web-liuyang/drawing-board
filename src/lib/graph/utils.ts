import type { StrokeCap, StrokeJoin } from "./stroke";
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
      cap: ctx.lineCap as StrokeCap,
      join: ctx.lineJoin as StrokeJoin,
    }),
    fill: new Fill({
      color: ctx.fillStyle as string,
    }),
  });
}

export function absuluteError(num1: number, num2: number): number {
  return Math.abs(num1 - num2);
}

export function absuluteErrorByPoint(p1: Point, p2: Point): Point {
  return [absuluteError(p1[0], p2[0]), absuluteError(p1[1], p2[1])];
}
