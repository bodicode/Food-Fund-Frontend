"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ticker from "./Ticker";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-left", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hero-left",
          start: "top 80%",
        },
      });

      gsap.from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".hero-title",
          start: "top 80%",
        },
      });

      gsap.from(".hero-right", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hero-right",
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative h-screen w-full bg-black text-white overflow-hidden"
      >
        <Image
          src="/images/hero.png"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
            <div>
              <h1 className="hero-title text-4xl md:text-5xl font-bold leading-tight text-yellow-300 text-nowrap">
                "Chia sẻ bữa ăn.
              </h1>

              <h1 className="hero-title text-4xl md:text-5xl font-bold leading-tight text-yellow-300 text-nowrap">
                Gieo mầm hy vọng."
              </h1>

              <div className="hero-left">
                <p className="text-sm uppercase mt-2 text-white/80">
                  FoodFund - chung tay vì cộng đồng
                </p>
              </div>
            </div>

            <div />

            <div className="hero-right text-right mt-12">
              <p className="text-white/90 text-md mb-6">
                Mỗi đóng góp của bạn là một phần ăn được trao đi – đến đúng
                người, đúng lúc. FoodFund kết nối cộng đồng, nhà bếp và tình
                thương để lan tỏa những điều tốt đẹp.
              </p>

              <Button
                asChild
                size="lg"
                className="px-6 py-2 rounded-full bg-white text-black hover:bg-white/90 transition"
              >
                <Link href="/donate">Khám phá chiến dịch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Ticker />
    </>
  );
}
