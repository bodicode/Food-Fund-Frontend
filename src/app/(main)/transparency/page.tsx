"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    FileSearch,
    Scale,
    CheckCircle2,
    HeartHandshake,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

import "../globals.css";

export default function TransparencyPage() {
    const router = useRouter();

    const principles = [
        {
            icon: FileSearch,
            title: "Minh bạch tài chính 100%",
            description: "Mọi khoản đóng góp đều được ghi nhận công khai. Người gây quỹ bắt buộc phải cung cấp hóa đơn, chứng từ chi tiết cho từng đồng tiền được giải ngân."
        },
        {
            icon: Scale,
            title: "Trách nhiệm giải trình",
            description: "Đội ngũ quản trị viên và hệ thống kiểm soát 3 lớp đảm bảo mọi chiến dịch đều diễn ra theo đúng kế hoạch đã cam kết với cộng đồng."
        },
        {
            icon: CheckCircle2,
            title: "Xác thực danh tính",
            description: "Tất cả các tổ chức và cá nhân gây quỹ đều phải trải qua quy trình xác minh danh tính nghiêm ngặt trước khi được phép kêu gọi quyên góp."
        },
        {
            icon: HeartHandshake,
            title: "Công bằng & Chính trực",
            description: "Chúng tôi đối xử công bằng với tất cả các bên tham gia, đặt lợi ích của người nhận hỗ trợ và niềm tin của người ủng hộ lên hàng đầu."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Lòng tin của bạn là nền tảng
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8">
                            Minh bạch & <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">Trách nhiệm</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                            Tại Food Fund, chúng tôi tin rằng sự minh bạch tuyệt đối là chìa khóa để xây dựng cộng đồng thiện nguyện vững mạnh và trao đi giá trị thực sự.
                        </p>
                    </motion.div>
                </div>

                {/* Principles Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {principles.map((p, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-10 rounded-[2.5rem] bg-white border border-white hover:border-[#E77731]/20 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-[#E77731] mb-8 group-hover:scale-110 group-hover:bg-[#E77731] group-hover:text-white transition-all duration-300">
                                <p.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{p.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium italic">{p.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Closing Quote */}
                <div className="mt-32 text-center max-w-3xl mx-auto">
                    <HeartHandshake className="w-12 h-12 text-[#E77731] mx-auto mb-8 opacity-20" />
                    <h3 className="text-2xl font-medium text-gray-900 leading-relaxed italic">
                        &ldquo;Minh bạch không chỉ là một chính sách, đó là lời hứa của chúng tôi với từng người ủng hộ và từng bữa ăn được trao đi.&rdquo;
                    </h3>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E77731] to-[#ad4e28]" />
                        <div className="text-left">
                            <p className="font-black text-gray-900 uppercase tracking-widest text-sm">Ban Quản Trị</p>
                            <p className="text-xs text-gray-400 font-bold">Food Fund Team</p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-20 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="group gap-2 text-gray-400 hover:text-[#E77731] font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Quay lại trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}
