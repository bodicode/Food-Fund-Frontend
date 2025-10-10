"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>(".footer-col");

      gsap.from(cols, {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      });

      gsap.fromTo(
        ".social-icon",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.from(".footer-separator", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".footer-separator",
          start: "top 95%",
          once: true,
        },
      });

      gsap.from(".footer-copyright", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-copyright",
          start: "top 95%",
          once: true,
        },
      });
    }, footerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === footerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-[#fdf5ea] text-neutral-800 overflow-hidden"
    >
      <div className="container mx-auto px-6 py-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="footer-col space-y-4 md:col-span-2 lg:col-span-1">
          <Image
            src="/images/logo.png"
            alt="FoodFund"
            width={250}
            height={110}
            className="object-cover mb-2 w-[360px] h-[70px] mx-auto lg:mx-0 lg:mb-0"
          />
          <p className="text-neutral-600 max-w-xs md:max-w-full md:text-center lg:text-left">
            Cùng chung tay gây quỹ bữa ăn, lan tỏa lòng nhân ái đến cộng đồng.
          </p>
          <div className="flex flex-row items-center gap-x-4 md:justify-between lg:justify-normal lg:flex-col lg:gap-y-3">
            <div className="flex items-center gap-x-2 lg:mr-auto">
              <h4 className="font-semibold text-sm">Hotline:</h4>
              <p className="text-[#E77731] font-bold text-base">0123123123</p>
            </div>
            <div className="flex gap-3 lg:mr-auto">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map(
                (Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="social-icon p-2 rounded-full bg-white shadow hover:bg-[#E77731] hover:text-white transition"
                  >
                    <Icon size={18} />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-color">
            Về FoodFund
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link href="#">Hướng dẫn gây quỹ</Link>
            </li>
            <li>
              <Link href="#">Câu hỏi thường gặp</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-[#ad4e28]">
            Chính sách
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link href="#">Chính sách cookie</Link>
            </li>
            <li>
              <Link href="#">Chính sách hoàn tiền</Link>
            </li>
            <li>
              <Link href="#">Minh bạch & trách nhiệm</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col md:col-span-2 lg:col-span-1">
          <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-[#ad4e28]">
            Đăng ký nhận tin
          </h4>
          <form className="flex flex-row lg:gap-0">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 rounded-l-md rounded-r-none text-sm focus-visible:ring-[#E77731] md:py-3 md:rounded-md lg:rounded-r-none"
            />
            <Button
              type="submit"
              className="btn-color font-medium rounded-r-md rounded-l-none py-5"
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </div>

      <Separator className="bg-neutral-200 footer-separator" />

      <div className="py-4 text-center text-xs text-neutral-600 footer-copyright">
        © 2025 FoodFund. Địa chỉ: Lô E2a-7, Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú, TPHCM. Thiết kế bởi{" "}
        <span className="text-[#E77731] font-medium">FoodFund Tech Team</span>.
      </div>
    </footer>
  );
}
