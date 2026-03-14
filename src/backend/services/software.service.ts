import * as repo from "@/backend/repositories/software.repository";
import { AppError } from "@/backend/utils/error-handler.util";

export async function getAll(filters?: Parameters<typeof repo.findAll>[0]) {
  return repo.findAll(filters);
}

export async function getById(id: string) {
  const record = await repo.findById(id);
  if (!record) throw new AppError(404, "Software not found");
  return record;
}

export async function create(data: Parameters<typeof repo.create>[0]) {
  return repo.create(data);
}

export async function update(id: string, data: Parameters<typeof repo.update>[1]) {
  await getById(id);
  return repo.update(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.remove(id);
}
