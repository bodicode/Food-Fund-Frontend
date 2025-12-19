"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Search,
    ShieldCheck,
    QrCode,
    Banknote,
    Navigation,
    CheckCircle2,
    Lock,
    History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

import "../globals.css";

const DONATION_STEPS = [
    {
        title: "Chọn chiến dịch",
        description: "Duyệt qua danh sách các chiến dịch từ thiện hoặc tìm kiếm theo danh mục mà bạn quan tâm như bếp ăn, cứu trợ khẩn cấp hay hỗ trợ trẻ em.",
        icon: Search,
        color: "bg-orange-50 text-[#E77731]"
    },
    {
        title: "Nhập thông tin",
        description: "Nhấn nút 'Ủng hộ', nhập số tiền bạn muốn đóng góp. Bạn có thể chọn ủng hộ công khai hoặc ẩn danh tùy theo mong muốn của mình.",
        icon: Heart,
        color: "bg-red-50 text-red-500"
    },
    {
        title: "Thanh toán an toàn",
        description: "Thực hiện chuyển khoản ngân hàng nhanh chóng qua mã QR hoặc số tài khoản định danh của chiến dịch.",
        icon: Banknote,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Theo dõi tác động",
        description: "Sau khi hoàn tất, bạn sẽ nhận được thông báo xác nhận. Bạn có thể theo dõi quá trình sử dụng số tiền này thông qua báo cáo minh bạch của chiến dịch.",
        icon: History,
        color: "bg-purple-50 text-purple-600"
    }
];

const PAYMENT_METHODS = [
    {
        icon: QrCode,
        title: "Quét mã QR",
        desc: "Sử dụng ứng dụng ngân hàng của bạn để quét mã QR giúp thanh toán chính xác và nhanh chóng nhất."
    },
    {
        icon: Banknote,
        title: "Chuyển khoản thủ công",
        desc: "Giao dịch trực tiếp qua số tài khoản ngân hàng của Food Fund được hiển thị tại trang thanh toán."
    }
];

export default function HowToDonatePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
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
                            <ShieldCheck className="w-4 h-4" />
                            Giao dịch an toàn & Minh bạch
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                            Lan tỏa yêu thương <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">chỉ với vài bước</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            Food Fund kết nối những tấm lòng hảo tâm tới đúng nơi cần hỗ trợ nhất. Quy trình đơn giản, bảo mật và hoàn toàn minh bạch.
                        </p>
                    </motion.div>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {DONATION_STEPS.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group pt-10"
                        >
                            <div className="absolute top-0 left-10 text-[8rem] font-black text-gray-100/50 leading-none select-none group-hover:text-[#E77731]/10 transition-colors">
                                {idx + 1}
                            </div>
                            <div className="relative p-8 rounded-[2.5rem] bg-white border border-white hover:border-[#E77731]/20 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-[1.5rem] ${step.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Payment Methods Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Thanh toán qua chuyển khoản</h2>
                            <p className="text-gray-500 font-medium leading-relaxed">Chúng tôi sử dụng hệ thống chuyển khoản ngân hàng an toàn để đảm bảo mọi khoản đóng góp đều được ghi nhận chính xác.</p>
                        </div>

                        <div className="space-y-6">
                            {PAYMENT_METHODS.map((method, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white border border-gray-50 hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#ad4e28] group-hover:bg-[#E77731] group-hover:text-white transition-colors shrink-0">
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{method.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{method.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Security & Proof Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative p-10 md:p-12 rounded-[3.5rem] bg-gray-900 text-white overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Lock className="w-64 h-64 -rotate-12" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 rounded-2xl bg-[#E77731] flex items-center justify-center shadow-xl shadow-[#E77731]/20">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black leading-tight">Tại sao nên ủng hộ qua Food Fund?</h3>

                            <div className="space-y-6">
                                {[
                                    "Tiền được giữ an toàn bởi hệ thống cho đến khi có minh chứng chi tiêu.",
                                    "Theo dõi trực tiếp quá trình giải ngân và thực hiện chiến dịch.",
                                    "Cộng đồng hàng ngàn người tham gia giám sát chéo.",
                                    "Hệ thống báo cáo minh bạch gửi trực tiếp về email của bạn."
                                ].map((text, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-[#E77731] shrink-0 mt-1" />
                                        <p className="text-gray-400 font-medium leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex flex-col gap-4">
                                <Button
                                    onClick={() => router.push('/s')}
                                    className="h-14 rounded-2xl bg-white text-[#ad4e28] hover:bg-gray-100 font-black text-lg transition-all"
                                >
                                    Khám phá chiến dịch
                                    <Navigation className="ml-2 w-5 h-5" />
                                </Button>
                                <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest">Hoàn toàn miễn phí dịch vụ</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
