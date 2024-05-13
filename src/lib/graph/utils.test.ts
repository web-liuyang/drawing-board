// @vitest-environment happy-dom

import type { GetStyleOptions } from "./utils";
import { describe, it, expect } from "vitest";
import { getStyle } from "./utils";
import { Style } from "./style";
import { Stroke, StrokeCap, StrokeJoin } from "./stroke";
import { Fill } from "./fill";

describe("getStyle", () => {
  it("getStyle(object)", () => {
    expect(
      getStyle({
        fillStyle: "#000",
        strokeStyle: "#000",
        lineWidth: 1,
        lineCap: StrokeCap.butt,
        lineJoin: StrokeJoin.miter,
      } as GetStyleOptions),
    ).toEqual(
      new Style({
        stroke: new Stroke({ color: "#000", width: 1, cap: StrokeCap.butt, join: StrokeJoin.miter }),
        fill: new Fill({ color: "#000" }),
      }),
    );
  });
});
