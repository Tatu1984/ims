import { prisma } from "@/backend/database/client";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateLastLogin(id: string) {
  return prisma.user.update({
    where: { id },
    data: { lastLogin: new Date() },
  });
}

export async function findAll(filters?: {
  status?: string;
  role?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.role) where.role = filters.role;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { department: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      status: true,
      initials: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function create(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: "Admin" | "Technician" | "Auditor" | "Manager";
  department: string;
  initials: string;
}) {
  return prisma.user.create({ data });
}

export async function update(
  id: string,
  data: {
    name?: string;
    role?: "Admin" | "Technician" | "Auditor" | "Manager";
    department?: string;
    initials?: string;
    status?: "Active" | "Inactive";
  }
) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
