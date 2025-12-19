"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Lightbulb,
    Camera,
    MessageSquare,
    Share2,
    History,
    CheckCircle2,
    ArrowRight,
    Target,
    Users,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";

import "../../globals.css";

const TIPS = [
    {
        icon: Target,
        title: "Tiêu đề gây ấn tượng mạnh",
        desc: "Tiêu đề là điều đầu tiên người ủng hộ nhìn thấy. Hãy làm cho nó ngắn gọn, xúc động và nêu rõ mục tiêu cụ thể.",
        details: ["Ví dụ: '1000 bữa cơm cho trẻ em vùng cao' thay vì 'Gây quỹ từ thiện'"]
    },
    {
        icon: Camera,
        title: "Hình ảnh & Video trung thực",
        desc: "Hình ảnh thực tế về hoàn cảnh và hoạt động chuẩn bị giúp tăng độ tin cậy gấp 3 lần so với ảnh minh họa.",
        details: ["Sử dụng ảnh chất lượng cao", "Cận cảnh nụ cười hoặc sự cần thiết của dự án"]
    },
    {
        icon: History,
        title: "Cập nhật tiến độ mỗi 3 ngày",
        desc: "Người ủng hộ muốn biết số tiền của họ đang được sử dụng như thế nào. Hãy liên tục đăng tin tức mới nhất.",
        details: ["Kể về quá trình mua nguyên liệu", "Chia sẻ cảm xúc của người thực hiện"]
    },
    {
        icon: Share2,
        title: "Sức mạnh từ 'Vòng tròn đầu tiên'",
        desc: "Hãy kêu gọi bạn bè và gia đình ủng hộ trước. Chiến dịch có 10-20% vốn mồi sẽ dễ dàng thu hút người lạ hơn.",
        details: ["Chia sẻ trực tiếp qua Zalo/Facebook cá nhân", "Cá nhân hóa lời nhắn gửi"]
    }
];

export default function FundraisingTipsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[55%] h-[55%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <Lightbulb className="w-4 h-4" />
                            Cẩm nang gây quỹ
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                            Mẹo để chiến dịch <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">chạm đến trái tim</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            Gây quỹ không chỉ là xin hỗ trợ, đó là nghệ thuật kể một câu chuyện ý nghĩa. Hãy cùng Food Fund tối ưu hóa chiến dịch của bạn.
                        </p>
                    </motion.div>
                </div>

                {/* Tips Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-32">
                    {TIPS.map((tip, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-10 rounded-[2.5rem] bg-white border border-white hover:border-[#E77731]/20 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-[1.25rem] bg-[#E77731]/10 flex items-center justify-center text-[#E77731] mb-8 group-hover:scale-110 group-hover:bg-[#E77731] group-hover:text-white transition-all duration-300">
                                <tip.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{tip.title}</h3>
                            <p className="text-gray-500 leading-relaxed mb-6 font-medium">{tip.desc}</p>
                            <div className="space-y-3">
                                {tip.details.map((detail, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#E77731]" />
                                        <span className="text-sm text-gray-400 italic">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Advice Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-16 rounded-[3.5rem] bg-gray-900 text-white overflow-hidden relative shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Sparkles className="w-64 h-64 rotate-12" />
                    </div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-8">Nghệ thuật <span className="text-[#E77731]">Kể chuyện</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                Đừng chỉ đưa ra những con số lạnh lùng. Hãy kể về ánh mắt của một đứa trẻ khi nhận bát cơm nóng, hoặc nỗ lực thức khuya dậy sớm của các tình nguyện viên. Những câu chuyện thật mới là cầu nối vững chắc nhất tới lòng tốt cộng đồng.
                            </p>
                            <Button
                                onClick={() => router.push('/fundraising-guidelines')}
                                className="h-14 px-8 rounded-2xl bg-[#E77731] hover:bg-[#d16629] text-white font-bold transition-all"
                            >
                                Xem hướng dẫn chi tiết
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                                <MessageSquare className="w-8 h-8 text-[#E77731] mb-4" />
                                <h4 className="text-xl font-bold mb-2">Lời kêu gọi chân thành</h4>
                                <p className="text-gray-400 text-sm">Hãy dùng ngôn ngữ từ tâm, tránh sự khuôn mẫu hay ép buộc.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Users className="w-8 h-8 text-[#E77731] mb-4" />
                                <h4 className="text-xl font-bold mb-2">Sự kết nối cộng đồng</h4>
                                <p className="text-gray-400 text-sm">Trả lời mọi bình luận và tin nhắn từ người ủng hộ.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Navigation */}
                <div className="mt-20 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="group gap-2 text-gray-400 hover:text-[#E77731] font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}
