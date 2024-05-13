// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { removeElementChild } from "./element-utils";

describe("removeElementChild", () => {
  it("removeElementChild(div)", () => {
    const node = document.createElement("div");
    node.appendChild(document.createElement("div"));
    expect(node.childNodes.length).toBe(1);

    removeElementChild(node);

    expect(node.childNodes.length).toBe(0);
  });
});
