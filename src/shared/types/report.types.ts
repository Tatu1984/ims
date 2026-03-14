export type ReportStatus = "Ready" | "Generating";

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedById: string;
  generatedByName?: string;
  status: ReportStatus;
  fileSize: string | null;
  filePath: string | null;
  createdAt: string;
}
