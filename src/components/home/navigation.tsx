"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Search } from "@/components/animate-ui/icons/search";
import { MegaMenu } from "@/components/home/mega-menu";
import { MobileMegaMenu } from "@/components/home/mobile-mega-menu";
import { HeartIcon } from "@/components/animate-ui/icons/heart";
import { MessageCircleHeart } from "@/components/animate-ui/icons/message-circle-heart";
import { UsersRound } from "@/components/animate-ui/icons/users-round";
import { Ellipsis } from "@/components/animate-ui/icons/ellipsis";
import { usePathname, useRouter } from "next/navigation";
import { useGsapNavigation } from "@/hooks/useGsapNavigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { logout } from "@/store/slices/auth-slice";
import { USER_ROLES } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  useGsapNavigation(headerRef, pathname);

  const handleLogout = async () => {
    try {
      dispatch(logout());

      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error("Đăng xuất thất bại", { description: errorMessage });
    }
  };

  useEffect(() => {
    if (!headerRef.current) return;

    // Đảm bảo header luôn visible, không thay đổi position
    gsap.set(headerRef.current, { 
      opacity: 1, 
      yPercent: 0,
      clearProps: "y,x,xPercent" // Clear các transform không cần thiết
    });

    // Animate children
    const children = headerRef.current.querySelectorAll("nav .flex > *");
    if (children.length > 0) {
      gsap.fromTo(
        children,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          delay: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-colors duration-300
      ${pathname === "/"
          ? "top-4 text-white bg-transparent w-[92%] max-w-7xl rounded-2xl"
          : "top-0 text-color bg-color-base w-full"
        }
    `}
    >
      <nav className="container mx-auto">
        <div className="hidden lg:flex items-center justify-between h-20 px-6 relative whitespace-nowrap overflow-visible">
          <div className="flex items-center gap-4 text-sm">
            <button
              className="inline-flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/s")}
            >
              <Search
                animateOnHover
                animateOnView
                animateOnTap
                className="mr-2 h-4 w-4"
              />
              <span>Tìm kiếm</span>
            </button>

            <MegaMenu
              label="Ủng hộ"
              description="Khám phá chiến dịch và tổ chức để hỗ trợ"
              icon={
                <HeartIcon
                  className="h-5 w-5"
                  animateOnView
                  animateOnTap
                  animateOnHover
                />
              }
              sections={[
                {
                  heading: "Danh mục chiến dịch",
                  items: [
                    {
                      title: "Các loại chiến dịch",
                      desc: "Khám phá các loại chiến dịch",
                      href: "/discovery",
                    },
                    {
                      title: "Sắp hết hạn",
                      desc: "Các chiến dịch còn dưới 7 ngày",
                      href: "/emergency",
                    },
                    {
                      title: "Các tổ chức nổi bật",
                      desc: "Các tổ chức từ thiện đang hoạt động gây quỹ",
                      href: "/organizations",
                    },
                  ],
                },
                {
                  heading: "Hỗ trợ & định hướng",
                  items: [
                    {
                      title: "Cách ủng hộ",
                      desc: "Các hình thức ủng hộ an toàn & nhanh chóng",
                      href: "/donate/how-to",
                    },
                    {
                      title: "Hành trình yêu thương",
                      desc: "Câu chuyện thực tế từ người nhận hỗ trợ",
                      href: "/journey",
                    },
                  ],
                },
              ]}
            />

            <MegaMenu
              label="Gây quỹ"
              description="Tạo và phát triển chiến dịch gây quỹ thành công"
              icon={
                <MessageCircleHeart
                  animateOnView
                  animateOnTap
                  animateOnHover
                  className="h-5 w-5"
                />
              }
              sections={[
                {
                  heading: "Khởi tạo chiến dịch",
                  items: [
                    {
                      title: "Tạo chiến dịch mới",
                      desc: "Khởi động chiến dịch chỉ trong 2 phút",
                      href: "/start",
                    },
                    {
                      title: "Mẫu chiến dịch",
                      desc: "Chọn mẫu theo mục tiêu: học phí, y tế, bếp ăn...",
                      href: "/start/templates",
                    },
                    {
                      title: "Tính phí & minh bạch",
                      desc: "Chính sách phí và cách đảm bảo minh bạch",
                      href: "/start/pricing",
                    },
                  ],
                },
                {
                  heading: "Tăng trưởng & lan toả",
                  items: [
                    {
                      title: "Mẹo gây quỹ",
                      desc: "Lời khuyên giúp bạn gây quỹ hiệu quả hơn",
                      href: "/start/tips",
                    },
                    {
                      title: "Hợp tác cùng tổ chức",
                      desc: "Gây quỹ cùng với tổ chức từ thiện",
                      href: "/partners",
                    },
                    {
                      title: "Câu chuyện thành công",
                      desc: "Chiến dịch đạt mục tiêu vượt mong đợi",
                      href: "/start/success-stories",
                    },
                  ],
                },
              ]}
            />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="inline-flex items-center cursor-pointer pointer-events-auto"
            >
              <Image
                src="/images/logo.png"
                alt="FoodFund Logo"
                width={160}
                height={40}
                className="h-32 w-auto"
                priority
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <MegaMenu
              label="Về chúng tôi"
              description="Về FoodFund & các nguồn hỗ trợ"
              icon={
                <UsersRound
                  animateOnHover
                  animateOnView
                  animateOnTap
                  className="h-5 w-5"
                />
              }
              align="end"
              sections={[
                {
                  items: [
                    {
                      title: "Về FoodFund",
                      desc: "Sứ mệnh, giá trị và đội ngũ",
                      href: "/about",
                    },
                    {
                      title: "Minh bạch & An toàn",
                      desc: "Quy trình kiểm duyệt, trách nhiệm",
                      href: "/trust-safety",
                    },
                  ],
                },
                {
                  items: [
                    {
                      title: "Trung tâm trợ giúp",
                      desc: "FAQ & hướng dẫn chi tiết",
                      href: "/help",
                    },
                    {
                      title: "Liên hệ",
                      desc: "Hỗ trợ người dùng & đối tác",
                      href: "/contact",
                    },
                    {
                      title: "Tuyển dụng",
                      desc: "Gia nhập đội ngũ FoodFund",
                      href: "/careers",
                    },
                  ],
                },
              ]}
            />

            <Link
              className="px-5 py-2.5 bg-gradient-to-r from-[#E77731] to-[#ad4e28] text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 mx-2"
              href="/register"
            >
              Tạo Chiến dịch
            </Link>

            {!user ? (
              <Link href="/login" className="hover:opacity-80 py-1">
                Đăng nhập
              </Link>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <span className="cursor-pointer hover:opacity-80 py-1">
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  {user.role === USER_ROLES.ADMIN && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="cursor-pointer text-sm py-3"
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer text-sm py-3"
                  >
                    Hồ sơ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile?tab=history")}
                    className="cursor-pointer text-sm py-3"
                  >
                    Lịch sử ủng hộ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer text-sm py-3"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Ellipsis
                  animateOnHover
                  animateOnView
                  animateOnTap
                  className="h-5 w-5 text-color"
                />
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] bg-[#fdf5ea] pt-4">
                <SheetHeader className="p-0 pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center"
                    aria-label="Home"
                  >
                    <Image
                      src="/images/logo.png"
                      alt="FoodFund Logo"
                      width={200}
                      height={40}
                      className="h-12 w-full object-cover"
                      priority
                    />
                  </Link>
                </SheetHeader>

                <div className="mt-4 space-y-2 px-2">
                  <MobileMegaMenu
                    label="Ủng hộ"
                    sections={[
                      {
                        heading: "Danh mục chiến dịch",
                        items: [
                          {
                            title: "Chiến dịch nổi bật",
                            desc: "Các chiến dịch được cộng đồng quan tâm",
                            href: "/discovery",
                          },
                          {
                            title: "Khẩn cấp",
                            desc: "Các trường hợp cần cứu trợ khẩn cấp",
                            href: "/emergency",
                          },
                          {
                            title: "Hỗ trợ cá nhân",
                            desc: "Giúp đỡ người bệnh, trẻ em, người già...",
                            href: "/donate/personal",
                          },
                          {
                            title: "Tổ chức xã hội",
                            desc: "Gây quỹ cho nhóm thiện nguyện, tổ chức phi lợi nhuận",
                            href: "/donate/organizations",
                          },
                        ],
                      },
                      {
                        heading: "Hỗ trợ & định hướng",
                        items: [
                          {
                            title: "Cách ủng hộ",
                            desc: "Các hình thức ủng hộ an toàn & nhanh chóng",
                            href: "/donate/how-to",
                          },
                          {
                            title: "Hành trình yêu thương",
                            desc: "Câu chuyện thực tế từ người nhận hỗ trợ",
                            href: "/donate/stories",
                          },
                        ],
                      },
                    ]}
                  />

                  <MobileMegaMenu
                    label="Gây quỹ"
                    sections={[
                      {
                        heading: "Khởi tạo chiến dịch",
                        items: [
                          {
                            title: "Tạo chiến dịch mới",
                            desc: "Khởi động chiến dịch chỉ trong 2 phút",
                            href: "/start",
                          },
                          {
                            title: "Mẫu chiến dịch",
                            desc: "Chọn mẫu theo mục tiêu: học phí, y tế, bếp ăn...",
                            href: "/start/templates",
                          },
                          {
                            title: "Tính phí & minh bạch",
                            desc: "Chính sách phí và minh bạch",
                            href: "/start/pricing",
                          },
                        ],
                      },
                      {
                        heading: "Tăng trưởng & lan toả",
                        items: [
                          {
                            title: "Mẹo gây quỹ",
                            desc: "Lời khuyên gây quỹ hiệu quả hơn",
                            href: "/start/tips",
                          },
                          {
                            title: "Hợp tác cùng tổ chức",
                            desc: "Gây quỹ với các tổ chức từ thiện",
                            href: "/partners",
                          },
                          {
                            title: "Câu chuyện thành công",
                            desc: "Chiến dịch đạt mục tiêu vượt mong đợi",
                            href: "/start/success-stories",
                          },
                        ],
                      },
                    ]}
                  />

                  <MobileMegaMenu
                    label="Về chúng tôi"
                    sections={[
                      {
                        items: [
                          {
                            title: "Về FoodFund",
                            desc: "Sứ mệnh, giá trị và đội ngũ",
                            href: "/about",
                          },
                          {
                            title: "Minh bạch & An toàn",
                            desc: "Quy trình kiểm duyệt, trách nhiệm",
                            href: "/trust-safety",
                          },
                        ],
                      },
                      {
                        items: [
                          {
                            title: "Trung tâm trợ giúp",
                            desc: "FAQ & hướng dẫn chi tiết",
                            href: "/help",
                          },
                          {
                            title: "Liên hệ",
                            desc: "Hỗ trợ người dùng & đối tác",
                            href: "/contact",
                          },
                          {
                            title: "Tuyển dụng",
                            desc: "Gia nhập đội ngũ FoodFund",
                            href: "/careers",
                          },
                        ],
                      },
                    ]}
                  />

                  <Link
                    className="block px-4 py-3 btn-color font-semibold rounded-lg hover:shadow-lg transition duration-300 text-center text-sm"
                    href="/register"
                  >
                    Tạo Chiến dịch
                  </Link>

                  {!user ? (
                    <Link
                      href="/login"
                      className="block rounded-md px-2 py-2 text-sm hover:bg-accent font-medium"
                    >
                      Đăng nhập
                    </Link>
                  ) : (
                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                      <p className="px-2 text-sm font-semibold text-gray-700">
                        Xin chào, {user.name}
                      </p>
                      {user.role == USER_ROLES.ADMIN ? (
                        <Link href="/admin/users">Dashboard</Link>
                      ) : (
                        ""
                      )}
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer w-full text-left block rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-4">
                        <Search
                          animate
                          animateOnHover
                          animateOnView
                          loop
                          className="mr-2 h-4 w-4"
                        />
                        <span className="text-sm">Tìm kiếm</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogTitle>Tìm kiếm chiến dịch</DialogTitle>
                      <DialogDescription>
                        Nhập từ khóa để tìm kiếm các chiến dịch gây quỹ
                      </DialogDescription>

                      <div className="flex gap-2">
                        <Input
                          autoFocus
                          placeholder="Tìm kiếm theo tên chiến dịch"
                        />
                        <Button>Tìm</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
