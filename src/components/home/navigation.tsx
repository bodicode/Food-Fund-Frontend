"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Search, Menu, HeartHandshake, Megaphone, Info } from "lucide-react";

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

import { MegaMenu } from "./mega-menu";
import { MobileMegaMenu } from "./mobile-mega-menu";

gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
  const [openSearch, setOpenSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      let lastScroll = 0;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "200 top",
        onUpdate: (self) => {
          if (self.scroll() > 50) {
            gsap.to(headerRef.current, {
              backgroundColor: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              duration: 0.4,
              ease: "power2.out",
            });
          } else {
            gsap.to(headerRef.current, {
              backgroundColor: "rgba(0,0,0,0)",
              backdropFilter: "blur(0px)",
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              duration: 0.4,
              ease: "power2.out",
            });
          }
        },
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(headerRef.current, {
              yPercent: -150,
              opacity: 0,
              duration: 0.5,
              ease: "power3.inOut",
            });
          } else {
            gsap.to(headerRef.current, {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.inOut",
            });
          }
          lastScroll = currentScroll;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2 rounded-2xl transition-colors duration-300"
    >
      <nav className="container mx-auto">
        <div className="hidden lg:flex items-center justify-between h-20 px-6 relative whitespace-nowrap">
          <div className="flex items-center gap-4 text-sm">
            <Dialog open={openSearch} onOpenChange={setOpenSearch}>
              <DialogTrigger asChild>
                <button
                  className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                  <span>Tìm kiếm</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle>Tìm kiếm chiến dịch</DialogTitle>
                <DialogDescription>
                  Nhập từ khóa để tìm kiếm các chiến dịch gây quỹ
                </DialogDescription>

                <div className="flex gap-2">
                  <Input autoFocus placeholder="Tìm kiếm theo tên chiến dịch" />
                  <Button onClick={() => setOpenSearch(false)}>Tìm</Button>
                </div>
              </DialogContent>
            </Dialog>

            <MegaMenu
              label="Ủng hộ"
              description="Khám phá chiến dịch và tổ chức để hỗ trợ"
              icon={<HeartHandshake className="h-5 w-5" />}
              sections={[
                {
                  heading: "Danh mục chiến dịch",
                  items: [
                    {
                      title: "Chiến dịch nổi bật",
                      desc: "Các chiến dịch được cộng đồng quan tâm",
                      href: "/donate/featured",
                    },
                    {
                      title: "Khẩn cấp",
                      desc: "Các trường hợp cần cứu trợ khẩn cấp",
                      href: "/donate/emergency",
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
                    {
                      title: "Trung tâm hỗ trợ",
                      desc: "Hướng dẫn, câu hỏi thường gặp",
                      href: "/help",
                    },
                  ],
                },
              ]}
            />

            <MegaMenu
              label="Gây quỹ"
              description="Tạo và phát triển chiến dịch gây quỹ thành công"
              icon={<Megaphone className="h-5 w-5" />}
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

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Home"
            >
              <Image
                src="/images/logo.png"
                alt="FoodFund Logo"
                width={160}
                height={40}
                className="h-32 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <MegaMenu
              label="Về chúng tôi"
              description="Về FoodFund & các nguồn hỗ trợ"
              icon={<Info className="h-5 w-5" />}
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
                    {
                      title: "Blog & Tin tức",
                      desc: "Câu chuyện tác động & cập nhật",
                      href: "/blog",
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
              href="/login"
              className="text-white hover:opacity-80 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="hover:bg-transparent"
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
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

                <div className="mt-4 space-y-2">
                  <MobileMegaMenu
                    label="Ủng hộ"
                    sections={[
                      {
                        heading: "Danh mục chiến dịch",
                        items: [
                          {
                            title: "Chiến dịch nổi bật",
                            desc: "Các chiến dịch được cộng đồng quan tâm",
                            href: "/donate/featured",
                          },
                          {
                            title: "Khẩn cấp",
                            desc: "Các trường hợp cần cứu trợ khẩn cấp",
                            href: "/donate/emergency",
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
                          {
                            title: "Trung tâm hỗ trợ",
                            desc: "Hướng dẫn, câu hỏi thường gặp",
                            href: "/help",
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
                          {
                            title: "Blog & Tin tức",
                            desc: "Câu chuyện tác động & cập nhật",
                            href: "/blog",
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
                    href="/login"
                    className="block rounded-md px-2 py-2 text-sm hover:bg-accent font-medium"
                  >
                    Đăng nhập
                  </Link>
                </div>

                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Tìm kiếm
                      </Button>
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
