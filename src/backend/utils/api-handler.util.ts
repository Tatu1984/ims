import { NextRequest, NextResponse } from "next/server";
import { checkPermission, getUserFromRequest } from "@/backend/utils/rbac.util";
import { checkRateLimit } from "@/backend/utils/rate-limit.util";
import { logger } from "@/backend/utils/logger.util";

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

interface HandlerOptions {
  rateLimit?: { limit: number; windowMs: number };
  skipRbac?: boolean;
}

/**
 * Wraps an API route handler with RBAC, rate limiting, and logging.
 */
export function withGuards(
  handler: RouteHandler,
  options?: HandlerOptions
): RouteHandler {
  return async (request, context) => {
    const start = Date.now();
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Rate limiting
    if (options?.rateLimit) {
      const user = getUserFromRequest(request);
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const key = `api:${user?.id || ip}:${method}:${pathname.split("/").slice(0, 3).join("/")}`;
      const { allowed } = checkRateLimit(
        key,
        options.rateLimit.limit,
        options.rateLimit.windowMs
      );
      if (!allowed) {
        logger.warn("Rate limit exceeded", { method, pathname, key });
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // RBAC check
    if (!options?.skipRbac) {
      const denied = checkPermission(request);
      if (denied) return denied;
    }

    // Execute handler
    const response = await handler(request, context);

    // Log request
    const duration = Date.now() - start;
    const user = getUserFromRequest(request);
    logger.info(`${method} ${pathname}`, {
      status: response.status,
      duration: `${duration}ms`,
      userId: user?.id,
    });

    return response;
  };
}

// Default rate limits per operation type
export const RATE_LIMITS = {
  read: { limit: 100, windowMs: 60 * 1000 },    // 100 reads/min
  write: { limit: 30, windowMs: 60 * 1000 },     // 30 writes/min
  delete: { limit: 10, windowMs: 60 * 1000 },    // 10 deletes/min
};
