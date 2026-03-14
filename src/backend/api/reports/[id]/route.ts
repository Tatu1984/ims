import { NextRequest } from "next/server";
import * as reportService from "@/backend/services/report.service";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await reportService.getById(id);
    return success(report);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await reportService.remove(id);
    return success({ message: "Report deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}
