"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import {
  Check,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Eye,
  Building2,
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Hash,
  MapPin,
  Info
} from "lucide-react";
import { toast } from "sonner";

import { organizationService } from "../../../../services/organization.service";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";

import { Organization, OrganizationStatus } from "../../../../types/api/organization";
import { cn } from "../../../../lib/utils/utils";

export default function OrganizationRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<Organization[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationStatus>("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = useCallback(
    async (order: "asc" | "desc" = sortOrder) => {
      try {
        setLoading(true);
        const data = await organizationService.getAllOrganizationRequests(order);
        setRaw(data);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách yêu cầu tổ chức.");
      } finally {
        setLoading(false);
      }
    },
    [sortOrder]
  );

  useEffect(() => {
    fetchData("desc");
  }, [fetchData]);

  const filtered = useMemo(() => {
    let list = [...raw];

    if (status !== "ALL") {
      list = list.filter((r) => r.status === status);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        return (
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          (r.website || "").toLowerCase().includes(q) ||
          (r.representative_name || "").toLowerCase().includes(q) ||
          (r.email || "").toLowerCase().includes(q) ||
          (r.phone_number || "").toLowerCase().includes(q) ||
          (r.activity_field || "").toLowerCase().includes(q)
        );
      });
    }

    list.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return list;
  }, [raw, search, status, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortOrder]);

  const getStatusCfg = (s: string) => {
    switch (s) {
      case "PENDING":
        return {
          label: "Chờ duyệt",
          icon: Clock,
          color: "bg-amber-500 hover:bg-amber-600 text-white",
          light: "bg-amber-50 text-amber-700",
        };
      case "VERIFIED":
        return {
          label: "Đã xác minh",
          icon: CheckCircle2,
          color: "bg-emerald-500 hover:bg-emerald-600 text-white",
          light: "bg-emerald-50 text-emerald-700",
        };
      case "REJECTED":
        return {
          label: "Từ chối",
          icon: XCircle,
          color: "bg-rose-500 hover:bg-rose-600 text-white",
          light: "bg-rose-50 text-rose-700",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          icon: XCircle,
          color: "bg-gray-500 hover:bg-gray-600 text-white",
          light: "bg-gray-50 text-gray-700",
        };
      default:
        return {
          label: s,
          icon: Info,
          color: "bg-slate-500 hover:bg-slate-600 text-white",
          light: "bg-slate-50 text-slate-700",
        };
    }
  };

  const onApprove = async (id: string) => {
    try {
      const updated = await organizationService.approveOrganizationRequest(id);
      setRaw((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Đã phê duyệt yêu cầu thành công!");
    } catch (e) {
      console.error(e);
      toast.error("Phê duyệt thất bại. Vui lòng thử lại!");
    }
  };

  const onReject = async (id: string) => {
    try {
      const updated = await organizationService.rejectOrganizationRequest(id);
      setRaw((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Đã từ chối yêu cầu.");
    } catch (e) {
      console.error(e);
      toast.error("Từ chối thất bại. Vui lòng thử lại!");
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData(sortOrder);
      toast.success("Đã làm mới danh sách.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-20">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Yêu cầu tạo Tổ chức
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Quản lý và phê duyệt các yêu cầu đăng ký tổ chức mới tham gia hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="rounded-xl font-semibold border-gray-200 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm bg-white dark:bg-slate-900"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            Làm mới
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Bộ lọc yêu cầu
            </CardTitle>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group min-w-[300px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Tìm theo tên, email, địa chỉ..."
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50 dark:bg-slate-800/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select
                value={status}
                onValueChange={(v) => setStatus(v as OrganizationStatus)}
              >
                <SelectTrigger className="w-44 h-11 rounded-xl border-gray-200 font-medium bg-gray-50/50 dark:bg-slate-800/50">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                  <SelectItem value="ALL" className="font-medium">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING" className="font-medium">Đang chờ duyệt</SelectItem>
                  <SelectItem value="APPROVED" className="font-medium">Đã phê duyệt</SelectItem>
                  <SelectItem value="REJECTED" className="font-medium">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
              >
                <SelectTrigger className="w-40 h-11 rounded-xl border-gray-200 font-medium bg-gray-50/50 dark:bg-slate-800/50">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="asc" className="font-medium">Cũ nhất trước</SelectItem>
                  <SelectItem value="desc" className="font-medium">Mới nhất trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Tổ chức & Lĩnh vực
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Người đại diện
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-gray-500 font-bold">Đang tải dữ liệu yêu cầu...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Không tìm thấy yêu cầu nào</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem các yêu cầu khác.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((r) => {
                    const cfg = getStatusCfg(r.status);
                    const StatusIcon = cfg.icon;

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-gray-50/80 dark:hover:bg-slate-800/80 transition-all group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
                              {r.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-slate-800 w-fit px-2 py-0.5 rounded-lg border border-gray-100 dark:border-slate-700">
                              <Building2 className="w-3 h-3" />
                              {r.activity_field || "Chưa cập nhật vực"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {r.representative?.avatar_url ? (
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 ring-2 ring-white transition-transform group-hover:scale-110">
                                <Image
                                  src={r.representative.avatar_url}
                                  alt={r.representative_name || "Avatar"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20 transition-transform group-hover:scale-110">
                                {r.representative_name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                {r.representative_name || "Chưa cập nhật"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                              <Mail className="w-3.5 h-3.5 text-primary" />
                              {r.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                              <Phone className="w-3.5 h-3.5 text-indigo-500" />
                              {r.phone_number || "---"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <Badge
                            className={cn(
                              "font-bold py-1.5 px-3 rounded-xl border-none gap-1.5 shadow-sm",
                              cfg.color
                            )}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </Badge>
                        </td>

                        <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(r.created_at).toLocaleDateString("vi-VN")}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all active:scale-90"
                              onClick={() => setSelectedOrg(r)}
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </Button>

                            {r.status === "PENDING" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl transition-all active:scale-90"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-1 rounded-2xl shadow-2xl border-gray-100">
                                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-400 uppercase tracking-widest font-bold">Thao tác nhanh</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer rounded-xl py-2.5 font-bold transition-colors"
                                    onClick={() => onApprove(r.id)}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Phê duyệt ngay
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer rounded-xl py-2.5 font-bold transition-colors"
                                    onClick={() => onReject(r.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Từ chối yêu cầu
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800">
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
              <div className="text-sm font-bold text-gray-500">
                Hiển thị <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)}</span> trên <span className="text-gray-900 dark:text-white">{filtered.length}</span> yêu cầu
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0 rounded-xl border-gray-200 active:scale-90 transition-transform bg-white dark:bg-slate-900"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-1.5 px-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "h-10 w-10 p-0 rounded-xl font-bold transition-all",
                        currentPage === i + 1
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {i + 1}
                    </Button>
                  )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10 p-0 rounded-xl border-gray-200 active:scale-90 transition-transform bg-white dark:bg-slate-900"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrg} onOpenChange={(open) => !open && setSelectedOrg(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />

          <DialogHeader className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  Chi tiết yêu cầu
                </DialogTitle>
                <DialogDescription className="text-base font-medium text-gray-500">
                  Xem lại toàn bộ thông tin đăng ký của tổ chức.
                </DialogDescription>
              </div>
              {selectedOrg && (
                <Badge
                  className={cn(
                    "px-4 py-2 text-sm font-bold border-none rounded-2xl shadow-sm",
                    getStatusCfg(selectedOrg.status).color
                  )}
                >
                  {getStatusCfg(selectedOrg.status).label}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedOrg && (
            <div className="px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Organization Info Card */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Info className="w-4 h-4" />
                    Thông tin cơ bản
                  </div>

                  <div className="bg-gray-50/80 dark:bg-slate-800/50 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 space-y-5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tên tổ chức</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedOrg.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lĩnh vực</p>
                        <p className="font-bold text-indigo-600 text-sm">{selectedOrg.activity_field || "---"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trang web</p>
                        {selectedOrg.website ? (
                          <a
                            href={selectedOrg.website.startsWith("http") ? selectedOrg.website : `https://${selectedOrg.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-bold text-sm"
                          >
                            Truy cập <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <p className="font-bold text-gray-500 text-sm">---</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Địa chỉ trụ sở
                      </p>
                      <p className="font-bold text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selectedOrg.address}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sứ mệnh & Mô tả</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-slate-900/50 p-3 rounded-2xl italic border border-gray-50 dark:border-slate-800">
                        &quot;{selectedOrg.description || "Không có mô tả chi tiết"}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Representative Info Card */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
                    <User className="w-4 h-4" />
                    Người đại diện pháp luật
                  </div>

                  <div className="bg-indigo-50/30 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100/50 dark:border-indigo-900/20 space-y-5">
                    <div className="flex items-center gap-4 border-b border-indigo-100/50 dark:border-indigo-900/20 pb-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-200">
                        {selectedOrg.representative_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Họ và tên</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedOrg.representative_name}</p>
                        <p className="text-xs font-bold text-indigo-600/70">ID: {selectedOrg.representative_identity_number || "---"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm font-bold">
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        {selectedOrg.email}
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </div>
                        {selectedOrg.phone_number || "---"}
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Calendar className="w-4 h-4 text-amber-500" />
                        </div>
                        Ngày tham gia: {new Date(selectedOrg.created_at).toLocaleDateString("vi-VN", { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                  <CreditCard className="w-4 h-4" />
                  Thông tin thanh toán & Ngân hàng
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/20 dark:bg-emerald-900/10 rounded-[32px] p-8 border border-emerald-100/50 dark:border-emerald-900/20 shadow-sm">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Ngân hàng thụ hưởng</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {selectedOrg.bank_name || "---"}
                      {selectedOrg.bank_short_name && <span className="text-emerald-600 ml-1">({selectedOrg.bank_short_name})</span>}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Số tài khoản</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-primary tracking-tighter font-mono">{selectedOrg.bank_account_number || "---"}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-100" title="Sao chép">
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Chủ tài khoản</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{selectedOrg.bank_account_name || "---"}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="px-8 py-6 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setSelectedOrg(null)}
              className="px-8 rounded-2xl font-bold h-12 transition-all active:scale-95 border-gray-200"
            >
              Đóng lại
            </Button>

            {selectedOrg?.status === "PENDING" && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-2xl font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all active:scale-95"
                  onClick={() => {
                    onReject(selectedOrg.id);
                    setSelectedOrg(null);
                  }}
                >
                  <X className="w-5 h-5 mr-2" />
                  Từ chối
                </Button>
                <Button
                  className="h-12 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                  onClick={() => {
                    onApprove(selectedOrg.id);
                    setSelectedOrg(null);
                  }}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Phê duyệt ngay
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
