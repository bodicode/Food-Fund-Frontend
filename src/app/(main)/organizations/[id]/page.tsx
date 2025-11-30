"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { LoginRequiredDialog } from "@/components/shared/login-required-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { organizationService } from "@/services/organization.service";
import { campaignService } from "@/services/campaign.service";
import { Organization, OrganizationRole } from "@/types/api/organization";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { translateRole } from "@/lib/translator";
import { USER_ROLES } from "@/constants";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Users,
  CheckCircle,
  ArrowLeft,
  UserPlus,
  Mail,
  Calendar as CalendarIcon,
  LayoutGrid,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignCard } from "@/components/shared/campaign-card";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>(
    USER_ROLES.DELIVERY_STAFF
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoginDialogOpen, requireAuth, closeLoginDialog, currentUser } = useAuthGuard();

  useEffect(() => {
    (async () => {
      try {
        // First, fetch all organizations to find the ID by slug
        const { organizations } = await organizationService.getActiveOrganizations();

        // Find organization by matching slug
        const found = organizations.find((org) => {
          const orgSlug = org.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

          return orgSlug === slug;
        });

        if (!found) {
          throw new Error("Không tìm thấy tổ chức");
        }

        // Then fetch full details by ID
        const fullOrg = await organizationService.getOrganizationById(found.id);
        setOrganization(fullOrg);

        // Fetch campaigns created by the organization representative
        const representativeId = fullOrg.representative?.cognito_id;
        if (representativeId) {
          setLoadingCampaigns(true);
          try {
            const result = await campaignService.searchCampaigns({
              creatorId: representativeId,
              limit: 100, // Fetch enough campaigns
            });
            if (result) {
              setCampaigns(result.items);
            }
          } catch (error) {
            console.error("Error fetching organization campaigns:", error);
          } finally {
            setLoadingCampaigns(false);
          }
        }

      } catch (err) {
        toast.error("Không thể tải thông tin tổ chức", {
          description:
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi không xác định.",
        });
        router.push("/organizations");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  const handleJoinRequest = () => {
    requireAuth(() => {
      setSelectedRole(USER_ROLES.DELIVERY_STAFF);
      setJoinDialogOpen(true);
    });
  };

  const handleSubmitJoinRequest = async () => {
    if (!organization) return;

    try {
      setIsSubmitting(true);
      const result = await organizationService.requestJoinOrganization({
        organization_id: organization.id,
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

  const isRepresentative =
    currentUser?.id === organization?.representative?.cognito_id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7]">
        <Loader animate loop className="h-8 w-8 text-[#b55631]" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy tổ chức
          </h3>
          <Button
            onClick={() => router.push("/organizations")}
            className="mt-4 bg-[#b55631] hover:bg-[#944322]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f3] pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#b6542f] to-[#e37341] text-white pt-32 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-20 -right-20" />
          <div className="absolute w-64 h-64 bg-black/5 rounded-full blur-3xl bottom-0 left-0" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/organizations")}
            className="flex items-center gap-2 text-white/80 hover:text-white font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </motion.button>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#b55631] flex-shrink-0"
            >
              <Building2 className="w-12 h-12 md:w-16 md:h-16" />
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold mb-3"
              >
                {organization.name}
              </motion.h1>

              {organization.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/90 text-lg max-w-3xl leading-relaxed"
                >
                  {organization.description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 mt-6"
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <Users className="w-4 h-4" />
                  {organization.total_members || 0} thành viên
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {organization.active_members || 0} đang hoạt động
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <CalendarIcon className="w-4 h-4" />
                  Thành lập: {formatDate(organization.created_at)}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {!isRepresentative && (
                <Button
                  onClick={handleJoinRequest}
                  className="bg-white text-[#b55631] hover:bg-gray-100 font-semibold py-6 px-8 rounded-xl shadow-lg transition-all text-base"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Yêu cầu tham gia
                </Button>
              )}
            </motion.div>
          </div >
        </div >
      </div >

      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        <Tabs defaultValue="campaigns" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-xl shadow-md border border-gray-100 inline-flex h-auto">
            <TabsTrigger value="campaigns" className="px-6 py-3 rounded-lg data-[state=active]:bg-[#b55631] data-[state=active]:text-white text-gray-600 font-medium transition-all">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Chiến dịch ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="px-6 py-3 rounded-lg data-[state=active]:bg-[#b55631] data-[state=active]:text-white text-gray-600 font-medium transition-all">
              <Info className="w-4 h-4 mr-2" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="members" className="px-6 py-3 rounded-lg data-[state=active]:bg-[#b55631] data-[state=active]:text-white text-gray-600 font-medium transition-all">
              <Users className="w-4 h-4 mr-2" />
              Thành viên
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="focus:outline-none">
            {loadingCampaigns ? (
              <div className="flex justify-center py-20">
                <Loader animate loop className="w-10 h-10 text-[#b55631]" />
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    id={campaign.id}
                    title={campaign.title}
                    description={campaign.description}
                    coverImage={campaign.coverImage || ""}
                    phases={campaign.phases?.map(p => ({
                      phaseName: p.phaseName,
                      location: p.location,
                      ingredientPurchaseDate: p.ingredientPurchaseDate,
                      cookingDate: p.cookingDate,
                      deliveryDate: p.deliveryDate,
                    }))}
                    status={campaign.status}
                    donationCount={campaign.donationCount}
                    receivedAmount={campaign.receivedAmount}
                    targetAmount={campaign.targetAmount}
                    fundraisingStartDate={campaign.fundraisingStartDate}
                    fundraisingEndDate={campaign.fundraisingEndDate}
                    creatorName={campaign.creator?.full_name}
                    fundingProgress={campaign.fundingProgress}
                    daysRemaining={campaign.daysRemaining}
                    daysActive={campaign.daysActive}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Chưa có chiến dịch nào</h3>
                <p className="text-gray-500">Tổ chức này chưa tạo chiến dịch nào.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#b55631]" />
                      Thông tin liên hệ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-[#b55631]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Địa chỉ</p>
                          <p className="text-gray-900 font-medium">{organization.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Phone className="w-5 h-5 text-[#b55631]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Số điện thoại</p>
                          <p className="text-gray-900 font-medium">{organization.phone_number}</p>
                        </div>
                      </div>
                      {organization.website && (
                        <div className="flex items-start gap-3 md:col-span-2">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Globe className="w-5 h-5 text-[#b55631]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Website</p>
                            <a
                              href={organization.website.startsWith("http") ? organization.website : `https://${organization.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#b55631] hover:underline font-medium"
                            >
                              {organization.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                {organization.representative && (
                  <Card className="border-0 shadow-md h-full">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Người đại diện</h3>
                      <div className="flex flex-col items-center text-center">
                        {organization.representative.avatar_url ? (
                          <Image
                            src={organization.representative.avatar_url}
                            alt={organization.representative.full_name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover shadow-lg mb-4"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#b6542f] to-[#e37341] text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
                            {organization.representative.full_name.charAt(0)}
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-gray-900">
                          {organization.representative.full_name}
                        </h4>
                        <p className="text-gray-500 text-sm mb-4">
                          @{organization.representative.user_name}
                        </p>

                        <div className="w-full space-y-3 text-left bg-gray-50 p-4 rounded-xl">
                          {organization.representative.email && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{organization.representative.email}</span>
                            </div>
                          )}
                          {organization.representative.phone_number && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{organization.representative.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="focus:outline-none">
            {organization.members && organization.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.members.map((membership) => (
                  <Card key={membership.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {membership.member.avatar_url ? (
                          <Image
                            src={membership.member.avatar_url}
                            alt={membership.member.full_name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg">
                            {membership.member.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {membership.member.full_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {translateRole(membership.member_role)}
                            </Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(membership.joined_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Chưa có thành viên</h3>
                <p className="text-gray-500">Tổ chức này chưa có thành viên nào khác.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
                {organization.name}
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
                  <SelectItem value={USER_ROLES.DELIVERY_STAFF}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole(USER_ROLES.DELIVERY_STAFF)}
                      </span>
                      <span className="text-xs text-gray-500">
                        - Giao hàng, vận chuyển
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value={USER_ROLES.KITCHEN_STAFF}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {translateRole(USER_ROLES.KITCHEN_STAFF)}
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

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Thông tin tổ chức:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Tên:</span> {organization.name}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {organization.address}
                </p>
                <p>
                  <span className="font-medium">Số thành viên:</span>{" "}
                  {organization.total_members || 0}
                </p>
              </div>
            </div>
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
    </div >
  );
}
