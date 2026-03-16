import { NextRequest, NextResponse } from "next/server";
import * as softwareService from "@/backend/services/software.service";
import { updateSoftwareSchema } from "@/backend/validators/software.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const sw = await softwareService.getById(id);
    return success(sw);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const PATCH = withGuards(async (request: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSoftwareSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const sw = await softwareService.update(id, parsed.data);
    return success(sw);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });

export const DELETE = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    await softwareService.remove(id);
    return success({ message: "Software deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.delete });
