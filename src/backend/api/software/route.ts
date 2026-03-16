import { NextRequest, NextResponse } from "next/server";
import * as softwareService from "@/backend/services/software.service";
import { createSoftwareSchema } from "@/backend/validators/software.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (request: NextRequest) => {
  try {
    const params = request.nextUrl.searchParams;
    const result = await softwareService.getAll({
      search: params.get("search") || undefined,
      category: params.get("category") || undefined,
    });
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const POST = withGuards(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = createSoftwareSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const sw = await softwareService.create(parsed.data);
    return success(sw, 201);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });
