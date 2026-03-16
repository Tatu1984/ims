import { NextRequest } from "next/server";
import * as reportService from "@/backend/services/report.service";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async () => {
  try {
    const result = await reportService.getAll();
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const POST = withGuards(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const report = await reportService.create(body);
    return success(report, 201);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });
