import { NextResponse } from "next/server";
import { logger } from "@/backend/utils/logger.util";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error("Application error", {
        statusCode: error.statusCode,
        message: error.message,
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.errors && { errors: error.errors }),
      },
      { status: error.statusCode }
    );
  }

  logger.error("Unhandled error", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  return NextResponse.json(
    { success: false, error: "An unexpected error occurred" },
    { status: 500 }
  );
}
