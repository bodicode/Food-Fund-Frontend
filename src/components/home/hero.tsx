"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ticker from "./ticker";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
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
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Hero background ${index}`}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 h-full flex items-center lg:items-end">
          <div className="container mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pb-12 md:pb-16 lg:pb-20">
            <div className="lg:col-span-2">
              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-yellow-300 drop-shadow-2xl">
                &quot;Chia sẻ bữa ăn.
              </h1>

              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-yellow-300 drop-shadow-2xl">
                Gieo mầm hy vọng.&quot;
              </h1>

              <div className="hero-left mt-4 md:mt-6">
                <p className="text-sm md:text-base uppercase text-white/90 font-semibold tracking-wide drop-shadow-lg">
                  FoodFund - chung tay vì cộng đồng
                </p>
              </div>
            </div>

            <div className="hero-right lg:text-right space-y-6">
              <p className="text-white/95 text-sm md:text-base lg:text-lg leading-relaxed drop-shadow-lg">
                Mỗi đóng góp của bạn là một phần ăn được trao đi – đến đúng
                người, đúng lúc. FoodFund kết nối cộng đồng, nhà bếp và tình
                thương để lan toả những điều tốt đẹp.
              </p>

              <Button
                asChild
                size="lg"
                className="px-8 py-6 rounded-full bg-white text-black hover:bg-yellow-300 hover:text-black font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                <Link href="/s">Khám phá chiến dịch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Ticker />
    </>
  );
}
