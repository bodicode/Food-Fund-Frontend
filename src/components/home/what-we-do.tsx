"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Main image animation
      gsap.from(".image-main", {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Overlay animation
      gsap.from(".image-overlay", {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Floating effect
      gsap.to(".image-main", {
        y: "+=10",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".image-overlay", {
        y: "-=10",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });
      gsap.to(".info-card", {
        y: "+=6",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Text block fade-in
      gsap.from(".text-block", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Counter animation
      const counters = gsap.utils.toArray<HTMLElement>(".counter");
      counters.forEach((counter) => {
        const finalValue = parseInt(counter.dataset.value || "0", 10);
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: finalValue,
            duration: 2.2,
            ease: "power1.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 85%",
            },
            onUpdate: () => {
              counter.innerText = Math.floor(
                Number(counter.innerText)
              ).toLocaleString();
            },
          }
        );
      });

      // Progress line animation
      gsap.utils.toArray<HTMLElement>(".progress-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { width: "0%" },
          {
            width: "100%",
            duration: 2,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 0.5,
            delay: i * 0.5,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lg:pb-20 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative mt-10 lg:flex items-center sm:hidden">
          <div className="relative flex justify-center items-center md:pl-2 mx-auto">
            <div className="relative w-full max-w-[650px]">
              <Image
                src="/images/what-we-do-1.jpg"
                alt="What we do"
                width={550}
                height={600}
                className="image-main object-cover w-[500px] h-auto rounded-2xl"
                priority
              />
            </div>

            {/* Overlay ảnh nhỏ */}
            <div className="absolute -bottom-30 -right-6 sm:-right-10 w-[240px] sm:w-[180px] md:w-[250px]">
              <Image
                src="/images/what-we-do-2.jpg"
                alt="What we do overlay"
                width={200}
                height={260}
                className="image-overlay object-cover w-full h-auto rounded-2xl shadow-xl border-4 border-white"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center lg:text-left my-4">
          <span className="text-block text-color font-semibold tracking-widest uppercase">
            Sứ mệnh của chúng tôi
          </span>

          <h2 className="text-block text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 leading-snug">
            Giúp đỡ những người có hoàn cảnh khó khăn có những bữa ăn ấm bụng
          </h2>

          <p className="text-block text-gray-600 leading-relaxed text-sm sm:text-base">
            Chúng tôi xây dựng các chương trình hỗ trợ cộng đồng, gây quỹ và kết
            nối để mang đến những bữa ăn dinh dưỡng cho người nghèo, trẻ em và
            người già neo đơn. Hành trình này không chỉ là trao tặng thức ăn mà
            còn là chia sẻ tình thương và hy vọng.
          </p>

          <p className="text-block text-gray-700">
            Đã đóng góp cho{" "}
            <span
              className="counter text-color font-semibold text-xl"
              data-value="1000"
            >
              0
            </span>{" "}
            dự án tại{" "}
            <span className="text-color font-semibold">
              Thành phố Hồ Chí Minh
            </span>
            , mang lại bữa ăn cho{" "}
            <span
              className="counter text-color font-semibold text-xl"
              data-value="20000"
            >
              0
            </span>{" "}
            người.
          </p>

          <div className="text-block grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-xl p-4">
              <h4 className="font-bold">Tổ chức uy tín</h4>
              <p className="text-sm text-gray-600">
                Cam kết minh bạch và hỗ trợ cộng đồng bền vững
              </p>
            </div>
            <div className="border rounded-xl p-4">
              <h4 className="font-bold">Bắt đầu quyên góp</h4>
              <p className="text-sm text-gray-600">
                Mỗi đóng góp của bạn đều mang lại bữa ăn và hy vọng
              </p>
            </div>
          </div>

          <div className="w-full text-block flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-6">
            <div className="text-center">
              <p className="text-gray-500">
                Gọi cho chúng tôi bất kỳ lúc nào:{" "}
                <span className="font-semibold text-lg underline text-color">
                  +84 123 654 991
                </span>
              </p>
            </div>
          </div>

          <p className="text-block text-gray-600 leading-relaxed text-sm sm:text-base mt-4">
            Chúng tôi tin rằng mỗi bữa ăn không chỉ là nguồn dinh dưỡng mà còn
            là lời động viên tinh thần. Cùng nhau, chúng ta có thể lan tỏa yêu
            thương, xây dựng một cộng đồng ấm áp và đầy hy vọng.
          </p>
        </div>
      </div>
    </section>
  );
}
