export type UserRole = "Admin" | "Technician" | "Auditor" | "Manager";
export type UserStatus = "Active" | "Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  initials: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}
