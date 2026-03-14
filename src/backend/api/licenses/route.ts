import { NextRequest, NextResponse } from "next/server";
import * as licenseService from "@/backend/services/license.service";
import { createLicenseSchema } from "@/backend/validators/license.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET() {
  try {
    const result = await licenseService.getAll();
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { expiryDate, ...rest } = parsed.data;
    const license = await licenseService.create({
      ...rest,
      software: { connect: { id: rest.softwareId } },
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    } as Parameters<typeof licenseService.create>[0]);
    return success(license, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
