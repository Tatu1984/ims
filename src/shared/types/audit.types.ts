export type AuditAction = "Create" | "Update" | "Delete" | "Login" | "Export";

export interface AuditEntry {
  id: string;
  userId: string;
  userName?: string;
  userInitials?: string;
  action: AuditAction;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}
