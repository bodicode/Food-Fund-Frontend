"use client";

import React, { useEffect, useState, useMemo } from "react";
import { translateRole } from "../../../../lib/translator";
import { userService } from "../../../../services/user.service";
import { UserProfile } from "../../../../types/api/user";
import EditUserModal from "../../../../components/admin/EditUserModal";
import {
  Edit,
  RefreshCw,
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Filter
} from "lucide-react";
import { USER_ROLES, ROLE_TRANSLATIONS } from "../../../../constants";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(100, 0); // Increased limit for better management
      setUsers(data);
    } catch {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    try {
      const updatedStatus = !user.is_active;
      const result = await userService.updateUserAccount(user.id, {
        is_active: updatedStatus,
      });

      if (result) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: updatedStatus } : u))
        );
        toast.success(`${updatedStatus ? "Kích hoạt" : "Khóa"} tài khoản thành công`);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (user.full_name || "").toLowerCase().includes(q) ||
        (user.email || "").toLowerCase().includes(q) ||
        (user.user_name || "").toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? user.is_active : !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 border-none text-white">
            <ShieldCheck className="w-3 h-3 mr-1" /> {translateRole(role)}
          </Badge>
        );
      case USER_ROLES.DONOR:
        return (
          <Badge className="bg-sky-500 hover:bg-sky-600 border-none text-white">
            {translateRole(role)}
          </Badge>
        );
      case USER_ROLES.FUNDRAISER:
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 border-none text-white">
            {translateRole(role)}
          </Badge>
        );
      case USER_ROLES.KITCHEN:
      case USER_ROLES.KITCHEN_STAFF:
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white">
            {translateRole(role)}
          </Badge>
        );
      case USER_ROLES.DELIVERY:
      case USER_ROLES.DELIVERY_STAFF:
        return (
          <Badge className="bg-indigo-500 hover:bg-indigo-600 border-none text-white">
            {translateRole(role)}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{translateRole(role)}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Theo dõi, quản lý và phân quyền cho người dùng trên hệ thống của bạn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-xl shadow-sm transition-all hover:shadow-md"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium rounded-xl border-none">
            <Users className="w-4 h-4 mr-2" />
            {filteredUsers.length} người dùng
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Bộ lọc nâng cao
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Tìm tên, email, username..."
                className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11 rounded-xl bg-gray-50 dark:bg-slate-800 border-none transition-all focus:ring-2 focus:ring-primary/20 font-medium">
                <SelectValue placeholder="Tất cả vai trò" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                {Object.entries(ROLE_TRANSLATIONS).map(([role, label]) => (
                  <SelectItem key={role} value={role}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-xl bg-gray-50 dark:bg-slate-800 border-none transition-all focus:ring-2 focus:ring-primary/20 font-medium">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Bị khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                  <TableHead className="font-bold py-4">Người dùng</TableHead>
                  <TableHead className="font-bold py-4">Liên hệ</TableHead>
                  <TableHead className="font-bold py-4">Vai trò</TableHead>
                  <TableHead className="font-bold py-4">Ngày tạo</TableHead>
                  <TableHead className="font-bold py-4">Trạng thái</TableHead>
                  <TableHead className="text-right font-bold py-4">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></div></TableCell>
                      <TableCell><div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-24" /></div></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center italic text-muted-foreground">
                      Không tìm thấy người dùng nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors border-gray-100 dark:border-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 shadow-sm ring-2 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                              {user.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              @{user.user_name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-3.5 h-3.5 mr-2 text-primary/60" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                            <Phone className="w-3.5 h-3.5 mr-2 text-primary/60" />
                            {user.phone_number || "Không có số"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-primary/60" />
                          {new Date(user.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Hoạt động
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Đã khóa
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl overflow-hidden shadow-lg border-gray-200 dark:border-slate-800 p-1">
                            <DropdownMenuItem
                              className="py-2.5 flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary rounded-lg transition-colors"
                              onClick={() => {
                                setEditingUser(user);
                                setIsModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                              <span className="font-medium">Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={`py-2.5 flex items-center gap-2 cursor-pointer rounded-lg transition-colors ${user.is_active
                                ? "text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/20"
                                : "text-emerald-600 dark:text-emerald-400 focus:bg-emerald-50 dark:focus:bg-emerald-950/20"
                                }`}
                              onClick={() => handleToggleStatus(user)}
                            >
                              {user.is_active ? (
                                <><XCircle className="w-4 h-4" /> <span className="font-medium">Khóa tài khoản</span></>
                              ) : (
                                <><CheckCircle2 className="w-4 h-4" /> <span className="font-medium">Kích hoạt lại</span></>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSuccess={(updatedUser: UserProfile) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            // Optionally refresh to ensure data sync
            // fetchUsers(); 
          }}
        />
      )}
    </div>
  );
}
