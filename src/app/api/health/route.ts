import { NextResponse } from "next/server";
import { prisma } from "@/backend/database/client";

export async function GET() {
  let dbOk = false;
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    status: dbOk ? "ok" : "degraded",
    db: dbOk,
    timestamp: new Date().toISOString(),
  });
}
