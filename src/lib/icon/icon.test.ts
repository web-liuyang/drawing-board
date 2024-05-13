// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { icon, iconName } from "./icon";

describe("iconName", () => {
  it("iconName('account')", () => {
    expect(iconName("account")).toBe("codicon codicon-account");
  });

  it("iconName('')", () => {
    expect(iconName("")).toBe("codicon codicon-");
  });
});

describe("icon", () => {
  it("icon('account')", () => {
    const oI = document.createElement("i");
    oI.className = iconName("account");
    expect(icon("account")).toEqual(oI);
  });

  it("icon('')", () => {
    const oI = document.createElement("i");
    oI.className = iconName("");
    expect(icon("")).toEqual(oI);
  });
});
