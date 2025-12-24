"use client";

import { useEffect, useState, useRef } from "react";
import { walletService, FundraiserWallet } from "../../services/wallet.service";
import { formatCurrency } from "../../lib/utils/currency-utils";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Heart, HandCoins, ArrowUpRight, ShieldCheck, Activity, Globe } from "lucide-react";
import { Button } from "../../components/ui/button";
import Link from "next/link";

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 40, stiffness: 80 });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = formatCurrency(Number(latest.toFixed(0)));
            }
        });
    }, [springValue]);

    return <span ref={ref} className="tabular-nums" />;
}

export function PlatformStats() {
    const [systemWallet, setSystemWallet] = useState<FundraiserWallet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemWallet = async () => {
            try {
                const data = await walletService.getSystemWallet();
                setSystemWallet(data);
            } catch (error) {
                console.error("Failed to fetch system wallet:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSystemWallet();
    }, []);

    if (loading) return null;

    const stats = [
        {
            label: "Cộng đồng quyên góp",
            value: Number(systemWallet?.totalIncome || 0),
            icon: Heart,
            color: "text-rose-600",
            accent: "from-rose-500/20 to-rose-500/0",
            iconBg: "bg-rose-50 text-rose-600 border-rose-100",
            description: "Tổng nguồn vốn được đóng góp từ những tấm lòng vàng khắp cả nước."
        },
        {
            label: "Đã giải ngân hỗ trợ",
            value: Number(systemWallet?.totalExpense || 0),
            icon: HandCoins,
            color: "text-emerald-600",
            accent: "from-emerald-500/20 to-emerald-500/0",
            iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            description: "Kinh phí đã được chuyển trực tiếp đến các dự án nuôi em & bếp ăn."
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.4]" />
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-100/40 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-50/40 blur-[120px] rounded-full" />
            </div>

            <div className="mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-10 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100/50 text-[#E77731] text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Minh bạch tuyệt đối
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1]"
                    >
                        Số liệu <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ad4e28] to-[#E77731]">thực tế </span>
                        từ hệ thống
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Mọi giao dịch đều được ghi nhận trực tiếp trên sổ cái hệ thống,
                        đảm bảo tính xác thực và niềm tin trọn vẹn từ nhà hảo tâm.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-[1440px] mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 to-transparent rounded-[2.5rem] blur-sm group-hover:blur-md transition-all duration-500 opacity-50" />

                            <div className="relative bg-white/80 backdrop-blur-xl border border-white p-6 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(173,78,40,0.08)]">
                                {/* Accent Highlight */}
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] -translate-y-1/2 translate-x-1/2`} />

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-16 h-16 rounded-2xl ${stat.iconBg} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ring-4 ring-transparent group-hover:ring-white/50`}>
                                            <stat.icon className="w-8 h-8" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Cập nhật trực tiếp</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-gray-400 font-bold uppercase tracking-[0.1em] text-xs lg:text-sm">{stat.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black ${stat.color} tracking-tighter`}>
                                                <Counter value={stat.value} />
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-500/80 font-medium leading-relaxed max-w-sm">
                                        {stat.description}
                                    </p>

                                    <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden">
                                                    <div className={`w-full h-full ${['bg-orange-200', 'bg-blue-200', 'bg-rose-200'][i - 1]}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Tin dùng bởi hàng ngàn người</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 pt-12 border-t border-gray-100"
                >
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#E77731] group-hover:text-white transition-colors duration-300">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-900 transition-colors">Thời gian thực</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#E77731] group-hover:text-white transition-colors duration-300">
                            <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-900 transition-colors">Toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#E77731] group-hover:text-white transition-colors duration-300">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-900 transition-colors">Bảo mật</span>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <Link href="/platform-transactions">
                        <Button size="lg" className="h-14 px-10 rounded-full bg-[#ad4e28] hover:bg-[#8f4021] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#ad4e28]/20 group transition-all duration-300 hover:scale-105">
                            Tra cứu minh bạch tài chính
                            <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

