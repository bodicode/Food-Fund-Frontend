"use client";

import { ComponentType, ReactNode, SVGProps, useState } from "react";
import {
  Home,
  Users,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  HeartHandshake,
  DollarSign,
  ShieldCheck,
  Menu,
  Tag,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeTransition } from "@/lib/theme-transition";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/auth-slice";
import { toast } from "sonner";
import { LogOutIcon } from "@/components/animate-ui/icons/log-out";
import { MoonIcon } from "@/components/animate-ui/icons/moon";
import { SunIcon } from "@/components/animate-ui/icons/sun";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminLayoutProps {
  children: ReactNode;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(true);

  const isActive = (path: string) => pathname === path;

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    children: ReactNode;
  }) => (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        isActive(href)
          ? "bg-[#38bdf8] text-white shadow-lg shadow-[#38bdf8]/30"
          : "hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
      )}
    >
      {isActive(href) && (
        <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
      )}
      <Icon
        className={cn(
          "w-5 h-5 transition-transform group-hover:scale-110",
          isActive(href) ? "text-white" : "text-gray-500 dark:text-gray-400"
        )}
      />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <NavLink href="/admin" icon={Home}>
        Dashboard
      </NavLink>
      <NavLink href="/admin/campaigns" icon={HeartHandshake}>
        Chiến dịch
      </NavLink>
      <NavLink href="/admin/categories" icon={Tag}>
        Danh mục
      </NavLink>
      <NavLink href="/admin/donations" icon={DollarSign}>
        Đóng góp
      </NavLink>
      <NavLink href="/admin/users" icon={Users}>
        Người dùng
      </NavLink>
      <NavLink href="/admin/reports" icon={FileText}>
        Báo cáo
      </NavLink>

      <div className="pt-4">
        <button
          onClick={() => setToolsOpen(!toolsOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span>Công cụ</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              toolsOpen ? "rotate-180" : ""
            )}
          />
        </button>
        {toolsOpen && (
          <div className="space-y-1 mt-1">
            <NavLink href="/admin/calendar" icon={Calendar}>
              Lịch hoạt động
            </NavLink>
            <NavLink href="/admin/audit" icon={ShieldCheck}>
              Kiểm duyệt
            </NavLink>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={() => setStatsOpen(!statsOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span>Thống kê</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              statsOpen ? "rotate-180" : ""
            )}
          />
        </button>
        {statsOpen && (
          <div className="space-y-1 mt-1">
            <NavLink href="/admin/bar" icon={BarChart3}>
              Bar Chart
            </NavLink>
            <NavLink href="/admin/pie" icon={PieChart}>
              Pie Chart
            </NavLink>
            <NavLink href="/admin/line" icon={LineChart}>
              Line Chart
            </NavLink>
            <NavLink href="/admin/map" icon={Globe}>
              Geography
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      toast.error("Có lỗi xảy ra khi đăng xuất");
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors">
      <aside className=" hidden lg:flex w-64 bg-white dark:bg-[#1e293b] flex-col fixed h-screen border-r border-gray-200 dark:border-gray-700 shadow-lg transition-colors overflow-hidden">
        <Image
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
          src="/images/logo.png"
          alt="FoodFund"
          width={250}
          height={110}
          className="object-cover mb-2 w-[360px] h-[70px] mx-auto lg:mx-0 lg:mb-0"
        />

        <SidebarNav />

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-3 justify-start hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            onClick={handleLogout}
          >
            <LogOutIcon
              animate
              animateOnHover
              animateOnTap
              className="w-5 h-5"
            />
            <span className="font-medium">Đăng xuất</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-50 transition-colors backdrop-blur-sm bg-white/95 dark:bg-[#1e293b]/95">
          <div className="flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0 bg-white dark:bg-[#1e293b]"
              >
                <SheetHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#38bdf8]/10 to-[#0ea5e9]/10">
                  <SheetTitle className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] rounded-lg flex items-center justify-center shadow-lg">
                      <HeartHandshake className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
                      FoodFund
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <SidebarNav onNavigate={() => setSheetOpen(false)} />
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-3 justify-start hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOutIcon
                      animate
                      animateOnHover
                      animateOnTap
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Đăng xuất</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              title="Về trang chủ"
            >
              <Home className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
            >
              {theme === "dark" ? (
                <SunIcon
                  animate
                  animateOnHover
                  animateOnView
                  className="w-5 h-5 text-yellow-500"
                />
              ) : (
                <MoonIcon
                  animate
                  animateOnHover
                  animateOnView
                  className="w-5 h-5 text-gray-700"
                />
              )}
            </Button>

            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <LogOutIcon
                animate
                animateOnHover
                animateOnTap
                className="w-5 h-5"
              />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <ThemeTransition>{children}</ThemeTransition>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}
