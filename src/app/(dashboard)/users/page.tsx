"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, KeyRound, UserX, Loader2, AlertCircle } from "lucide-react";
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
import { useApi } from "@/frontend/hooks/use-api";
import {
  getUsers,
  createUser,
  updateUser,
  resetUserPassword,
} from "@/frontend/api/endpoints/users.api";

type Role = "Admin" | "Technician" | "Auditor" | "Manager";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "Active" | "Inactive";
  initials: string;
  lastLogin: string | null;
  createdAt: string;
}

const roleBadgeClass: Record<Role, string> = {
  Admin: "border-red-500/30 bg-red-500/10 text-red-400",
  Technician: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Auditor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Manager: "border-purple-500/30 bg-purple-500/10 text-purple-400",
};

function formatLastLogin(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UsersPage() {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useApi<ApiUser[]>(() => getUsers());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Technician");
  const [newDepartment, setNewDepartment] = useState("");

  // Edit User dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("Technician");
  const [editDepartment, setEditDepartment] = useState("");

  // Reset Password dialog
  const [resetOpen, setResetOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState("");
  const [resetUserName, setResetUserName] = useState("");
  const [resetUserEmail, setResetUserEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Deactivate dialog
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateUserId, setDeactivateUserId] = useState("");
  const [deactivateUserName, setDeactivateUserName] = useState("");

  const handleAddUser = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setSubmitting(true);
    try {
      await createUser({
        name: newName.trim(),
        email: newEmail.trim(),
        password: "TempPass123!",
        role: newRole,
        department: newDepartment.trim() || "General",
      });
      setDialogOpen(false);
      setNewName("");
      setNewEmail("");
      setNewRole("Technician");
      setNewDepartment("");
      await refetch();
    } catch {
      // error will show on refetch
    } finally {
      setSubmitting(false);
    }
  };

  function handleEditUser(user: ApiUser) {
    setEditUserId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setEditDepartment(user.department);
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    setSubmitting(true);
    try {
      await updateUser(editUserId, {
        name: editName.trim() || undefined,
        role: editRole,
        department: editDepartment.trim() || undefined,
      });
      setEditOpen(false);
      await refetch();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetPassword(user: ApiUser) {
    setResetUserId(user.id);
    setResetUserName(user.name);
    setResetUserEmail(user.email);
    setResetNewPassword("");
    setResetSuccess(false);
    setResetOpen(true);
  }

  async function confirmResetPassword() {
    if (!resetNewPassword.trim() || resetNewPassword.length < 6) return;
    setSubmitting(true);
    try {
      await resetUserPassword(resetUserId, resetNewPassword);
      setResetSuccess(true);
    } catch {
      // error
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeactivate(user: ApiUser) {
    setDeactivateUserId(user.id);
    setDeactivateUserName(user.name);
    setDeactivateOpen(true);
  }

  async function confirmDeactivate() {
    setSubmitting(true);
    try {
      await updateUser(deactivateUserId, { status: "Inactive" });
      setDeactivateOpen(false);
      await refetch();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="outline" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
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
              <Button onClick={handleAddUser} disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>
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
            {(users ?? []).map((user) => (
              <TableRow
                key={user.id}
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
                  {formatLastLogin(user.lastLogin)}
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
            <Button onClick={handleSaveEdit} disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Reset Password</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Set a new password for <span className="font-medium text-zinc-200">{resetUserName}</span> ({resetUserEmail}).
            </DialogDescription>
          </DialogHeader>
          {resetSuccess ? (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              Password has been reset successfully. Please share the new password with the user securely.
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">New Password</Label>
                <Input
                  type="text"
                  placeholder="Minimum 6 characters"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
                This will immediately change the user&apos;s password. Their current password will stop working.
              </div>
            </div>
          )}
          <DialogFooter className="bg-zinc-900/50 border-zinc-800">
            <Button variant="outline" onClick={() => setResetOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              {resetSuccess ? "Close" : "Cancel"}
            </Button>
            {!resetSuccess && (
              <Button onClick={confirmResetPassword} disabled={submitting || resetNewPassword.length < 6}>
                {submitting ? "Resetting..." : "Reset Password"}
              </Button>
            )}
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
            <Button variant="destructive" onClick={confirmDeactivate} disabled={submitting}>
              {submitting ? "Deactivating..." : "Deactivate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
