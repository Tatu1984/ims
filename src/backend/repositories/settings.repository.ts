import { prisma } from "@/backend/database/client";

export async function findAll(filters?: { category?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.category) where.category = filters.category;

  return prisma.setting.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export async function findByKey(key: string) {
  return prisma.setting.findUnique({ where: { key } });
}

export async function upsert(data: { key: string; value: string; category?: string }) {
  return prisma.setting.upsert({
    where: { key: data.key },
    update: { value: data.value, ...(data.category && { category: data.category }) },
    create: { key: data.key, value: data.value, category: data.category ?? "general" },
  });
}
