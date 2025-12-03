"use client";

import { useEffect, useState, useRef } from "react";
import { walletService, FundraiserWallet } from "@/services/wallet.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Heart, HandCoins, ArrowUpRight } from "lucide-react";

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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

    return <span ref={ref} />;
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
            label: "Tổng số tiền được quyên góp",
            value: Number(systemWallet?.totalIncome || 0),
            icon: Heart,
            color: "text-rose-600",
            bgColor: "bg-rose-100",
            borderColor: "border-rose-200",
            description: "Đã được cộng đồng chung tay đóng góp"
        },
        {
            label: "Đã giải ngân cho các tổ chức",
            value: Number(systemWallet?.totalExpense || 0),
            icon: HandCoins,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            borderColor: "border-emerald-200",
            description: "Đã được chuyển đến các hoàn cảnh khó khăn"
        },
    ];

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Những con số <span className="text-[#E77731]">biết nói</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Minh bạch tài chính là ưu tiên hàng đầu của chúng tôi.
                        Mọi khoản đóng góp và chi tiêu đều được ghi nhận và công khai trên hệ thống.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-bl-full opacity-20 group-hover:scale-110 transition-transform duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} ring-1 ring-inset ${stat.borderColor}`}>
                                        <stat.icon className="w-8 h-8" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>Live data</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-500 font-medium text-lg">{stat.label}</p>
                                    <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stat.color} tracking-tight`}>
                                        <Counter value={stat.value} />
                                    </h3>
                                    <p className="text-gray-400 text-sm pt-2">{stat.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
