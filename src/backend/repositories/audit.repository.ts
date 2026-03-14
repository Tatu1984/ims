import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll(filters?: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const where: Prisma.AuditLogWhereInput = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.action) where.action = filters.action as Prisma.EnumAuditActionFilter;
  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters?.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters?.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, initials: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total };
}

export async function create(data: Prisma.AuditLogCreateInput) {
  return prisma.auditLog.create({ data });
}
