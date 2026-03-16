import { describe, it, expect, vi } from "vitest";

// Mock logger to prevent actual console output in tests
vi.mock("@/backend/utils/logger.util", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock api-response to return simple objects
vi.mock("@/backend/utils/api-response.util", () => ({
  error: (message: string, status: number) => ({ message, status }),
}));

import { checkPermission, getUserFromRequest } from "../rbac.util";

function mockRequest(
  method: string,
  pathname: string,
  headers: Record<string, string> = {}
) {
  return {
    method,
    nextUrl: { pathname },
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as unknown as Parameters<typeof checkPermission>[0];
}

describe("getUserFromRequest", () => {
  it("returns null when headers are missing", () => {
    const req = mockRequest("GET", "/api/assets");
    expect(getUserFromRequest(req)).toBeNull();
  });

  it("returns user when all headers present", () => {
    const req = mockRequest("GET", "/api/assets", {
      "x-user-id": "user1",
      "x-user-email": "admin@test.com",
      "x-user-role": "Admin",
    });
    expect(getUserFromRequest(req)).toEqual({
      id: "user1",
      email: "admin@test.com",
      role: "Admin",
    });
  });
});

describe("checkPermission", () => {
  it("allows Admin to access all routes", () => {
    const routes = [
      ["GET", "/api/assets"],
      ["POST", "/api/assets"],
      ["DELETE", "/api/assets/123"],
      ["GET", "/api/users"],
      ["POST", "/api/users"],
      ["DELETE", "/api/users/123"],
      ["GET", "/api/settings"],
      ["PATCH", "/api/settings"],
      ["GET", "/api/audit-log"],
    ] as const;

    for (const [method, path] of routes) {
      const req = mockRequest(method, path, {
        "x-user-id": "admin1",
        "x-user-email": "admin@test.com",
        "x-user-role": "Admin",
      });
      expect(checkPermission(req)).toBeNull(); // null = allowed
    }
  });

  it("blocks Technician from user management", () => {
    const req = mockRequest("GET", "/api/users", {
      "x-user-id": "tech1",
      "x-user-email": "tech@test.com",
      "x-user-role": "Technician",
    });
    const result = checkPermission(req);
    expect(result).not.toBeNull();
  });

  it("blocks Technician from settings", () => {
    const req = mockRequest("GET", "/api/settings", {
      "x-user-id": "tech1",
      "x-user-email": "tech@test.com",
      "x-user-role": "Technician",
    });
    expect(checkPermission(req)).not.toBeNull();
  });

  it("allows Technician to read/create assets", () => {
    for (const method of ["GET", "POST"]) {
      const req = mockRequest(method, "/api/assets", {
        "x-user-id": "tech1",
        "x-user-email": "tech@test.com",
        "x-user-role": "Technician",
      });
      expect(checkPermission(req)).toBeNull();
    }
  });

  it("blocks Technician from deleting assets", () => {
    const req = mockRequest("DELETE", "/api/assets/123", {
      "x-user-id": "tech1",
      "x-user-email": "tech@test.com",
      "x-user-role": "Technician",
    });
    expect(checkPermission(req)).not.toBeNull();
  });

  it("allows Auditor to read assets and audit log", () => {
    for (const path of ["/api/assets", "/api/audit-log"]) {
      const req = mockRequest("GET", path, {
        "x-user-id": "aud1",
        "x-user-email": "auditor@test.com",
        "x-user-role": "Auditor",
      });
      expect(checkPermission(req)).toBeNull();
    }
  });

  it("blocks Auditor from creating assets", () => {
    const req = mockRequest("POST", "/api/assets", {
      "x-user-id": "aud1",
      "x-user-email": "auditor@test.com",
      "x-user-role": "Auditor",
    });
    expect(checkPermission(req)).not.toBeNull();
  });

  it("skips RBAC for auth and health routes", () => {
    const req = mockRequest("POST", "/api/auth"); // No user headers
    expect(checkPermission(req)).toBeNull();

    const healthReq = mockRequest("GET", "/api/health");
    expect(checkPermission(healthReq)).toBeNull();
  });

  it("denies unauthenticated requests to protected routes", () => {
    const req = mockRequest("GET", "/api/assets"); // No user headers
    const result = checkPermission(req);
    expect(result).not.toBeNull();
  });
});
