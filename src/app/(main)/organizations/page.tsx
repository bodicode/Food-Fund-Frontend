"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { organizationService } from "@/services/organization.service";
import { Organization, OrganizationRole } from "@/types/api/organization";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { translateRole } from "@/lib/translator";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Users,
  CheckCircle,
  ArrowRight,
  Search,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>("DELIVERY_STAFF");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth guard for login required actions
  const { isLoginDialogOpen, requireAuth, closeLoginDialog } = useAuthGuard();

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getActiveOrganizations();
        setOrganizations(data.organizations);
        setFilteredOrgs(data.organizations);
        setTotal(data.total);
      } catch (err) {
        toast.error("Không thể tải danh sách tổ chức", {
          description:
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi không xác định.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrgs(organizations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query) ||
        org.address.toLowerCase().includes(query) ||
        org.website?.toLowerCase().includes(query)
    );
    setFilteredOrgs(filtered);
  }, [searchQuery, organizations]);

  const handleJoinRequest = (org: Organization) => {
    // Check if user is authenticated before allowing join request
    requireAuth(() => {
      setSelectedOrg(org);
      setSelectedRole("DELIVERY_STAFF");
      setJoinDialogOpen(true);
    });
  };

  const handleSubmitJoinRequest = async () => {
    if (!selectedOrg) return;

    try {
      setIsSubmitting(true);
      const result = await organizationService.requestJoinOrganization({
        organization_id: selectedOrg.id,
        requested_role: selectedRole,
      });

      if (result.success) {
        toast.success("Gửi yêu cầu thành công!", {
          description: result.message || "Vui lòng chờ tổ chức phê duyệt.",
        });
        setJoinDialogOpen(false);
      } else {
        toast.error("Không thể gửi yêu cầu", {
          description: result.message,
        });
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra", {
        description:
          err instanceof Error ? err.message : "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fffaf7] to-[#f9f4f1]">
        <Loader animate loop className="h-8 w-8 text-[#b55631]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fffaf7] to-[#f8f5f3] pt-28 pb-16 overflow-hidden">
      {/* Decorative Floating Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-[#f0e6df] rounded-full blur-3xl opacity-40 top-10 left-[-60px]" />
        <div className="absolute w-80 h-80 bg-[#fbe7dd] rounded-full blur-3xl opacity-40 bottom-10 right-[-80px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-extrabold text-[#b55631] mb-4">
            Các Tổ Chức Từ Thiện
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những tổ chức đang lan tỏa yêu thương và tạo nên sự thay
            đổi tích cực trong cộng đồng.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm font-semibold shadow-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              {total} tổ chức đang hoạt động
            </Badge>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 max-w-2xl mx-auto"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#b55631]" />
            <Input
              type="text"
              placeholder="🔍 Tìm kiếm tổ chức theo tên, mô tả, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base rounded-xl border-2 border-gray-200 focus:border-[#b55631] shadow-md focus:shadow-lg transition-all duration-300"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              Tìm thấy <strong>{filteredOrgs.length}</strong> kết quả
            </p>
          )}
        </motion.div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery
                ? "Không tìm thấy tổ chức nào"
                : "Chưa có tổ chức nào hoạt động"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Thử từ khóa khác xem sao nhé"
                : "Danh sách sẽ được cập nhật khi có tổ chức mới."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrgs.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card
                  onClick={() => router.push(`/organizations/${org.id}`)}
                  className="h-full border-0 shadow-md hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 bg-white group"
                >
                  <CardHeader className="relative bg-gradient-to-r from-[#b6542f] to-[#e37341] text-white py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm shadow-inner flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold truncate">
                          {org.name}
                        </CardTitle>
                        {org.description && (
                          <p className="text-white/80 text-xs mt-1 line-clamp-1">
                            {org.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bo góc mềm phía trên */}
                    <div className="absolute inset-0 rounded-t-2xl overflow-hidden pointer-events-none" />
                  </CardHeader>

                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="line-clamp-2">{org.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{org.phone_number}</span>
                      </div>
                      {org.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a
                            href={
                              org.website.startsWith("http")
                                ? org.website
                                : `https://${org.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#b55631] hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {org.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-600">
                          {org.total_members || 0}
                        </span>
                        <span className="text-gray-600">thành viên</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {org.active_members || 0}
                        </span>
                        <span className="text-gray-600">hoạt động</span>
                      </div>
                    </div>

                    {org.representative && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          Người đại diện
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b6542f] to-[#e37341] text-white flex items-center justify-center text-sm font-bold ring-2 ring-[#fffaf7] shadow-md">
                            {org.representative.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">
                              {org.representative.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{org.representative.user_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinRequest(org);
                        }}
                        variant="outline"
                        className="flex-1 border-2 border-[#b55631] text-[#b55631] hover:bg-[#b55631] hover:text-white font-semibold py-2.5 rounded-xl transition-all"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Yêu cầu tham gia
                      </Button>
                      <Button className="flex-1 bg-[#b55631] hover:bg-[#944322] text-white font-semibold py-2.5 rounded-xl transition-all">
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <p className="text-xs text-gray-400 text-center mt-3">
                      Tham gia: {formatDate(org.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Join Request Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#b55631] flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Yêu cầu tham gia tổ chức
            </DialogTitle>
            <DialogDescription className="text-base">
              Gửi yêu cầu tham gia{" "}
              <span className="font-semibold text-gray-800">
                {selectedOrg?.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vai trò bạn muốn đảm nhận <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as OrganizationRole)
                }
              >
                <SelectTrigger className="w-full border-2 focus:border-[#b55631]">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELIVERY_STAFF">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole("DELIVERY_STAFF")}
                      </span>
                      <span className="text-xs text-gray-500">
                        - Giao hàng, vận chuyển
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="KITCHEN_STAFF">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole("KITCHEN_STAFF")}
                      </span>
                      <span className="text-xs text-gray-500">
                        - Nhân viên bếp
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Chọn vai trò phù hợp với khả năng và thời gian của bạn
              </p>
            </div>

            {selectedOrg && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Thông tin tổ chức:
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Tên:</span>{" "}
                    {selectedOrg.name}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {selectedOrg.address}
                  </p>
                  <p>
                    <span className="font-medium">Số thành viên:</span>{" "}
                    {selectedOrg.total_members || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setJoinDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmitJoinRequest}
              disabled={isSubmitting}
              className="bg-[#b55631] hover:bg-[#944322] text-white"
            >
              {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={closeLoginDialog}
        title="Đăng nhập để tham gia tổ chức"
        description="Bạn cần đăng nhập để có thể gửi yêu cầu tham gia tổ chức. Vui lòng đăng nhập để tiếp tục."
        actionText="Đăng nhập ngay"
      />
    </div>
  );
}
