"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Users,
    Flame,
    Calendar,
    ArrowRight,
    ArrowLeft,
    Quote,
    Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";

import "../../globals.css";

const STORIES = [
    {
        title: "10,000 Suất cơm 0đ cho Bệnh viện Ung bướu",
        desc: "Chiến dịch đã vượt mục tiêu 150% chỉ trong 2 tuần nhờ sự ủng hộ nhiệt tình từ cộng đồng mạng.",
        metrics: {
            raised: "350,000,000đ",
            supporters: "1,240",
            days: "15 ngày"
        },
        tag: "Bếp cơm từ thiện"
    },
    {
        title: "Cứu trợ khẩn cấp lũ lụt Miền Trung 2024",
        desc: "Hơn 5 tấn thực phẩm khô và nhu yếu phẩm đã được trao tận tay bà con vùng rốn lũ.",
        metrics: {
            raised: "820,000,000đ",
            supporters: "4,500",
            days: "7 ngày"
        },
        tag: "Cứu trợ khẩn cấp"
    },
    {
        title: "Hộp sữa cho em - Ươm mầm trẻ thơ vùng cao",
        desc: "Cung cấp dinh dưỡng đầy đủ cho hơn 200 trẻ em tại điểm trường xa xôi nhất Lai Châu.",
        metrics: {
            raised: "125,000,000đ",
            supporters: "860",
            days: "30 ngày"
        },
        tag: "Hỗ trợ trẻ em"
    }
];

export default function SuccessStoriesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <Trophy className="w-4 h-4" />
                            Câu chuyện thành công
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                            Khi lòng tốt <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">kết nối thành sức mạnh</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            Mỗi chiến dịch thành công là minh chứng cho tinh thần tương thân tương ái. Hãy xem chúng ta đã cùng nhau làm nên những điều kỳ diệu như thế nào.
                        </p>
                    </motion.div>
                </div>

                {/* Stories Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-32">
                    {STORIES.map((story, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Card Header with Tag */}
                            <div className="p-8 pb-0 flex justify-between items-start">
                                <span className="px-4 py-1.5 rounded-full bg-orange-50 text-[#E77731] text-[10px] font-black uppercase tracking-widest">
                                    {story.tag}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#E77731] group-hover:text-white transition-colors duration-300">
                                    <Flame className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#E77731] transition-colors line-clamp-2">
                                    {story.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 italic">
                                    &quot;{story.desc}&quot;
                                </p>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tiền quỹ</p>
                                        <p className="text-lg font-black text-[#ad4e28]">{story.metrics.raised}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Người ủng hộ</p>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm font-bold text-gray-700">{story.metrics.supporters}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm font-bold text-gray-700">{story.metrics.days}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Action */}
                            <div className="p-4 bg-gray-50 group-hover:bg-[#E77731]/5 transition-colors text-center">
                                <button className="text-xs font-black text-gray-400 group-hover:text-[#E77731] uppercase tracking-widest flex items-center justify-center gap-2 w-full">
                                    Xem chi tiết câu chuyện
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Inspirational Quote Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-16 rounded-[4rem] bg-gray-900 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center"
                >
                    <div className="absolute top-0 left-0 p-12 opacity-5">
                        <Quote className="w-48 h-48 -rotate-12" />
                    </div>

                    <Quote className="w-12 h-12 text-[#E77731] mb-10" />
                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-10 max-w-4xl">
                        &ldquo;Không ai trong chúng ta làm được điều vĩ đại một mình. Nhưng chúng ta có thể làm những điều nhỏ nhặt với một tình yêu vĩ đại.&rdquo;
                    </h2>

                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E77731]" />
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Mẹ Teresa</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E77731]" />
                    </div>

                    <Button
                        onClick={() => router.push('/register')}
                        className="h-16 px-12 rounded-[1.5rem] bg-[#E77731] hover:bg-[#d16629] text-white font-black text-xl shadow-2xl shadow-[#E77731]/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Bắt đầu viết câu chuyện của bạn
                        <Heart className="ml-3 w-6 h-6 fill-white" />
                    </Button>
                </motion.div>

                {/* Back Button */}
                <div className="mt-24 text-center">
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
