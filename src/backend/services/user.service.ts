import * as repo from "@/backend/repositories/user.repository";
import { hashPassword } from "@/backend/utils/hash.util";
import { AppError } from "@/backend/utils/error-handler.util";

export async function getAll(filters?: Parameters<typeof repo.findAll>[0]) {
  return repo.findAll(filters);
}

export async function getById(id: string) {
  const user = await repo.findById(id);
  if (!user) throw new AppError(404, "User not found");
  return user;
}

export async function create(data: {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Technician" | "Auditor" | "Manager";
  department: string;
}) {
  const passwordHash = await hashPassword(data.password);
  const initials = data.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const { password: _, ...rest } = data;
  return repo.create({ ...rest, passwordHash, initials });
}

export async function update(id: string, data: Parameters<typeof repo.update>[1]) {
  await getById(id);
  return repo.update(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteUser(id);
}

export async function resetPassword(id: string, newPassword: string) {
  await getById(id);
  const passwordHash = await hashPassword(newPassword);
  return repo.update(id, { passwordHash } as Parameters<typeof repo.update>[1]);
}
