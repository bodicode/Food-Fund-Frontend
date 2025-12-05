"use client";

import { Suspense } from "react";
import { ProfileTab } from "@/components/profile/tabs/profile-tab";
import { Loader } from "@/components/animate-ui/icons/loader";

export default function AdminProfilePage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto mt-14">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý hồ sơ
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Xem và chỉnh sửa thông tin cá nhân của bạn
                    </p>
                </div>

                {/* Profile Content */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center py-20">
                                <Loader className="w-8 h-8" animate animateOnView loop />
                            </div>
                        }
                    >
                        <ProfileTab />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
