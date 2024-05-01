import { describe, expect, it } from "vitest";
import { absoluteError } from "./math";

describe("absoluteError", () => {
  it("absoluteError(-10, -5) === 5", () => {
    expect(absoluteError(-10, -5)).toBe(5);
  });

  it("absoluteError(-10, 0) === 10", () => {
    expect(absoluteError(-10, 0)).toBe(10);
  });

  it("absoluteError(-10, 5) === 15", () => {
    expect(absoluteError(-10, 5)).toBe(15);
  });

  it("absoluteError(0, -5) === 5", () => {
    expect(absoluteError(0, 5)).toBe(5);
  });

  it("absoluteError(0, 0) === 0", () => {
    expect(absoluteError(0, 0)).toBe(0);
  });

  it("absoluteError(0, 5) === 5", () => {
    expect(absoluteError(0, 5)).toBe(5);
  });

  it("absoluteError(10, -5) === 15", () => {
    expect(absoluteError(10, -5)).toBe(15);
  });

  it("absoluteError(10, 0) === 10", () => {
    expect(absoluteError(10, 0)).toBe(10);
  });

  it("absoluteError(10, 5) === 5", () => {
    expect(absoluteError(10, 5)).toBe(5);
  });
});
