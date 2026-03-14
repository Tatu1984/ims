export type LicenseStatus = "Licensed" | "Unlicensed" | "Trial" | "Unauthorized";

export interface Software {
  id: string;
  name: string;
  publisher: string;
  version: string;
  category: string;
  licenseStatus: LicenseStatus;
  installCount: number;
  createdAt: string;
  updatedAt: string;
}
