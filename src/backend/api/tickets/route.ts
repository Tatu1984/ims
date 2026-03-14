import { NextRequest, NextResponse } from "next/server";
import * as ticketService from "@/backend/services/ticket.service";
import { createTicketSchema } from "@/backend/validators/ticket.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const result = await ticketService.getAll({
      status: params.get("status") || undefined,
      priority: params.get("priority") || undefined,
      search: params.get("search") || undefined,
    });
    return success(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const ticket = await ticketService.create(parsed.data);
    return success(ticket, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
