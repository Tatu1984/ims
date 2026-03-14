import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll() {
  return prisma.license.findMany({
    include: { software: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.license.findUnique({
    where: { id },
    include: { software: { select: { id: true, name: true } } },
  });
}

export async function create(data: Prisma.LicenseCreateInput) {
  return prisma.license.create({ data });
}

export async function update(id: string, data: Prisma.LicenseUpdateInput) {
  return prisma.license.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.license.delete({ where: { id } });
}
