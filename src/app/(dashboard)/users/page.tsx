"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";

type Role = "Admin" | "Technician" | "Auditor" | "Manager";

interface User {
  name: string;
  initials: string;
  email: string;
  role: Role;
  department: string;
  lastLogin: string;
  status: "Active" | "Inactive";
}

const users: User[] = [
  {
    name: "John Smith",
    initials: "JS",
    email: "john.smith@company.com",
    role: "Admin",
    department: "IT Operations",
    lastLogin: "2026-03-14 11:42",
    status: "Active",
  },
  {
    name: "Sarah Kim",
    initials: "SK",
    email: "sarah.kim@company.com",
    role: "Technician",
    department: "Help Desk",
    lastLogin: "2026-03-14 10:15",
    status: "Active",
  },
  {
    name: "Mike Chen",
    initials: "MC",
    email: "mike.chen@company.com",
    role: "Technician",
    department: "Infrastructure",
    lastLogin: "2026-03-14 09:30",
    status: "Active",
  },
  {
    name: "Emily Davis",
    initials: "ED",
    email: "emily.davis@company.com",
    role: "Auditor",
    department: "Compliance",
    lastLogin: "2026-03-13 16:20",
    status: "Active",
  },
  {
    name: "James Liu",
    initials: "JL",
    email: "james.liu@company.com",
    role: "Manager",
    department: "IT Operations",
    lastLogin: "2026-03-14 08:00",
    status: "Active",
  },
  {
    name: "Rachel Torres",
    initials: "RT",
    email: "rachel.torres@company.com",
    role: "Technician",
    department: "Help Desk",
    lastLogin: "2026-02-28 14:10",
    status: "Inactive",
  },
];

const roleBadge: Record<Role, string> = {
  Admin: "border-red-200 bg-red-50 text-red-700",
  Technician: "border-blue-200 bg-blue-50 text-blue-700",
  Auditor: "border-amber-200 bg-amber-50 text-amber-700",
  Manager: "border-purple-200 bg-purple-50 text-purple-700",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users and access control
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                        {user.initials}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadge[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">
                    {user.department}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-3.5">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
