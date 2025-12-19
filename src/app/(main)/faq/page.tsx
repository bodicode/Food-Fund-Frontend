"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    HelpCircle,
    MessageCircle,
    Heart,
    Wallet,
    ShieldCheck,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import "../globals.css";

const FAQ_DATA = [
    {
        category: "Chung",
        icon: HelpCircle,
        questions: [
            {
                q: "Food Fund là gì?",
                a: "Food Fund là một nền tảng gây quỹ cộng đồng chuyên biệt dành cho các hoạt động cung cấp thực phẩm và bữa ăn từ thiện. Chúng tôi kết nối những người gây quỹ tâm huyết với những tấm lòng hảo tâm để cùng nhau xóa đói giảm nghèo và hỗ trợ dinh dưỡng cho những người có hoàn cảnh khó khăn."
            },
            {
                q: "Tôi có thể tin tưởng nền tảng này không?",
                a: "Minh bạch là ưu tiên hàng đầu của chúng tôi. Food Fund yêu cầu mọi chiến dịch giải ngân phải có hóa đơn, chứng từ hợp lệ (Expense Proofs) được đội ngũ admin xét duyệt nghiêm ngặt mới được nhận tiền. Tất cả các giao dịch đều được ghi lại công khai trên hệ thống."
            }
        ]
    },
    {
        category: "Người ủng hộ",
        icon: Heart,
        questions: [
            {
                q: "Làm thế nào để tôi ủng hộ một danh mục/chiến dịch?",
                a: "Bạn chỉ cần chọn chiến dịch mình quan tâm, nhấn nút 'Ủng hộ' và chọn phương thức thanh toán phù hợp (QR Code, chuyển khoản, ví điện tử). Tiền của bạn sẽ được chuyển vào ví của người gây quỹ và chỉ được rút ra khi có minh chứng chi tiêu thực tế."
            },
            {
                q: "Tôi có thể ủng hộ ẩn danh không?",
                a: "Có, khi thực hiện ủng hộ, bạn có thể chọn tùy chọn 'Ủng hộ ẩn danh' để tên của bạn không hiển thị trên danh sách người đóng góp công khai."
            }
        ]
    },
    {
        category: "Tổ chức/Người gây quỹ",
        icon: Wallet,
        questions: [
            {
                q: "Làm sao để tôi tạo một chiến dịch gây quỹ?",
                a: "Bạn cần đăng ký tài khoản, xác minh thông tin cá nhân hoặc tổ chức và nhấn vào 'Tạo chiến dịch'. Sau khi mô tả mục tiêu và kế hoạch chi tiết, đội ngũ admin sẽ xét duyệt chiến dịch của bạn trong vòng 24-48 giờ."
            },
            {
                q: "Làm thế nào để rút tiền từ quỹ đã quyên góp?",
                a: "Bạn không rút tiền mặt trực tiếp. Bạn cần thực hiện 'Yêu cầu giải ngân' kèm theo hóa đơn hoặc bằng chứng thực tế cho các khoản chi tiêu đã liệt kê trong kế hoạch chiến dịch. Admin sẽ phê duyệt và chuyển tiền dựa trên bằng chứng bạn cung cấp."
            }
        ]
    },
    {
        category: "Bảo mật & Chính sách",
        icon: ShieldCheck,
        questions: [
            {
                q: "Thông tin cá nhân của tôi có được bảo mật không?",
                a: "Chúng tôi sử dụng các tiêu chuẩn mã hóa cao nhất để bảo vệ thông tin người dùng. Food Fund cam kết không bao giờ chia sẻ dữ liệu của bạn cho bên thứ ba vì mục đích thương mại."
            },
            {
                q: "Chính sách hoàn tiền như thế nào?",
                a: "Trong trường hợp một chiến dịch bị hủy do không đủ điều kiện hoặc vi phạm chính sách, số tiền đã quyên góp sẽ được hoàn trả lại cho người ủng hộ thông qua ví điện tử trên hệ thống hoặc theo các kênh thanh toán ban đầu."
            }
        ]
    }
];

export default function FAQPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Chung");

    const filteredFaqs = FAQ_DATA.filter(cat =>
        cat.category === activeCategory || searchQuery !== ""
    ).map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden flex flex-col items-center pt-32 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#E77731]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] bg-[#ad4e28]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                            <HelpCircle className="w-4 h-4" />
                            Trung tâm hỗ trợ
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                            Chúng tôi có thể <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">giúp gì cho bạn?</span>
                        </h1>
                    </motion.div>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl mx-auto relative group mt-8"
                    >
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#E77731] transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Tìm câu trả lời cho vấn đề của bạn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 pl-14 pr-6 rounded-[1.5rem] border-white bg-white shadow-2xl shadow-gray-200/50 focus-visible:ring-[#E77731] text-lg border-2 hover:border-gray-100 transition-all"
                        />
                    </motion.div>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Categories Sidebar */}
                    <div className="md:w-1/3">
                        <div className="sticky top-32 space-y-3">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">Danh mục chính</p>
                            {FAQ_DATA.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => {
                                        setActiveCategory(cat.category);
                                        setSearchQuery("");
                                    }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeCategory === cat.category && searchQuery === "" ? 'bg-[#E77731] text-white shadow-lg shadow-[#E77731]/30 translate-x-2' : 'bg-white/50 hover:bg-white text-gray-600 border border-transparent hover:border-gray-100'}`}
                                >
                                    <cat.icon className={`w-5 h-5 ${activeCategory === cat.category && searchQuery === "" ? 'text-white' : 'text-[#E77731]'}`} />
                                    <span className="font-bold">{cat.category}</span>
                                    <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeCategory === cat.category && searchQuery === "" ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
                                </button>
                            ))}

                            <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-[#E77731] to-[#ad4e28] text-white relative overflow-hidden group">
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <MessageCircle className="w-10 h-10 mb-4 opacity-80" />
                                <h4 className="text-xl font-bold mb-2">Vẫn cần hỗ trợ?</h4>
                                <p className="text-white/80 text-sm mb-6 leading-relaxed">Đừng ngần ngại liên hệ trực tiếp với đội ngũ của Food Fund.</p>
                                <Button
                                    onClick={() => router.push('/contact')}
                                    className="w-full h-12 rounded-xl bg-white text-[#ad4e28] hover:bg-gray-50 transform hover:scale-105 transition-all font-bold"
                                >
                                    Liên hệ ngay
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    <div className="md:w-2/3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory + searchQuery}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((cat, catIdx) => (
                                        <div key={catIdx} className="space-y-4">
                                            {searchQuery !== "" && (
                                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-4 mt-8 mb-4">{cat.category}</h3>
                                            )}
                                            <Accordion type="single" collapsible className="space-y-4">
                                                {cat.questions.map((item, idx) => (
                                                    <AccordionItem
                                                        key={idx}
                                                        value={`item-${catIdx}-${idx}`}
                                                        className="border-none bg-white rounded-3xl px-8 shadow-sm hover:shadow-md border border-white hover:border-gray-100 transition-all overflow-hidden"
                                                    >
                                                        <AccordionTrigger className="hover:no-underline py-6 [&[data-state=open]>svg]:rotate-180">
                                                            <span className="text-lg font-bold text-gray-800 pr-4">{item.q}</span>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-base">
                                                            {item.a}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-xl font-bold text-gray-400">Không tìm thấy kết quả nào...</p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="text-[#E77731] font-bold mt-2 hover:underline"
                                        >
                                            Xóa tìm kiếm
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center"
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="group gap-2 text-gray-400 hover:text-[#E77731] font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Trở lại trang chủ
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
