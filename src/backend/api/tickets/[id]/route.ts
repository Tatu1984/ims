import { NextRequest, NextResponse } from "next/server";
import * as ticketService from "@/backend/services/ticket.service";
import { updateTicketSchema } from "@/backend/validators/ticket.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";
import { withGuards, RATE_LIMITS } from "@/backend/utils/api-handler.util";

export const GET = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const ticket = await ticketService.getById(id);
    return success(ticket);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.read });

export const PATCH = withGuards(async (request: NextRequest, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const ticket = await ticketService.update(id, parsed.data);
    return success(ticket);
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.write });

export const DELETE = withGuards(async (_: NextRequest, { params }) => {
  try {
    const { id } = await params;
    await ticketService.remove(id);
    return success({ message: "Ticket deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}, { rateLimit: RATE_LIMITS.delete });
