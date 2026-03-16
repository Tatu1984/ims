import { NextRequest } from "next/server";
import * as auditService from "@/backend/services/audit.service";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (request: NextRequest) => {
  try {
    const params = request.nextUrl.searchParams;
    const result = await auditService.getAll({
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      userId: params.get("userId") || undefined,
      action: params.get("action") || undefined,
      dateFrom: params.get("dateFrom") ? new Date(params.get("dateFrom")!) : undefined,
      dateTo: params.get("dateTo") ? new Date(params.get("dateTo")!) : undefined,
    });
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });
