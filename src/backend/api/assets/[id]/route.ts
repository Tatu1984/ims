import { NextRequest, NextResponse } from "next/server";
import * as assetService from "@/backend/services/asset.service";
import { updateAssetSchema } from "@/backend/validators/asset.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const asset = await assetService.getById(id);
    return success(asset);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const PATCH = withGuards(async (request: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const asset = await assetService.update(id, parsed.data);
    return success(asset);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });

export const DELETE = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    await assetService.remove(id);
    return success({ message: "Asset deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.delete });
