import { NextRequest, NextResponse } from "next/server";
import { login, refreshSession } from "@/backend/services/auth.service";
import { loginSchema } from "@/backend/validators/auth.validator";
import { verifyToken, verifyRefreshToken } from "@/backend/utils/jwt.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { checkRateLimit } from "@/backend/utils/rate-limit.util";
import { success, error } from "@/backend/utils/api-response.util";
import { appConfig } from "@/config/app.config";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

function setAuthCookies(
  response: NextResponse,
  token: string,
  refreshToken: string
) {
  response.cookies.set(appConfig.auth.cookieName, token, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60, // 1 hour
  });
  response.cookies.set(appConfig.auth.refreshCookieName, refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(appConfig.auth.cookieName, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
  });
  response.cookies.set(appConfig.auth.refreshCookieName, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!allowed) {
      return error("Too many login attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: fieldErrors },
        { status: 400 }
      );
    }

    const result = await login(parsed.data.email, parsed.data.password);

    const response = success(result, 200);
    setAuthCookies(response, result.token, result.refreshToken);

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(appConfig.auth.cookieName)?.value;
    if (!token) {
      return error("Not authenticated", 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return error("Invalid or expired token", 401);
    }

    return success({
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = checkRateLimit(`refresh:${ip}`, 30, 15 * 60 * 1000);
    if (!allowed) {
      return error("Too many refresh attempts.", 429);
    }

    const refreshCookie = request.cookies.get(appConfig.auth.refreshCookieName)?.value;
    if (!refreshCookie) {
      return error("No refresh token", 401);
    }

    const payload = await verifyRefreshToken(refreshCookie);
    if (!payload) {
      return error("Invalid refresh token", 401);
    }

    const result = await refreshSession(payload.id);

    const response = success({ user: result.user });
    setAuthCookies(response, result.token, result.refreshToken);

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE() {
  const response = success({ message: "Logged out" });
  clearAuthCookies(response);
  return response;
}
