"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, KeyRound, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

const initialUsers: User[] = [
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

const roleBadgeClass: Record<Role, string> = {
  Admin: "border-red-500/30 bg-red-500/10 text-red-400",
  Technician: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Auditor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Manager: "border-purple-500/30 bg-purple-500/10 text-purple-400",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Technician");
  const [newDepartment, setNewDepartment] = useState("");

  // Edit User dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("Technician");
  const [editDepartment, setEditDepartment] = useState("");

  // Reset Password dialog
  const [resetOpen, setResetOpen] = useState(false);
  const [resetUserName, setResetUserName] = useState("");
  const [resetUserEmail, setResetUserEmail] = useState("");

  // Deactivate dialog
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateEmail, setDeactivateEmail] = useState("");
  const [deactivateUserName, setDeactivateUserName] = useState("");

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const newUser: User = {
      name: newName.trim(),
      initials: getInitials(newName.trim()),
      email: newEmail.trim(),
      role: newRole,
      department: newDepartment.trim() || "General",
      lastLogin: "Never",
      status: "Active",
    };
    setUsers((prev) => [...prev, newUser]);
    setDialogOpen(false);
    setNewName("");
    setNewEmail("");
    setNewRole("Technician");
    setNewDepartment("");
  };

  function handleEditUser(user: User) {
    setEditEmail(user.email);
    setEditName(user.name);
    setEditRole(user.role);
    setEditDepartment(user.department);
    setEditOpen(true);
  }

  function handleSaveEdit() {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email !== editEmail) return u;
        return {
          ...u,
          name: editName.trim() || u.name,
          initials: getInitials(editName.trim() || u.name),
          role: editRole,
          department: editDepartment.trim() || u.department,
        };
      })
    );
    setEditOpen(false);
  }

  function handleResetPassword(user: User) {
    setResetUserName(user.name);
    setResetUserEmail(user.email);
    setResetOpen(true);
  }

  function confirmResetPassword() {
    setResetOpen(false);
  }

  function handleDeactivate(user: User) {
    setDeactivateEmail(user.email);
    setDeactivateUserName(user.name);
    setDeactivateOpen(true);
  }

  function confirmDeactivate() {
    setUsers((prev) =>
      prev.map((u) => (u.email === deactivateEmail ? { ...u, status: "Inactive" as const } : u))
    );
    setDeactivateOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">User Management</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage users and access control
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            }
          />
          <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Add New User</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Create a new user account with role-based access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  placeholder="user@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Role</Label>
                <Select value={newRole} onValueChange={(val) => setNewRole(val as Role)}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Department</Label>
                <Input
                  placeholder="e.g. IT Operations"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </div>
            <DialogFooter className="bg-zinc-900/50 border-zinc-800">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 px-4">Name</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Department</TableHead>
              <TableHead className="text-zinc-400">Last Login</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.email}
                className="border-zinc-800 hover:bg-zinc-800/50"
              >
                <TableCell className="px-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-zinc-100">
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={roleBadgeClass[user.role]}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-300">
                  {user.department}
                </TableCell>
                <TableCell className="text-zinc-400">
                  {user.lastLogin}
                </TableCell>
                <TableCell>
                  {user.status === "Active" ? (
                    <Badge
                      variant="outline"
                      className="border-green-500/30 bg-green-500/10 text-green-400"
                    >
                      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-zinc-600 bg-zinc-800 text-zinc-400"
                    >
                      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-zinc-500 inline-block" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-900 border-zinc-700"
                    >
                      <DropdownMenuItem className="text-zinc-300 gap-2" onClick={() => handleEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300 gap-2" onClick={() => handleResetPassword(user)}>
                        <KeyRound className="h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-700" />
                      <DropdownMenuItem
                        variant="destructive"
                        className="gap-2"
                        onClick={() => handleDeactivate(user)}
                      >
                        <UserX className="h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Edit User</DialogTitle>
            <DialogDescription className="text-zinc-400">Update user information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Full Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Role</Label>
              <Select value={editRole} onValueChange={(val) => setEditRole(val as Role)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Department</Label>
              <Input value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
            </div>
          </div>
          <DialogFooter className="bg-zinc-900/50 border-zinc-800">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Reset Password</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Send a password reset link to <span className="font-medium text-zinc-200">{resetUserName}</span> ({resetUserEmail}).
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            The user will receive an email with instructions to set a new password. Their current password will remain valid until they complete the reset.
          </div>
          <DialogFooter className="bg-zinc-900/50 border-zinc-800">
            <Button variant="outline" onClick={() => setResetOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={confirmResetPassword}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate User Dialog */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Deactivate User</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to deactivate <span className="font-medium text-zinc-200">{deactivateUserName}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            This will revoke the user&apos;s access to the platform. They will no longer be able to log in.
          </div>
          <DialogFooter className="bg-zinc-900/50 border-zinc-800">
            <Button variant="outline" onClick={() => setDeactivateOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button variant="destructive" onClick={confirmDeactivate}>Deactivate User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
