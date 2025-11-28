"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { organizationService } from "@/services/organization.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Organization, OrganizationStatus } from "@/types/api/organization";
import { statusConfig } from "@/lib/translator";
import { cn } from "@/lib/utils/utils";

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
  const itemsPerPage = 10;

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
    const cfg = statusConfig[s as keyof typeof statusConfig];
    return (
      cfg ?? {
        label: s,
        icon: Clock,
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        variant: "secondary" as const,
      }
    );
  };

  const onApprove = async (id: string) => {
    try {
      const updated = await organizationService.approveOrganizationRequest(id);
      setRaw((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Đã phê duyệt yêu cầu.");
      if (selectedOrg?.id === id) {
        setSelectedOrg(updated);
      }
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
      if (selectedOrg?.id === id) {
        setSelectedOrg(updated);
      }
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
    <div className="w-full">
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yêu cầu tạo Tổ chức
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, địa chỉ..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrganizationStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Đang chờ</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(v) => {
              const order = v as "asc" | "desc";
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Cũ → Mới</SelectItem>
              <SelectItem value="desc">Mới → Cũ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", refreshing && "animate-spin")}
            />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Tổ chức
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Người đại diện
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Liên hệ
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy yêu cầu nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedData.map((r) => {
                  const cfg = getStatusCfg(r.status);
                  const StatusIcon = cfg.icon;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {r.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {r.activity_field || "Chưa cập nhật lĩnh vực"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.representative?.avatar_url ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                              <Image
                                src={r.representative.avatar_url}
                                alt={r.representative_name || "Avatar"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs shrink-0">
                              {r.representative_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            {r.representative_name || "Chưa cập nhật"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Mail className="w-3.5 h-3.5" />
                            {r.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Phone className="w-3.5 h-3.5" />
                            {r.phone_number || "---"}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-medium border-0",
                            cfg.color
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                        {new Date(r.created_at).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedOrg(r)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {r.status === "PENDING" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-green-600 focus:text-green-700 cursor-pointer"
                                  onClick={() => onApprove(r.id)}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Phê duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-700 cursor-pointer"
                                  onClick={() => onReject(r.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Từ chối
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
      </div>

      {/* Pagination Controls */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Hiển thị {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filtered.length)} trên tổng số {filtered.length} yêu cầu
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="min-w-[3rem] text-center">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrg} onOpenChange={(open) => !open && setSelectedOrg(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Chi tiết yêu cầu tổ chức
            </DialogTitle>
          </DialogHeader>

          {selectedOrg && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="flex items-start justify-between bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {selectedOrg.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Ngày tạo: {new Date(selectedOrg.created_at).toLocaleDateString("vi-VN", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <Badge
                  className={cn(
                    "px-3 py-1 text-sm border-0",
                    getStatusCfg(selectedOrg.status).color
                  )}
                >
                  {getStatusCfg(selectedOrg.status).label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold border-b pb-2">
                    <Building2 className="w-4 h-4" />
                    Thông tin tổ chức
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Lĩnh vực:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.activity_field || "---"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Website:</span>
                      <span className="col-span-2">
                        {selectedOrg.website ? (
                          <a
                            href={selectedOrg.website.startsWith("http") ? selectedOrg.website : `https://${selectedOrg.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {selectedOrg.website} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : "---"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Mô tả:</span>
                      <span className="col-span-2 text-gray-700 dark:text-gray-300">
                        {selectedOrg.description || "Không có mô tả"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Representative Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold border-b pb-2">
                    <User className="w-4 h-4" />
                    Người đại diện
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Họ tên:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.representative_name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">CMND/CCCD:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.representative_identity_number || "---"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="col-span-2 font-medium">{selectedOrg.phone_number || "---"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Bank Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold border-b pb-2">
                  <CreditCard className="w-4 h-4" />
                  Thông tin ngân hàng
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Ngân hàng</span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrg.bank_name || "---"}
                      {selectedOrg.bank_short_name && ` (${selectedOrg.bank_short_name})`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Số tài khoản</span>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white text-lg">
                      {selectedOrg.bank_account_number || "---"}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Chủ tài khoản</span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrg.bank_account_name || "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedOrg(null)}>
              Đóng
            </Button>
            {selectedOrg?.status === "PENDING" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onReject(selectedOrg.id);
                    setSelectedOrg(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    onApprove(selectedOrg.id);
                    setSelectedOrg(null);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Phê duyệt
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
