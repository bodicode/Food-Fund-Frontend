"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    HeartHandshake,
    CheckCircle2,
    Users,
    Truck,
    ChefHat,
    ArrowRight,
    MapPin,
    Phone,
    Globe,
    PlusCircle,
    ShieldCheck,
    Star,
    Settings2
} from "lucide-react";
import { Loader } from "../../../components/animate-ui/icons/loader";
import { organizationService } from "../../../services/organization.service";
import { Organization } from "../../../types/api/organization";
import { Button } from "../../../components/ui/button";

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
                setOrganization(null);
            } finally {
                setChecking(false);
            }
        };

        checkOrganization();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fefcf8]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 text-[#E77731]" />
                    <p className="text-gray-400 font-bold animate-pulse">Đang kiểm tra thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
            {/* Background Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E77731]/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -15, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ad4e28]/5 rounded-full blur-[120px]"
                />
            </div>

            <div className="container relative z-10 mx-auto max-w-5xl">
                <AnimatePresence mode="wait">
                    {organization ? (
                        <motion.div
                            key="has-org"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            {/* Header Section */}
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-green-50 text-green-500 mb-6 shadow-xl shadow-green-500/10"
                                >
                                    <CheckCircle2 className="w-10 h-10" />
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                    Tổ chức của bạn <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">đã sẵn sàng</span>
                                </h1>
                                <p className="text-gray-500 mt-4 text-lg">Mọi thứ đã được thiết lập để bạn bắt đầu hành trình thay đổi thế giới.</p>
                            </div>

                            {/* Organization Card - Glassmorphism */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#E77731] via-[#ad4e28] to-[#E77731] rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
                                <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
                                    <div className="flex flex-col md:flex-row gap-12">
                                        {/* Profile Picture / Icon Area */}
                                        <div className="md:w-1/3 flex flex-col items-center">
                                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-[#E77731] to-[#ad4e28] p-1 shadow-2xl">
                                                <div className="w-full h-full rounded-[2.4rem] bg-white flex items-center justify-center overflow-hidden">
                                                    <Building2 className="w-20 h-20 text-[#E77731]/40" />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold uppercase tracking-widest">
                                                <ShieldCheck className="w-3 h-3" />
                                                Đã xác minh
                                            </div>
                                        </div>

                                        {/* Info Area */}
                                        <div className="md:w-2/3 space-y-8">
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 mb-2">{organization.name}</h2>
                                                <p className="text-gray-500 leading-relaxed font-medium line-clamp-2 italic">{organization.description || "Chưa có mô tả cho tổ chức này."}</p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#E77731] shrink-0">
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ</p>
                                                            <p className="text-sm font-bold text-gray-700">{organization.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                                            <Phone className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Liên hệ</p>
                                                            <p className="text-sm font-bold text-gray-700">{organization.phone_number}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                            <Globe className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Website</p>
                                                            <a href={organization.website} target="_blank" className="text-sm font-bold text-[#E77731] hover:underline truncate block max-w-xs">{organization.website}</a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                                            <Users className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cộng sự</p>
                                                            <p className="text-sm font-bold text-gray-700">{organization.active_members || 0} Thành viên</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Button
                                    onClick={() => router.push("/register/campaign/type")}
                                    className="flex-1 h-16 rounded-[1.5rem] bg-[#E77731] hover:bg-[#d16629] text-white font-bold text-xl shadow-2xl shadow-[#E77731]/30 group transition-all"
                                >
                                    Tạo chiến dịch mới
                                    <PlusCircle className="ml-3 w-6 h-6 group-hover:rotate-90 transition-transform" />
                                </Button>
                                <Button
                                    onClick={() => router.push("/profile/organization")}
                                    variant="outline"
                                    className="flex-1 h-16 rounded-[1.5rem] border-2 bg-white/50 backdrop-blur-sm border-gray-100 hover:bg-white text-gray-700 font-bold text-xl group"
                                >
                                    Quản lý tổ chức
                                    <Settings2 className="ml-3 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-org"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-16"
                        >
                            {/* Header */}
                            <div className="text-center max-w-3xl mx-auto px-4">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-8"
                                >
                                    <Star className="w-4 h-4" />
                                    Fundraising Hub
                                </motion.span>
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8">
                                    Thực hiện sứ mệnh của bạn <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">cùng một tổ chức</span>
                                </h1>
                                <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
                                    Tổ chức là nền tảng để xây dựng lòng tin, quản lý đội ngũ hiệu quả và thực hiện các chiến dịch thiện nguyện minh bạch nhất.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Building2, title: "Tăng uy tín", text: "Xây dựng lòng tin từ hàng ngàn người ủng hộ qua tư cách pháp đoàn.", color: "bg-orange-50 text-[#E77731]" },
                                    { icon: ChefHat, title: "Quản lý bếp", text: "Đảm bảo chất lượng các bữa ăn thông qua quản lý hệ thống bếp.", color: "bg-green-50 text-green-600" },
                                    { icon: Truck, title: "Vận chuyển", text: "Tối ưu hóa các điểm phân phối thực phẩm một cách chuyên nghiệp.", color: "bg-blue-50 text-blue-600" },
                                    { icon: ShieldCheck, title: "Minh bạch", text: "Hệ thống quản lý tài chính và giải ngân công khai 100%.", color: "bg-purple-50 text-purple-600" },
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="p-8 rounded-[2rem] bg-white border border-white hover:border-[#E77731]/20 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium italic">{feature.text}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Checklist & CTA Card */}
                            <div className="grid lg:grid-cols-3 gap-12 items-center">
                                <div className="lg:col-span-1 space-y-6">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Chuẩn bị thông tin</h4>
                                    {["Tên tổ chức chính thức", "Lĩnh vực thiện nguyện", "Địa chỉ & Hotline", "Tư cách pháp nhân"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#E77731]" />
                                            <span className="text-gray-700 font-bold">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="lg:col-span-2">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="p-10 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden group shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                            <HeartHandshake className="w-64 h-64 -rotate-12" />
                                        </div>
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-black mb-4">Bạn đã sẵn sàng khởi đầu?</h3>
                                                <p className="text-gray-400 leading-relaxed">Chỉ mất 5 phút để tạo lập tổ chức và mở cánh cửa đến với hàng ngàn cơ hội giúp đỡ cộng đồng.</p>
                                            </div>
                                            <Button
                                                onClick={() => router.push("/register/organization")}
                                                className="h-16 px-10 rounded-2xl bg-[#E77731] hover:bg-[#d16629] text-white font-bold text-xl flex items-center gap-3 transition-all"
                                            >
                                                Tạo tổ chức ngay
                                                <ArrowRight className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <p className="text-center text-gray-400 text-sm font-medium">Quá trình xác thuật sẽ được thực hiện tự động và bảo mật bởi Hệ thống của chúng tôi.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
