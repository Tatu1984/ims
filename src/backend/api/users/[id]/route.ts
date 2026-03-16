import { NextRequest, NextResponse } from "next/server";
import * as userService from "@/backend/services/user.service";
import { updateUserSchema, resetPasswordSchema } from "@/backend/validators/user.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const user = await userService.getById(id);
    return success(user);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const PATCH = withGuards(async (request: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const user = await userService.update(id, parsed.data);
    return success(user);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });

// PUT = Reset Password (Admin only)
export const PUT = withGuards(async (request: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    await userService.resetPassword(id, parsed.data.newPassword);
    return success({ message: "Password reset successfully" });
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });

export const DELETE = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    await userService.remove(id);
    return success({ message: "User deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.delete });
