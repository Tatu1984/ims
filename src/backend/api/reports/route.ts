import { NextRequest } from "next/server";
import * as reportService from "@/backend/services/report.service";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET() {
  try {
    const result = await reportService.getAll();
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const report = await reportService.create(body);
    return success(report, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
