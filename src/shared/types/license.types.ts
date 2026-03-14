export type LicenseType = "Volume" | "PerSeat" | "Subscription" | "OEM";

export interface License {
  id: string;
  softwareId: string;
  softwareName?: string;
  licenseType: LicenseType;
  totalLicenses: number;
  inUse: number;
  available: number;
  compliancePct: number;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const licenseTypeDisplay: Record<LicenseType, string> = {
  Volume: "Volume",
  PerSeat: "Per-seat",
  Subscription: "Subscription",
  OEM: "OEM",
};
