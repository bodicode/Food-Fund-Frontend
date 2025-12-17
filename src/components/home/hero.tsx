"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import Ticker from "./ticker";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/images/hero.png",
    "/images/hero-1.png",
    "/images/hero-bg-3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
        .from(".hero-title", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2
        }, "-=0.4")
        .from(".hero-desc", {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, "-=0.6")
        .from(".hero-btn", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.15
        }, "-=0.6");

      gsap.to(".scroll-indicator", {
        y: 10,
        opacity: 0.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative h-[100vh] min-h-[600px] w-full overflow-hidden bg-gray-900"
      >
        {/* Dynamic Background Slider */}
        <div className="absolute inset-0 z-0">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={img}
                alt={`Hero background ${index}`}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />
              {/* Gradient Overlays for Readability and Depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center">
          <div className="max-w-4xl space-y-6 md:space-y-8 mt-10">

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white w-fit shadow-lg shadow-black/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs md:text-sm font-semibold tracking-wide uppercase text-green-300">Nền tảng gây quỹ thức ăn minh bạch</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight drop-shadow-lg">
                Chia sẻ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ff9f65]">bữa ăn</span>,
              </h1>
              <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight drop-shadow-lg">
                Gieo mầm <span className="text-white relative inline-block">
                  hy vọng
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#E77731]/80 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 0 Q 50 5 0 0 Z" fill="currentColor" />
                  </svg>
                </span>.
              </h1>
            </div>

            {/* Subheadline/Description */}
            <p className="hero-desc text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl font-light drop-shadow-md">
              Kết nối hàng ngàn tấm lòng hảo tâm để mang đến những bữa ăn dinh dưỡng cho người cần giúp đỡ.
              Minh bạch - Tận tâm - Lan tỏa yêu thương.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="hero-btn h-12 md:h-14 px-8 rounded-full bg-[#E77731] hover:bg-[#d0601b] text-white font-bold text-base md:text-lg shadow-lg shadow-[#E77731]/30 transition-all hover:scale-105 active:scale-95 border-0"
              >
                <Link href="/s" className="flex items-center gap-2">
                  Quyên góp ngay
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="hero-btn h-12 md:h-14 px-8 rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white hover:text-black hover:border-white font-semibold text-base md:text-lg backdrop-blur-sm transition-all active:scale-95"
              >
                <Link href="/about" className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Về chúng tôi
                </Link>
              </Button>
            </div>

            {/* Stats/Trust Indicators (Optional Small Addition) */}
            <div className="hero-desc flex items-center gap-6 pt-4 text-white/80 text-sm font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-900 overflow-hidden relative">
                    {/* Fallback avatar colors to mimic users */}
                    <div className={`absolute inset-0 ${['bg-red-300', 'bg-blue-300', 'bg-yellow-300', 'bg-green-300'][i - 1]}`}></div>
                  </div>
                ))}
              </div>
              <div>
                <span className="font-bold text-white">1,000+</span> nhà hảo tâm đã tham gia
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center gap-2 scroll-indicator cursor-pointer">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">Khám phá</span>
          <div className="p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      <Ticker />
    </>
  );
}
