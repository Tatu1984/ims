import { describe, it, expect } from "vitest";
import { loginSchema } from "../auth.validator";

describe("loginSchema", () => {
  it("validates valid login", () => {
    const result = loginSchema.safeParse({
      email: "admin@company.com",
      password: "admin123",
    });
    expect(result.success).toBe(true);
  });

  it("requires email", () => {
    const result = loginSchema.safeParse({ password: "pass123" });
    expect(result.success).toBe(false);
  });

  it("requires password", () => {
    const result = loginSchema.safeParse({ email: "admin@company.com" });
    expect(result.success).toBe(false);
  });

  it("requires valid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "pass123",
    });
    expect(result.success).toBe(false);
  });

  it("requires non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "admin@company.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
