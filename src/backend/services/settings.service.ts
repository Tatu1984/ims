import * as repo from "@/backend/repositories/settings.repository";

export async function getAll(category?: string) {
  return repo.findAll(category ? { category } : undefined);
}

export async function getByKey(key: string) {
  return repo.findByKey(key);
}

export async function upsert(key: string, value: string, category?: string) {
  return repo.upsert({ key, value, category });
}
