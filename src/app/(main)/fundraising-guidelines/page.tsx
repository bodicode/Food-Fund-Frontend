"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Target,
    Share2,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Rocket,
    Heart,
    Image as ImageIcon,
    Users,
    Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

import "../globals.css";

const GUIDELINE_STEPS = [
    {
        title: "Chuẩn bị kế hoạch",
        description: "Xác định rõ đối tượng mục tiêu, số lượng thực phẩm cần thiết và kế hoạch triển khai cụ thể.",
        icon: Target,
        details: [
            "Xác định nhóm đối tượng (người già, trẻ em, vùng thiên tai...)",
            "Tính toán chi ngân sách chi tiết dựa trên đơn giá thực phẩm thực tế",
            "Lên lịch trình thực hiện cụ thể (ngày nấu, ngày phát quà...)"
        ]
    },
    {
        title: "Tạo chiến dịch",
        description: "Trình bày câu chuyện của bạn một cách chân thực và minh bạch trên Food Fund.",
        icon: FileText,
        details: [
            "Sử dụng hình ảnh thực tế, chất lượng cao về hoạt động của bạn",
            "Viết nội dung truyền cảm hứng, nêu rõ lý do tại sao cần sự giúp đỡ",
            "Thiết lập các mốc mục tiêu tài chính hợp lý"
        ]
    },
    {
        title: "Xét duyệt hồ sơ",
        description: "Đội ngũ Food Fund sẽ kiểm tra tính xác thực để bảo vệ người ủng hộ.",
        icon: ShieldCheck,
        details: [
            "Xác minh danh tính cá nhân hoặc tư cách pháp nhân của tổ chức",
            "Liên hệ để làm rõ tính khả thi của kế hoạch (nếu cần)",
            "Phê duyệt chiến dịch để bắt đầu nhận quyên góp công khai"
        ]
    },
    {
        title: "Lan tỏa cộng đồng",
        description: "Sử dụng sức mạnh của mạng xã hội để đưa chiến dịch đến nhiều người hơn.",
        icon: Share2,
        details: [
            "Chia sẻ link chiến dịch lên Facebook, Zalo, TikTok",
            "Kêu gọi bạn bè và người thân là những người đầu tiên ủng hộ",
            "Cập nhật thường xuyên tiến độ gây quỹ để giữ lửa lòng tốt"
        ]
    },
    {
        title: "Thực hiện & Giải ngân",
        description: "Biến lòng tốt thành hành động thực tế và minh bạch chi tiêu.",
        icon: Rocket,
        details: [
            "Thực hiện mua sắm thực phẩm và triển khai theo đúng kế hoạch",
            "Thu thập đầy đủ hóa đơn, chứng từ chi tiết cho từng khoản chi",
            "Gửi yêu cầu giải ngân kèm bằng chứng để nhận kinh phí từ quỹ"
        ]
    }
];

export default function FundraisingGuidelinesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] left-[-5%] w-[55%] h-[55%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <Heart className="w-4 h-4" />
                            Dành cho người gây quỹ
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                            Hướng dẫn tạo <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">chiến dịch ý nghĩa</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-10">
                            Biến ý tưởng thiện nguyện của bạn thành hiện thực với quy trình 5 bước minh bạch và hiệu quả tại Food Fund. Chúng tôi đồng hành cùng bạn trên hành trình trao đi yêu thương.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => router.push('/register')}
                                className="h-14 px-8 rounded-2xl bg-[#E77731] hover:bg-[#d16629] text-white font-bold text-lg shadow-xl shadow-[#E77731]/20 group transition-all"
                            >
                                Bắt đầu ngay
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/contact')}
                                className="h-14 px-8 rounded-2xl border-2 hover:bg-white/50 font-bold text-lg"
                            >
                                Cần tư vấn thêm
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline Steps */}
                <div className="space-y-24 relative">
                    {/* Vertical line decor for desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E77731]/20 via-gray-100 to-[#ad4e28]/20 -translate-x-1/2 rounded-full" />

                    {GUIDELINE_STEPS.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Content Card */}
                            <div className="lg:w-1/2 w-full">
                                <div className="p-8 md:p-12 rounded-[2.5rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden group hover:border-[#E77731]/20 transition-all">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <step.icon className="w-32 h-32 rotate-12" />
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#E77731] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#E77731]/30">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900">{step.title}</h3>
                                    </div>

                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-4">
                                        {step.details.map((detail, dIdx) => (
                                            <li key={dIdx} className="flex items-start gap-4">
                                                <CheckCircle2 className="w-5 h-5 text-[#E77731] mt-1 shrink-0" />
                                                <span className="text-gray-600 leading-relaxed italic">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Icon / Visual Element */}
                            <div className="lg:w-1/2 flex justify-center">
                                <div className="relative">
                                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br from-[#E77731]/10 to-[#ad4e28]/10 flex items-center justify-center relative overflow-hidden group">
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        >
                                            <step.icon className="w-20 h-20 md:w-32 md:h-32 text-[#E77731] drop-shadow-2xl" />
                                        </motion.div>

                                        {/* Floating decor icons */}
                                        <div className="absolute top-4 right-4 animate-bounce">
                                            <div className="w-3 h-3 rounded-full bg-[#ad4e28]/20" />
                                        </div>
                                    </div>

                                    {/* Pulsing indicator for timeline */}
                                    <div className="hidden lg:block absolute top-1/2 left-[-6rem] lg:left-auto lg:right-[-6rem] transform -translate-y-1/2 z-20">
                                        <div className={`w-6 h-6 rounded-full bg-white border-4 border-[#E77731] shadow-xl ${idx % 2 !== 0 ? '-translate-x-[200px]' : 'translate-x-[200px]'}`} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tips Section */}
                <div className="mt-32 p-12 md:p-16 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Rocket className="w-48 h-48 rotate-45" />
                    </div>

                    <div className="relative z-10 max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-black mb-12 flex items-center gap-4">
                            <span className="w-12 h-1.5 bg-[#E77731] rounded-full" />
                            Mẹo để chiến dịch thành công
                        </h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#E77731] mb-6">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Hình ảnh chân thực</h4>
                                <p className="text-gray-400 leading-relaxed">Người ủng hộ kết nối qua cảm xúc. Hãy chụp những bức ảnh thực tế về hoàn cảnh và hoạt động của bạn thay vì dùng ảnh trên mạng.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#E77731] mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Cập nhật thường xuyên</h4>
                                <p className="text-gray-400 leading-relaxed">Hãy coi người ủng hộ là cộng sự. Đăng tin tức mỗi 3-5 ngày về tiến độ gây quỹ hoặc quá trình chuẩn bị thực phẩm.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#E77731] mb-6">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Kế hoạch tài chính rõ</h4>
                                <p className="text-gray-400 leading-relaxed">Liệt kê từng loại thực phẩm, gia vị hay vật dụng cần thiết. Sự chi tiết tạo nên niềm tin tuyệt đối.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#E77731] mb-6">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Nói lời cảm ơn</h4>
                                <p className="text-gray-400 leading-relaxed">Đừng quên gửi lời tri ân đến từng cá nhân. Một lời cảm ơn chân thành sẽ giữ họ ở lại lâu dài cho những sứ mệnh sau.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">Bạn đã sẵn sàng lan tỏa yêu thương?</h2>
                    <Button
                        onClick={() => router.push('/register')}
                        size="lg"
                        className="h-16 px-12 rounded-2xl bg-[#E77731] hover:bg-[#d16629] text-white font-bold text-xl shadow-2xl shadow-[#E77731]/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Bắt đầu chiến dịch đầu tiên của bạn
                    </Button>
                    <p className="mt-6 text-gray-400 text-sm">Hướng dẫn hoàn toàn miễn phí • Hỗ trợ 24/7 từ Hệ thống</p>
                </div>
            </div>
        </div>
    );
}
