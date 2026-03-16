import { prisma } from "@/backend/database/client";
import * as repo from "@/backend/repositories/asset.repository";
import { AppError } from "@/backend/utils/error-handler.util";
import { appConfig } from "@/config/app.config";
import type { Prisma } from "@prisma/client";

export async function getAll(filters?: Parameters<typeof repo.findAll>[0]) {
  return repo.findAll(filters);
}

export async function getById(id: string) {
  const asset = await repo.findById(id);
  if (!asset) throw new AppError(404, "Asset not found");
  return asset;
}

export async function create(data: {
  name: string;
  type: string;
  serialNumber: string;
  assignedToId?: string;
  assignedToName?: string;
  status?: string;
  department?: string;
  location?: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  warrantyExpiry?: Date;
  notes?: string;
  processor?: string;
  ramSize?: string;
  ramType?: string;
  storageSize?: string;
  storageType?: string;
  gpu?: string;
  displaySize?: string;
  displayRes?: string;
  os?: string;
  macAddress?: string;
  ipAddress?: string;
}) {
  // Use transaction to ensure asset tag generation is atomic
  return prisma.$transaction(async (tx) => {
    const prefix = appConfig.assetTagPrefixes[data.type] ?? "AST";
    const year = new Date().getFullYear();
    const count = await tx.asset.count({
      where: { type: data.type as Prisma.EnumAssetTypeFilter },
    });
    const seq = String(count + 1).padStart(4, "0");
    const assetTag = `${prefix}-${year}-${seq}`;

    return tx.asset.create({
      data: { ...data, assetTag } as Prisma.AssetCreateInput,
    });
  });
}

export async function update(id: string, data: Parameters<typeof repo.update>[1]) {
  await getById(id);
  return repo.update(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.remove(id);
}
