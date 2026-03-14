import { prisma } from "@/backend/database/client";
import { Prisma } from "@prisma/client";

export async function findAll(filters?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const where: Prisma.TicketWhereInput = {};

  if (filters?.status) where.status = filters.status as Prisma.EnumTicketStatusFilter;
  if (filters?.priority) where.priority = filters.priority as Prisma.EnumTicketPriorityFilter;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { ticketNumber: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true, initials: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return { data, total };
}

export async function findById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, initials: true } } },
  });
}

export async function create(data: Prisma.TicketCreateInput) {
  return prisma.ticket.create({ data });
}

export async function update(id: string, data: Prisma.TicketUpdateInput) {
  return prisma.ticket.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.ticket.delete({ where: { id } });
}

export async function findMaxTicketNumber() {
  const result = await prisma.ticket.findFirst({
    orderBy: { ticketNumber: "desc" },
    select: { ticketNumber: true },
  });
  return result?.ticketNumber || null;
}
