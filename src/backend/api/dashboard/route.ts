import { prisma } from "@/backend/database/client";
import { success } from "@/backend/utils/api-response.util";
import { handleApiError } from "@/backend/utils/error-handler.util";

export async function GET() {
  try {
    const [
      totalAssets,
      totalSoftware,
      totalLicenses,
      assetsByType,
      assetsByStatus,
      recentAssets,
      expiringLicenses,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.software.count(),
      prisma.license.count(),
      prisma.asset.groupBy({ by: ["type"], _count: true }),
      prisma.asset.groupBy({ by: ["status"], _count: true }),
      prisma.asset.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.license.findMany({
        where: {
          expiryDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        },
        include: { software: { select: { name: true } } },
        orderBy: { expiryDate: "asc" },
        take: 5,
      }),
    ]);

    return success({
      stats: {
        totalAssets,
        totalSoftware,
        totalLicenses,
      },
      assetsByType: assetsByType.map((g) => ({
        name: g.type,
        value: g._count,
      })),
      assetsByStatus: assetsByStatus.map((g) => ({
        name: g.status,
        value: g._count,
      })),
      recentAssets,
      expiringLicenses: expiringLicenses.map((l) => ({
        software: l.software.name,
        licenses: l.totalLicenses,
        expiry: l.expiryDate?.toISOString(),
        daysLeft: l.expiryDate
          ? Math.ceil(
              (l.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          : null,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
