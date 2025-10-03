"use client";

import { motion } from "framer-motion";
import { Building2, HeartHandshake } from "lucide-react";

export default function OrgRegisterPage() {
    return (
        <div className="py-30 flex items-center justify-center">
            <div className="w-full text-center space-y-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-color">
                        Đăng ký mở Tài khoản tổ chức minh bạch
                    </h1>
                    <p className="mt-3 text-gray-600 text-sm max-w-2xl mx-auto">
                        Dành cho tổ chức từ thiện, câu lạc bộ, hoặc nhóm cộng đồng mong muốn gây quỹ và quản lý tài chính minh bạch.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-color-base p-10 relative overflow-hidden w-full rounded-2xl"
                >
                    <div className="flex flex-col items-center space-y-6">
                        <div className="flex space-x-4 text-orange-500">
                            <Building2 size={60} />
                            <HeartHandshake size={60} />
                        </div>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/register/organization"
                            className="px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition"
                        >
                            Đăng ký tài khoản tổ chức
                        </motion.a>

                        <div className="mt-6 text-gray-500 space-y-2">
                            <p>
                                Khi đăng ký, tổ chức cần cung cấp đầy đủ thông tin chi tiết (tên tổ chức, lĩnh vực hoạt động, đại diện pháp lý, …).
                            </p>
                            <p>
                                Ngoài ra, vui lòng nhập danh sách <strong> email của các nhân viên bếp và nhân viên vận chuyển</strong> để đảm bảo quy trình minh bạch và phối hợp thuận tiện.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
