import { describe, it, expect, vi, beforeEach } from "vitest";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    // Re-import to get fresh module
    const { logger } = await import("../logger.util");
    logger.info("test message");
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toContain("INFO");
    expect(output).toContain("test message");
  });

  it("logs error messages to stderr", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { logger } = await import("../logger.util");
    logger.error("something broke", { code: 500 });
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toContain("ERROR");
    expect(output).toContain("something broke");
  });

  it("logs warn messages", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { logger } = await import("../logger.util");
    logger.warn("heads up");
    expect(spy).toHaveBeenCalled();
  });
});
