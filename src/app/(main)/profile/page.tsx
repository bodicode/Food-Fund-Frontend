"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { ProfileTab } from "@/components/profile/tabs/profile-tab";
import { CampaignsTab } from "@/components/profile/tabs/campaign-tab";
import { HistoryTab } from "@/components/profile/tabs/history-tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/store/slices/auth-slice";
import { graphQLAuthService } from "@/services/auth.service";
import { translateMessage } from "@/lib/translator";

type TabKey = "profile" | "campaigns" | "history" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!accessToken) throw new Error("Không tìm thấy access token");
      const res = await graphQLAuthService.signout(accessToken);

      toast.success(translateMessage(res.message));

      dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";

      toast.error("Đăng xuất thất bại", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="container flex min-h-screen pt-32 mx-auto">
      <aside className="w-64 p-4 rounded-xl mb-3 bg-white shadow-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#ad4e28]/40 shadow-md">
            <Image
              src="/images/avatar.webp"
              alt={user?.name || "User avatar"}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="mt-3 font-semibold text-gray-800">
            {user?.name || "Người dùng"}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.email || "email@example.com"}
          </p>
        </div>

        <h2 className="text-lg font-bold mb-4 text-color">Tài khoản</h2>

        <nav className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className={`justify-start ${
              activeTab === "profile"
                ? "btn-color hover:text-white hover:opacity-90"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Hồ sơ cá nhân
          </Button>

          <Button
            variant="ghost"
            className={`justify-start ${
              activeTab === "campaigns"
                ? "btn-color hover:text-white hover:opacity-90"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("campaigns")}
          >
            Chiến dịch của tôi
          </Button>

          <Button
            variant="ghost"
            className={`justify-start ${
              activeTab === "history"
                ? "btn-color hover:text-white hover:opacity-90"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử ủng hộ
          </Button>
        </nav>

        <div className="mt-6 border-t pt-4">
          <Button
            variant="ghost"
            className="w-full justify-center font-semibold"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "campaigns" && <CampaignsTab />}
        {activeTab === "history" && <HistoryTab />}
      </main>
    </div>
  );
}
