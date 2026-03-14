import { NextRequest, NextResponse } from "next/server";
import * as assetService from "@/backend/services/asset.service";
import { createAssetSchema } from "@/backend/validators/asset.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const result = await assetService.getAll({
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      search: params.get("search") || undefined,
      type: params.get("type") || undefined,
      status: params.get("status") || undefined,
    });
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { purchaseDate, warrantyExpiry, ...rest } = parsed.data;
    const asset = await assetService.create({
      ...rest,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
    });
    return success(asset, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
