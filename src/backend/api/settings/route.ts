import { NextRequest, NextResponse } from "next/server";
import * as settingsService from "@/backend/services/settings.service";
import { updateSettingSchema } from "@/backend/validators/settings.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (request: NextRequest) => {
  try {
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const result = await settingsService.getAll(category);
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const PATCH = withGuards(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = updateSettingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { key, value, category } = parsed.data;
    const setting = await settingsService.upsert(key, value, category);
    return success(setting);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });
