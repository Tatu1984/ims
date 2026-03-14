import { NextRequest, NextResponse } from "next/server";
import * as userService from "@/backend/services/user.service";
import { createUserSchema } from "@/backend/validators/user.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const result = await userService.getAll({
      status: params.get("status") || undefined,
      role: params.get("role") || undefined,
      search: params.get("search") || undefined,
    });
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const user = await userService.create(parsed.data);
    return success(user, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
