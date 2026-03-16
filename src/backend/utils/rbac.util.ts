import { NextRequest } from "next/server";
import { error } from "@/backend/utils/api-response.util";
import { logger } from "@/backend/utils/logger.util";

type Role = "Admin" | "Technician" | "Auditor" | "Manager";
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

// Define which roles can access which operations
const PERMISSIONS: Record<string, Role[]> = {
  // Assets
  "GET:/api/assets": ["Admin", "Technician", "Auditor", "Manager"],
  "POST:/api/assets": ["Admin", "Technician"],
  "PATCH:/api/assets/*": ["Admin", "Technician"],
  "DELETE:/api/assets/*": ["Admin"],

  // Software
  "GET:/api/software": ["Admin", "Technician", "Auditor", "Manager"],
  "POST:/api/software": ["Admin", "Technician"],
  "PATCH:/api/software/*": ["Admin", "Technician"],
  "DELETE:/api/software/*": ["Admin"],

  // Licenses
  "GET:/api/licenses": ["Admin", "Technician", "Auditor", "Manager"],
  "POST:/api/licenses": ["Admin", "Manager"],
  "PATCH:/api/licenses/*": ["Admin", "Manager"],
  "DELETE:/api/licenses/*": ["Admin"],

  // Tickets
  "GET:/api/tickets": ["Admin", "Technician", "Auditor", "Manager"],
  "POST:/api/tickets": ["Admin", "Technician", "Manager"],
  "PATCH:/api/tickets/*": ["Admin", "Technician"],
  "DELETE:/api/tickets/*": ["Admin"],

  // Users
  "GET:/api/users": ["Admin", "Manager"],
  "POST:/api/users": ["Admin"],
  "PATCH:/api/users/*": ["Admin"],
  "PUT:/api/users/*": ["Admin"],
  "DELETE:/api/users/*": ["Admin"],

  // Audit Log
  "GET:/api/audit-log": ["Admin", "Auditor"],

  // Reports
  "GET:/api/reports": ["Admin", "Auditor", "Manager"],
  "POST:/api/reports": ["Admin", "Auditor", "Manager"],
  "DELETE:/api/reports/*": ["Admin"],

  // Settings
  "GET:/api/settings": ["Admin"],
  "PATCH:/api/settings": ["Admin"],

  // Dashboard
  "GET:/api/dashboard": ["Admin", "Technician", "Auditor", "Manager"],
};

function matchPermission(method: string, pathname: string): Role[] | null {
  // Try exact match first
  const exactKey = `${method}:${pathname}`;
  if (PERMISSIONS[exactKey]) return PERMISSIONS[exactKey];

  // Try wildcard match (e.g., PATCH:/api/assets/* matches /api/assets/abc123)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 3) {
    const wildcardPath = "/" + segments.slice(0, 2).join("/") + "/*";
    const wildcardKey = `${method}:${wildcardPath}`;
    if (PERMISSIONS[wildcardKey]) return PERMISSIONS[wildcardKey];
  }

  // Try base path for GET on detail routes (e.g., GET:/api/assets for /api/assets/123)
  if (method === "GET" && segments.length >= 3) {
    const basePath = "/" + segments.slice(0, 2).join("/");
    const baseKey = `GET:${basePath}`;
    if (PERMISSIONS[baseKey]) return PERMISSIONS[baseKey];
  }

  return null;
}

export function getUserFromRequest(request: NextRequest): {
  id: string;
  email: string;
  role: Role;
} | null {
  const id = request.headers.get("x-user-id");
  const email = request.headers.get("x-user-email");
  const role = request.headers.get("x-user-role") as Role | null;

  if (!id || !email || !role) return null;
  return { id, email, role };
}

export function checkPermission(
  request: NextRequest
): ReturnType<typeof error> | null {
  const user = getUserFromRequest(request);
  const method = request.method as Method;
  const pathname = request.nextUrl.pathname;

  // Public/auth routes are handled by middleware, skip RBAC
  if (
    pathname === "/api/auth" ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/auth/")
  ) {
    return null;
  }

  if (!user) {
    return error("Authentication required", 401);
  }

  const allowedRoles = matchPermission(method, pathname);

  // If no permission rule defined, deny by default
  if (!allowedRoles) {
    logger.warn("No RBAC rule defined for route", {
      method,
      pathname,
      userId: user.id,
    });
    return error("Forbidden", 403);
  }

  if (!allowedRoles.includes(user.role)) {
    logger.warn("Access denied by RBAC", {
      method,
      pathname,
      userId: user.id,
      userRole: user.role,
      requiredRoles: allowedRoles,
    });
    return error("Insufficient permissions", 403);
  }

  return null; // Allowed
}
