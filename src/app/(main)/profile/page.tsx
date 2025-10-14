"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Menu,
  User as UserIcon,
  HeartHandshake,
  History as HistoryIcon,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileTab } from "@/components/profile/tabs/profile-tab";
import { CampaignsTab } from "@/components/profile/tabs/campaign-tab";
import { HistoryTab } from "@/components/profile/tabs/history-tab";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { graphQLAuthService } from "@/services/auth.service";
import { translateMessage } from "@/lib/translator";
import { UserProfile } from "@/types/api/user";
import { userService } from "@/services/user.service";

type TabKey = "profile" | "campaigns" | "history";

const SidebarContent = ({
  profile,
  activeTab,
  onNavigate,
  onLogout,
}: {
  profile: UserProfile | null;
  activeTab: TabKey;
  onNavigate: (key: TabKey) => void;
  onLogout: () => void;
}) => {
  const navItems = [
    { key: "profile", label: "Hồ sơ cá nhân", icon: UserIcon },
    { key: "campaigns", label: "Chiến dịch của tôi", icon: HeartHandshake },
    { key: "history", label: "Lịch sử ủng hộ", icon: HistoryIcon },
  ];

  return (
    <aside className="w-full flex flex-col h-full bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col items-center text-center p-4 border-b">
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-offset-2 ring-[#ad4e28]/50">
          <Image
            src="/images/avatar.webp"
            alt={profile?.full_name || "User avatar"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="mt-4 font-bold text-lg text-gray-800">
          {profile?.full_name || "Đang tải..."}
        </h3>
        <p className="text-sm text-gray-500 truncate w-full">
          {profile?.email}
        </p>
      </div>

      <nav className="flex flex-col gap-2 mt-4 flex-grow">
        {navItems.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className={`justify-start items-center gap-3 px-3 text-base ${activeTab === tab.key
              ? "bg-[#ad4e28] text-white hover:bg-[#ad4e28]/90 hover:text-white"
              : "hover:bg-gray-100 text-gray-700"
              }`}
            onClick={() => onNavigate(tab.key as TabKey)}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </Button>
        ))}
      </nav>

      <div className="mt-6 border-t pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start items-center gap-3 px-3 text-base text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

const SidebarSkeleton = () => (
  <div className="w-full bg-white rounded-xl shadow-sm p-4 animate-pulse">
    <div className="flex flex-col items-center p-4 border-b">
      <div className="w-24 h-24 rounded-full bg-gray-200"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mt-4"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
    </div>
    <div className="flex flex-col gap-3 mt-4">
      <div className="h-10 w-full bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
    <div className="mt-6 border-t pt-4">
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const TABS = useMemo(
    () => ({
      profile: { component: <ProfileTab />, title: "Hồ sơ cá nhân" },
      campaigns: { component: <CampaignsTab />, title: "Chiến dịch của tôi" },
      history: { component: <HistoryTab />, title: "Lịch sử ủng hộ" },
    }),
    []
  );

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabKey | null;
    if (tabFromUrl && TABS[tabFromUrl]) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, TABS]);

  const handleNavigate = (key: TabKey) => {
    setActiveTab(key);
    router.push(`/profile?tab=${key}`);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await graphQLAuthService.signout(accessToken || "");
      toast.success(translateMessage(res.message));
      localStorage.clear();
      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error("Đăng xuất thất bại", { description: errorMessage });
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await userService.getMyProfile();
        if (mounted) setProfile(me);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sidebarProps = {
    profile,
    activeTab,
    onNavigate: handleNavigate,
    onLogout: handleLogout,
  };

  return (
    <div className="container mx-auto max-w-7xl pt-24 md:pt-28 pb-10 px-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:hidden flex justify-between items-center px-4 col-span-1">
          <h1 className="text-xl font-bold text-[#ad4e28]">
            {TABS[activeTab].title}
          </h1>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-[300px] bg-transparent border-none shadow-none"
            >
              <SidebarContent {...sidebarProps} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          {loadingProfile ? (
            <SidebarSkeleton />
          ) : (
            <SidebarContent {...sidebarProps} />
          )}
        </div>

        <main className="md:col-span-8 lg:col-span-9">
          <div className="bg-white min-h-[60vh]">
            {TABS[activeTab].component}
          </div>
        </main>
      </div>
    </div>
  );
}
