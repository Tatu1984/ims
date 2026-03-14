import { NextRequest, NextResponse } from "next/server";
import * as ticketService from "@/backend/services/ticket.service";
import { updateTicketSchema } from "@/backend/validators/ticket.validator";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ticket = await ticketService.getById(id);
    return success(ticket);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await ticketService.remove(id);
    return success({ message: "Ticket deleted" });
  } catch (err) {
    return handleApiError(err);
  }
}
