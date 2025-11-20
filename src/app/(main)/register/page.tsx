"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, HeartHandshake, CheckCircle2, Users, Truck, ChefHat, ArrowRight, MapPin, Phone, Globe } from "lucide-react";
import { Loader } from "@/components/animate-ui/icons/loader";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";
import { Button } from "@/components/ui/button";

export default function OrgRegisterPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [organization, setOrganization] = useState<Organization | null>(null);

    useEffect(() => {
        const checkOrganization = async () => {
            try {
                const org = await organizationService.getMyOrganization();
                setOrganization(org);
            } catch {
            } finally {
                setChecking(false);
            }
        };

        checkOrganization();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
                <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
        );
    }

    if (organization) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white pt-22 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="flex justify-center"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                                    <CheckCircle2 className="w-14 h-14 text-green-500 relative" />
                                </div>
                            </motion.div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-color">
                                    Tổ chức của bạn đã sẵn sàng
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base mt-2">
                                    Xác nhận thông tin và bắt đầu tạo chiến dịch gây quỹ
                                </p>
                            </div>
                        </div>

                        {/* Organization Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Header with gradient */}
                            <div className="h-2 bg-gradient-to-r from-[#E77731] to-[#ad4e28]" />

                            <div className="p-8 space-y-6">
                                {/* Organization Name */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên tổ chức</p>
                                    <p className="text-2xl font-bold text-color mt-2">
                                        {organization.name}
                                    </p>
                                </div>

                                {/* Details Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Address */}
                                    <div className="flex gap-4">
                                        <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Địa chỉ</p>
                                            <p className="text-sm text-gray-800 mt-1">
                                                {organization.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-4">
                                        <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số điện thoại</p>
                                            <p className="text-sm text-gray-800 mt-1">
                                                {organization.phone_number}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div className="flex gap-4">
                                        <Globe className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
                                            <a
                                                href={organization.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-orange-600 hover:text-orange-700 mt-1 break-all hover:underline"
                                            >
                                                {organization.website}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Members */}
                                    {(organization.active_members || organization.total_members) && (
                                        <div className="flex gap-4">
                                            <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thành viên</p>
                                                <p className="text-sm text-gray-800 mt-1">
                                                    {organization.active_members || 0} / {organization.total_members || 0} hoạt động
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {organization.description && (
                                    <>
                                        <div className="h-px bg-gray-200" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mô tả</p>
                                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                                {organization.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <Button
                                onClick={() => router.push("/register/campaign/type")}
                                className="flex-1 bg-gradient-to-r from-[#E77731] to-[#ad4e28] hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 h-12"
                            >
                                Tạo chiến dịch
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => router.push("/profile/organization")}
                                variant="outline"
                                className="flex-1 py-3 rounded-lg font-semibold h-12"
                            >
                                Quản lý tổ chức
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Case 2: User chưa có organization
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white pt-22 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-color">
                            Bắt đầu với tổ chức của bạn
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            Tổ chức là nền tảng để xây dựng chiến dịch gây quỹ uy tín, quản lý đội ngũ và thực hiện minh bạch
                        </p>
                    </div>

                    {/* Main Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                        {/* Header with gradient */}
                        <div className="h-1 bg-gradient-to-r from-[#E77731] via-orange-500 to-[#ad4e28]" />

                        <div className="p-8 md:p-10 space-y-8">
                            {/* Icons */}
                            <div className="flex justify-center gap-8">
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="p-4 bg-orange-100 rounded-xl"
                                >
                                    <Building2 className="w-8 h-8 text-orange-600" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                                    className="p-4 bg-orange-100 rounded-xl"
                                >
                                    <HeartHandshake className="w-8 h-8 text-orange-600" />
                                </motion.div>
                            </div>

                            {/* Benefits Grid */}
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-color text-center">
                                    Lợi ích của tổ chức
                                </h2>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex gap-3 p-4 bg-gradient-to-br from-green-50 to-green-50/50 border border-green-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-color">Tăng độ uy tín</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Xây dựng lòng tin từ cộng đồng</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="flex gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-50/50 border border-orange-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <ChefHat className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-color">Quản lý bếp</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Đảm bảo chất lượng thực phẩm</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-color">Quản lý vận chuyển</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Tối ưu hóa phân phối</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.45 }}
                                        className="flex gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-50/50 border border-purple-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-color">Minh bạch</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Công khai tài chính & hoạt động</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                                <p className="text-sm font-semibold text-gray-900">Chuẩn bị thông tin:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                                        Tên tổ chức
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                                        Lĩnh vực hoạt động
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                                        Địa chỉ & số điện thoại
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                                        Thông tin đại diện pháp lý
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            onClick={() => router.push("/register/organization")}
                            className="w-full bg-gradient-to-r from-[#E77731] to-[#ad4e28] hover:shadow-lg text-white font-semibold py-4 rounded-lg transition-all duration-300 text-base flex items-center justify-center gap-2 h-12"
                        >
                            Tạo tổ chức ngay
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </motion.div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-gray-500">
                        Quá trình tạo tổ chức chỉ mất vài phút. Sau khi xác nhận, bạn có thể bắt đầu tạo chiến dịch gây quỹ.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
