import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll() {
  return prisma.report.findMany({
    include: { generatedBy: { select: { id: true, name: true, initials: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { generatedBy: { select: { id: true, name: true, initials: true } } },
  });
}

export async function create(data: Prisma.ReportCreateInput) {
  return prisma.report.create({ data });
}

export async function update(id: string, data: Prisma.ReportUpdateInput) {
  return prisma.report.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.report.delete({ where: { id } });
}
