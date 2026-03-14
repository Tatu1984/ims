import { NextRequest, NextResponse } from "next/server";
import * as licenseService from "@/backend/services/license.service";
import { updateLicenseSchema } from "@/backend/validators/license.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const license = await licenseService.getById(id);
    return success(license);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const license = await licenseService.update(id, parsed.data);
    return success(license);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await licenseService.remove(id);
    return success({ message: "License deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}
