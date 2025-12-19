"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Server, Bell, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

import "../globals.css";

export default function PrivacyPolicyPage() {
    const router = useRouter();

    const sections = [
        {
            icon: Eye,
            title: "1. Thông tin chúng tôi thu thập",
            content: "Chúng tôi thu thập các thông tin cần thiết để cung cấp dịch vụ tốt nhất, bao gồm: Họ tên, Email, Số điện thoại, Thông tin tài khoản và Dữ liệu giao dịch khi bạn thực hiện quyên góp hoặc đăng ký tổ chức."
        },
        {
            icon: Server,
            title: "2. Cách chúng tôi sử dụng thông tin",
            content: "Thông tin của bạn được sử dụng để xác thực tài khoản, xử lý các khoản quyên góp, gửi thông báo cập nhật về chiến dịch và cải thiện trải nghiệm người dùng trên nền tảng Food Fund."
        },
        {
            icon: Lock,
            title: "3. Bảo mật dữ liệu",
            content: "Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức nghiêm ngặt (như mã hóa SSL/TLS) để bảo vệ thông tin cá nhân của bạn khỏi việc truy cập trái phép, mất mát hoặc thay đổi."
        },
        {
            icon: ShieldCheck,
            title: "4. Chia sẻ thông tin với bên thứ ba",
            content: "Food Fund cam kết KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ dữ liệu với các đối tác dịch vụ tin cậy (như cổng thanh toán) để hoàn tất giao dịch của bạn."
        },
        {
            icon: Bell,
            title: "5. Quyền của bạn",
            content: "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua phần cài đặt tài khoản hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Cam kết bảo mật
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                            Chính sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">Bảo mật</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Cập nhật lần cuối: 19 tháng 12, 2025</p>
                    </motion.div>
                </div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]"
                >
                    <div className="space-y-12">
                        <div className="prose prose-orange max-w-none">
                            <p className="text-lg text-gray-600 leading-relaxed italic">
                                Sự riêng tư của bạn là ưu tiên hàng đầu tại Food Fund. Chính sách này giải thích cách chúng tôi bảo vệ và tôn trọng dữ liệu cá nhân của bạn khi bạn sử dụng nền tảng của chúng tôi.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {sections.map((section, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex gap-6"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#E77731]/10 flex items-center justify-center text-[#E77731] shrink-0 group-hover:bg-[#E77731] group-hover:text-white transition-all duration-300">
                                        <section.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{section.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-10 border-t border-gray-100 mt-12">
                            <div className="flex items-center gap-4 p-6 rounded-2xl bg-orange-50 border border-orange-100">
                                <FileText className="w-8 h-8 text-[#E77731] shrink-0" />
                                <p className="text-sm text-gray-700 font-medium">
                                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: <span className="font-bold text-[#ad4e28]">privacy@foodfund.vn</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <div className="mt-12 text-center">
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
