import { describe, it, expect } from "vitest";
import { iconName } from "./icon";

describe("iconName", () => {
  it("iconName('account')", () => {
    expect(iconName("account")).toBe("codicon codicon-account");
  });

  it("iconName('')", () => {
    expect(iconName("")).toBe("codicon codicon-");
  });
});
