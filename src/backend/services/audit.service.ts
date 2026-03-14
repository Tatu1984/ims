import * as repo from "@/backend/repositories/audit.repository";

export async function getAll(filters?: Parameters<typeof repo.findAll>[0]) {
  return repo.findAll(filters);
}

export async function create(data: Parameters<typeof repo.create>[0]) {
  return repo.create(data);
}
