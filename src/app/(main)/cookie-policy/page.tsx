"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie, Settings, BarChart, UserCheck, Layout, ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

import "../globals.css";

export default function CookiePolicyPage() {
    const router = useRouter();

    const cookieTypes = [
        {
            icon: Layout,
            title: "1. Cookie thiết yếu",
            content: "Đây là những cookie bắt buộc để trang web hoạt động bình thường, như duy trì trạng thái đăng nhập, bảo mật và quản lý phiên làm việc."
        },
        {
            icon: BarChart,
            title: "2. Cookie phân tích",
            content: "Chúng tôi sử dụng cookie này để hiểu được cách người dùng tương tác với trang web, từ đó cải thiện hiệu suất và trải nghiệm chung của nền tảng."
        },
        {
            icon: UserCheck,
            title: "3. Cookie chức năng",
            content: "Giúp ghi nhớ các lựa chọn của bạn như ngôn ngữ hoặc cài đặt giao diện (sáng/tối) để mang lại trải nghiệm cá nhân hóa hơn."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
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
                            <Cookie className="w-4 h-4" />
                            Cookie Policy
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                            Chính sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">Cookie</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Tìm hiểu cách chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn.</p>
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
                            <h2 className="text-2xl font-black text-gray-900 mb-4">Cookie là gì?</h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Cookie là những tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập trang web. Chúng giúp chúng tôi nhận diện trình duyệt và ghi nhớ một số thông tin để phục vụ bạn tốt hơn.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {cookieTypes.map((type, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-white border border-gray-50 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-all"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#E77731] shrink-0">
                                        <type.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{type.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{type.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 rounded-[2rem] bg-gray-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Settings className="w-24 h-24 rotate-45" />
                            </div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#E77731] flex items-center justify-center shrink-0">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Cách quản lý Cookie</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Bạn có thể kiểm soát và/hoặc xóa cookie theo ý muốn trong phần cài đặt trình duyệt của mình. Tuy nhiên, việc tắt một số cookie có thể ảnh hưởng đến trải nghiệm người dùng trên Food Fund.
                                    </p>
                                </div>
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
