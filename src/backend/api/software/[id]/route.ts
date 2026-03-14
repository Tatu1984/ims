import { NextRequest, NextResponse } from "next/server";
import * as softwareService from "@/backend/services/software.service";
import { updateSoftwareSchema } from "@/backend/validators/software.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sw = await softwareService.getById(id);
    return success(sw);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await softwareService.remove(id);
    return success({ message: "Software deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}
