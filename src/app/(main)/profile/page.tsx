"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProfileTab } from "@/components/profile/tabs/profile-tab";
import { CampaignsTab } from "@/components/profile/tabs/campaign-tab";
import { HistoryTab } from "@/components/profile/tabs/history-tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { graphQLAuthService } from "@/services/auth.service";
import { translateMessage } from "@/lib/translator";
import { userService } from "@/services/user.service";
import { UserProfile } from "@/types/api/user";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type TabKey = "profile" | "campaigns" | "history" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    userService.getProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await graphQLAuthService.signout(accessToken || "");

      toast.success(translateMessage(res.message));

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error("Đăng xuất thất bại", { description: errorMessage });
    }
  };

  const Sidebar = (
    <aside className="w-full md:w-80 p-4 rounded-xl bg-white shadow-md h-[80vh] mb-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-[#ad4e28]/40 shadow-md">
          <Image
            src={profile?.avatar_url || "/images/avatar.webp"}
            alt={profile?.full_name || "User avatar"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="mt-3 font-semibold text-gray-800 text-base md:text-lg">
          {profile?.full_name || "Người dùng"}
        </h3>
        <p className="text-sm text-gray-500">
          {profile?.email || "email@example.com"}
        </p>
        <p className="text-sm text-gray-500 my-4">
          {profile?.bio || "Thêm mô tả về bạn..."}
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`justify-start text-sm  ${
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
          size="sm"
          className={`justify-start text-sm  ${
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
          size="sm"
          className={`justify-start text-sm  ${
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
  );

  return (
    <div className="container pt-28 mx-auto grid grid-cols-1 md:grid-cols-[330px_1fr] gap-2">
      <div className="md:hidden flex justify-between items-center px-4 mb-4">
        <h1 className="text-xl font-bold text-color">Mục lục</h1>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader>
              <SheetTitle className="hidden">Menu</SheetTitle>
            </SheetHeader>
            {Sidebar}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">{Sidebar}</div>

      <main className="flex-1 p-4 md:p-6 bg-white rounded-xl">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "campaigns" && <CampaignsTab />}
        {activeTab === "history" && <HistoryTab />}
      </main>
    </div>
  );
}
