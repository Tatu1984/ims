import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll(filters?: {
  search?: string;
  category?: string;
}) {
  const where: Prisma.SoftwareWhereInput = {};

  if (filters?.category) where.category = filters.category;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { publisher: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.software.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.software.findUnique({
    where: { id },
    include: { licenses: true },
  });
}

export async function create(data: Prisma.SoftwareCreateInput) {
  return prisma.software.create({ data });
}

export async function update(id: string, data: Prisma.SoftwareUpdateInput) {
  return prisma.software.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.software.delete({ where: { id } });
}
