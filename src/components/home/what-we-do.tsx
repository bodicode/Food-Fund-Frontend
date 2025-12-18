"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ShieldCheck, Users, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image animations
      gsap.from(".image-main", {
        opacity: 0,
        x: -50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".image-overlay", {
        opacity: 0,
        y: 50,
        scale: 0.8,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Floating effect
      gsap.to(".image-main", {
        y: "+=15",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".image-overlay", {
        y: "-=15",
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // Text animations
      gsap.from(".text-reveal", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".content-col",
          start: "top 80%",
        },
      });

      // Stats counter animation
      const counters = gsap.utils.toArray<HTMLElement>(".counter");
      counters.forEach((counter) => {
        const finalValue = parseInt(counter.dataset.value || "0", 10);
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: finalValue,
            duration: 2.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 85%",
            },
            onUpdate: function () {
              counter.innerText = Math.floor(
                Number(this.targets()[0].innerText)
              ).toLocaleString();
            },
          }
        );
      });

      // Info cards stagger
      const cards = gsap.utils.toArray<HTMLElement>(".info-card");
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".info-card-container",
              start: "top 90%", // Trigger slightly earlier
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

        {/* Left Column: Images */}
        <div className="relative lg:block hidden h-full">
          <div className="relative z-10 h-full">
            <div className="relative overflow-hidden rounded-[3rem] shadow-2xl w-full h-full min-h-[700px] border-8 border-white/50">
              <Image
                src="/images/what-we-do-1.jpg"
                alt="Community Support"
                fill
                className="image-main object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Floating Badge/Overlay Image */}
            <div className="absolute -bottom-12 -right-8 w-[280px] z-20">
              <div className="image-overlay relative bg-white p-2 rounded-[1.5rem] shadow-xl">
                <div className="relative overflow-hidden rounded-[1.2rem] aspect-[4/3]">
                  <Image
                    src="/images/what-we-do-2.jpg"
                    alt="Helping hands"
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>
                {/* Small stats badge on the overlay */}
                <div className="absolute -top-6 -left-6 bg-[#ad4e28] text-white p-4 rounded-full shadow-lg flex flex-col items-center justify-center w-20 h-20 animate-pulse">
                  <Heart className="w-6 h-6 fill-current mb-0.5" />
                </div>
              </div>
            </div>

            {/* Decorative dots grid */}
            <div className="absolute -z-10 -bottom-10 -left-10 text-[#ad4e28]/20">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" />
                </pattern>
                <rect width="100" height="100" fill="url(#dots)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="content-col flex flex-1 flex-col space-y-8 text-center lg:text-left">

          <div className="space-y-4">
            <div className="text-reveal inline-flex items-center gap-2 justify-center lg:justify-start">
              <span className="h-px w-8 bg-[#ad4e28]"></span>
              <span className="text-[#ad4e28] font-bold tracking-widest uppercase text-sm">
                Sứ mệnh của chúng tôi
              </span>
            </div>

            <h2 className="text-reveal text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] text-center">
              Mang đến <span className="text-[#ad4e28] relative inline-block">
                bữa ăn ấm
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5 L 100 0 Q 50 5 0 0 Z" fill="currentColor" />
                </svg>
              </span> <br className="hidden lg:block" />
              trao đi tình yêu thương
            </h2>

            <p className="text-reveal text-gray-600 leading-relaxed text-base text-center sm:text-lg max-w-full mx-auto lg:mx-0">
              Chúng tôi xây dựng các chương trình hỗ trợ cộng đồng, gây quỹ và kết nối
              để mang đến những bữa ăn dinh dưỡng cho người nghèo, trẻ em và người già neo đơn.
              Mỗi hành động nhỏ đều góp phần tạo nên thay đổi lớn.
            </p>
          </div>

          {/* Stats Section */}
          <div className="text-reveal py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 w-fit mx-auto">
              <div className="px-6 py-2 sm:py-0 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-[#ad4e28]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="counter block text-2xl font-bold text-gray-900" data-value="1000">0</span>
                  <span className="text-sm text-gray-500 font-medium">Dự án đã thực hiện</span>
                </div>
              </div>
              <div className="px-6 py-2 sm:py-0 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="counter block text-2xl font-bold text-gray-900" data-value="20000">0</span>
                  <span className="text-sm text-gray-500 font-medium">Người được hỗ trợ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="info-card-container grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-[#ad4e28] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Minh bạch 100%</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Mọi khoản đóng góp đều được công khai và báo cáo chi tiết.</p>
              </div>
            </div>

            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Cộng đồng lớn</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Kết nối hàng triệu trái tim nhân ái trên khắp cả nước.</p>
              </div>
            </div>

            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-green-50/50 border border-green-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Hỗ trợ tận nơi</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Đội ngũ tình nguyện viên có mặt kịp thời tại điểm nóng.</p>
              </div>
            </div>

            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Lan tỏa yêu thương</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Chia sẻ câu chuyện và truyền cảm hứng sống đẹp.</p>
              </div>
            </div>

            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">An toàn tuyệt đối</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Bảo mật thông tin và giao dịch được mã hóa 100%.</p>
              </div>
            </div>

            <div className="info-card flex items-start gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Công nghệ 4.0</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Quyên góp dễ dàng qua QR, Ví điện tử chỉ 1 chạm.</p>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="text-reveal pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-[#ad4e28]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Hotline hỗ trợ 24/7</span>
                <span className="font-bold text-lg text-gray-900 group-hover:text-[#ad4e28] transition-colors">+84 123 654 991</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
