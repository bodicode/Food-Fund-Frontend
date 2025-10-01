"use client";

import { ReactNode } from "react";
import {
  Home,
  Users,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  LogOut,
  HeartHandshake,
  DollarSign,
  ShieldCheck,
  Moon,
  Sun,
  Settings,
  Menu,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeTransition } from "@/lib/theme-transition";
import { useRouter } from "next/navigation";
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

interface AdminLayoutProps {
  children: ReactNode;
}

function SidebarNav() {
  return (
    <nav className="flex-1 p-4 space-y-2">
      <Link
        href="/admin"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Home className="w-5 h-5" /> Dashboard
      </Link>
      <Link
        href="/admin/campaigns"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <HeartHandshake className="w-5 h-5" /> Chiến dịch
      </Link>
      <Link
        href="/admin/categories"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Tag className="w-5 h-5" /> Danh mục chiến dịch
      </Link>
      <Link
        href="/admin/donations"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <DollarSign className="w-5 h-5" /> Quản lý đóng góp
      </Link>
      <Link
        href="/admin/users"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Users className="w-5 h-5" /> Người dùng
      </Link>
      <Link
        href="/admin/reports"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <FileText className="w-5 h-5" /> Báo cáo & Hóa đơn
      </Link>

      <h4 className="mt-6 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase">
        Công cụ
      </h4>
      <Link
        href="/admin/calendar"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Calendar className="w-5 h-5" /> Lịch hoạt động
      </Link>
      <Link
        href="/admin/audit"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ShieldCheck className="w-5 h-5" /> Kiểm duyệt
      </Link>

      <h4 className="mt-6 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase">
        Thống kê
      </h4>
      <Link
        href="/admin/bar"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <BarChart3 className="w-5 h-5" /> Bar Chart
      </Link>
      <Link
        href="/admin/pie"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <PieChart className="w-5 h-5" /> Pie Chart
      </Link>
      <Link
        href="/admin/line"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <LineChart className="w-5 h-5" /> Line Chart
      </Link>
      <Link
        href="/admin/map"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Globe className="w-5 h-5" /> Geography
      </Link>
    </nav>
  );
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

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
    <div className="flex min-h-screen bg-white text-gray-900 dark:bg-[#0f172a] dark:text-gray-200 transition-colors">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 bg-gray-100 dark:bg-[#1e293b] flex-col transition-colors">
        <div className="h-16 flex items-center justify-center border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-xl font-bold text-[#38bdf8]">FoodFund Admin</h1>
        </div>
        <SidebarNav />
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Menu trigger for mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader>
                  <SheetTitle className="p-4 text-xl font-bold text-[#38bdf8]">
                    FoodFund Admin
                  </SheetTitle>
                </SheetHeader>
                <SidebarNav />
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" /> Đăng xuất
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button size="icon" variant="ghost" onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}>
              <Home className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
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
