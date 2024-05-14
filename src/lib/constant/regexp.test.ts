import { describe, it, expect } from "vitest";
import { isNumberCorrect } from "./regexp";

describe("isNumberCorrect", () => {
  it("isNumberCorrect(-) === false", () => {
    expect(isNumberCorrect("-")).toBe(false);
  });

  it("isNumberCorrect(--) === false", () => {
    expect(isNumberCorrect("--")).toBe(false);
  });

  it("isNumberCorrect(.) === false", () => {
    expect(isNumberCorrect(".")).toBe(false);
  });

  it("isNumberCorrect(..) === false", () => {
    expect(isNumberCorrect("..")).toBe(false);
  });

  it("isNumberCorrect(-0) === true", () => {
    expect(isNumberCorrect("-0")).toBe(true);
  });

  it("isNumberCorrect(-00) === false", () => {
    expect(isNumberCorrect("-00")).toBe(false);
  });

  it("isNumberCorrect(-00.) === false", () => {
    expect(isNumberCorrect("-00.")).toBe(false);
  });

  it("isNumberCorrect(-00.1) === false", () => {
    expect(isNumberCorrect("-00.1")).toBe(false);
  });

  it("isNumberCorrect(-0-) === false", () => {
    expect(isNumberCorrect("-0-")).toBe(false);
  });

  it("isNumberCorrect(-0.) === false", () => {
    expect(isNumberCorrect("-0.")).toBe(false);
  });

  it("isNumberCorrect(01) === false", () => {
    expect(isNumberCorrect("01")).toBe(false);
  });

  it("isNumberCorrect(001) === false", () => {
    expect(isNumberCorrect("001")).toBe(false);
  });

  it("isNumberCorrect(0011) === false", () => {
    expect(isNumberCorrect("0011")).toBe(false);
  });

  it("isNumberCorrect(-0011) === false", () => {
    expect(isNumberCorrect("-0011")).toBe(false);
  });

  it("isNumberCorrect(.11) === false", () => {
    expect(isNumberCorrect(".11")).toBe(false);
  });

  it("isNumberCorrect(0.1) === true", () => {
    expect(isNumberCorrect("0.1")).toBe(true);
  });

  it("isNumberCorrect(0..1) === false", () => {
    expect(isNumberCorrect("0..1")).toBe(false);
  });

  it("isNumberCorrect(.1) === false", () => {
    expect(isNumberCorrect(".1")).toBe(false);
  });

  it("isNumberCorrect(..1) === false", () => {
    expect(isNumberCorrect("..1")).toBe(false);
  });

  it("isNumberCorrect(1) === true", () => {
    expect(isNumberCorrect("1")).toBe(true);
  });

  it("isNumberCorrect(1.1) === true", () => {
    expect(isNumberCorrect("1.1")).toBe(true);
  });

  it("isNumberCorrect(1..) === false", () => {
    expect(isNumberCorrect("1..")).toBe(false);
  });

  it("isNumberCorrect(1..1) === false", () => {
    expect(isNumberCorrect("1..1")).toBe(false);
  });
});
