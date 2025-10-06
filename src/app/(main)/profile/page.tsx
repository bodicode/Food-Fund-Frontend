"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ thêm useSearchParams
import { Button } from "@/components/ui/button";
import { ProfileTab } from "@/components/profile/tabs/profile-tab";
import { CampaignsTab } from "@/components/profile/tabs/campaign-tab";
import { HistoryTab } from "@/components/profile/tabs/history-tab";
import Image from "next/image";
import { toast } from "sonner";
import { graphQLAuthService } from "@/services/auth.service";
import { translateMessage } from "@/lib/translator";
// import { userService } from "@/services/user.service";
import { UserProfile } from "@/types/api/user";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type TabKey = "profile" | "campaigns" | "history";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabKey | null;
    if (tabFromUrl && ["profile", "campaigns", "history"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   userService.getProfile().then((data) => {
  //     if (data) setProfile(data);
  //   });
  // }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await graphQLAuthService.signout(accessToken || "");
      toast.success(translateMessage(res.message));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra";
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
        <p className="text-sm text-gray-500">{profile?.email}</p>
        <p className="text-sm text-gray-500 my-4">
          {profile?.bio || "Thêm mô tả về bạn..."}
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {[
          { key: "profile", label: "Hồ sơ cá nhân" },
          { key: "campaigns", label: "Chiến dịch của tôi" },
          { key: "history", label: "Lịch sử ủng hộ" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            size="sm"
            className={`justify-start text-sm ${activeTab === tab.key
              ? "btn-color hover:text-white hover:opacity-90"
              : "hover:bg-gray-100"
              }`}
            onClick={() => {
              setActiveTab(tab.key as TabKey);
              router.push(`/profile?tab=${tab.key}`);
            }}
          >
            {tab.label}
          </Button>
        ))}
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
