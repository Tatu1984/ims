import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const where: Prisma.AssetWhereInput = {};

  if (filters?.type) where.type = filters.type as Prisma.EnumAssetTypeFilter;
  if (filters?.status) where.status = filters.status as Prisma.EnumAssetStatusFilter;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { assetTag: { contains: filters.search, mode: "insensitive" } },
      { serialNumber: { contains: filters.search, mode: "insensitive" } },
      { assignedToName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true, initials: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ]);

  return { data, total };
}

export async function findById(id: string) {
  return prisma.asset.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, initials: true } } },
  });
}

export async function create(data: Prisma.AssetCreateInput) {
  return prisma.asset.create({ data });
}

export async function update(id: string, data: Prisma.AssetUpdateInput) {
  return prisma.asset.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.asset.delete({ where: { id } });
}

export async function countByType(type: string) {
  return prisma.asset.count({ where: { type: type as Prisma.EnumAssetTypeFilter } });
}
