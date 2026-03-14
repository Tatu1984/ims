export type AssetType = "desktop" | "laptop" | "server" | "printer" | "peripheral";
export type AssetStatus = "Active" | "InStorage" | "Maintenance" | "Retired";

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  assignedToId: string | null;
  assignedToName: string;
  status: AssetStatus;
  department: string;
  location: string | null;
  purchaseDate: string | null;
  purchaseCost: number | null;
  warrantyExpiry: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const assetTypeLabels: Record<AssetType, string> = {
  desktop: "Desktop",
  laptop: "Laptop",
  server: "Server",
  printer: "Printer",
  peripheral: "Peripheral",
};

export const assetStatusDisplay: Record<AssetStatus, string> = {
  Active: "Active",
  InStorage: "In Storage",
  Maintenance: "Maintenance",
  Retired: "Retired",
};
