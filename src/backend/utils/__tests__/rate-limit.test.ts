import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rate-limit.util";

describe("checkRateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result = checkRateLimit(key, 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, 3, 60000);
    }
    const result = checkRateLimit(key, 3, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const key = `test-reset-${Date.now()}`;
    // Use a 1ms window so it expires immediately
    checkRateLimit(key, 1, 1);

    // Wait a bit for window to expire
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait
    }

    const result = checkRateLimit(key, 1, 1);
    expect(result.allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const key1 = `test-sep1-${Date.now()}`;
    const key2 = `test-sep2-${Date.now()}`;

    checkRateLimit(key1, 1, 60000);
    const blocked = checkRateLimit(key1, 1, 60000);
    expect(blocked.allowed).toBe(false);

    const result = checkRateLimit(key2, 1, 60000);
    expect(result.allowed).toBe(true);
  });
});
