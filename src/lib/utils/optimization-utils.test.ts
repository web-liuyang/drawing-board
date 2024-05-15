import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { debounce } from "./optimization-utils";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debounce(func(), 100)", () => {
    let count = 0;

    const func = debounce(() => count++, 100);

    func();
    vi.advanceTimersByTime(10);
    expect(count).toBe(0);
    vi.advanceTimersByTime(100);
    expect(count).toBe(1);
  });

  it("debounce(func(), 200)", () => {
    let count = 0;

    const func = debounce(() => count++, 200);

    func();
    vi.advanceTimersByTime(100);
    expect(count).toBe(0);

    func();
    vi.advanceTimersByTime(100);
    expect(count).toBe(0);

    func();
    vi.advanceTimersByTime(199);
    expect(count).toBe(0);

    func();
    vi.advanceTimersByTime(200);
    expect(count).toBe(1);
  });

  it("debounce(func(name), 100)", () => {
    const result: string[] = [];

    const func = debounce((name: string) => result.push(name), 100);

    func("1");
    vi.advanceTimersByTime(50);

    func("2");
    vi.advanceTimersByTime(50);

    func("3");
    vi.advanceTimersByTime(150);

    func("4");
    vi.advanceTimersByTime(99);

    expect(result).toEqual(["3"]);
  });
});
