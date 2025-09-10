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
      // Image main xuất hiện
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

      // Image overlay xuất hiện
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

      // Progress lines chạy liên tục từ trái sang phải
      gsap.utils.toArray<HTMLElement>(".progress-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { width: "0%" },
          {
            width: "100%",
            duration: 2,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 0.5, // nghỉ chút trước khi reset
            delay: i * 0.5, // line 2 chạy lệch pha so với line 1
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="md:py-10 px-4 bg-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Hình ảnh + info card */}
        <div className="relative flex flex-col gap-y-0 md:flex-row px-2 justify-center md:gap-x-6 md:mb-10 lg:mb-0">
          <div className="image-main relative rounded-2xl overflow-hidden mx-auto">
            <Image
              src="/images/what-we-do-1.jpg"
              alt="Children"
              width={400}
              height={500}
              className="object-cover w-[450px] h-[500px] md:w-[400px] md:h-[550px] lg:w-[400px] lg:h-[540px] xl:w-[430px] xl:h-[600px]"
            />
          </div>

          <div
            className="md:block image-overlay relative mx-auto
              top-0 lg:absolute lg:-top-8 lg:-left-8 xl:-left-18
              rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/what-we-do-2.jpg"
              alt="Child"
              width={400}
              height={500}
              className="object-cover w-[450px] h-[500px] md:w-[400px] md:h-[550px] lg:w-[150px] lg:h-[230px] xl:w-[220px] xl:h-[350px]"
            />
          </div>

          <div
            className="info-card md:absolute -bottom-20 -left-20 md:left-1/4 
             lg:-left-1/2 lg:right-0 lg:translate-x-0 mx-auto
             bg-[#ad4e28] text-white px-3 md:px-4 py-3 sm:py-4 
             rounded-2xl shadow-lg w-full md:max-w-[330px] sm:text-left"
          >
            <h3 className="text-lg sm:text-xl font-bold leading-snug">
              Hơn 186,548 khó khăn cần được hỗ trợ bữa ăn
            </h3>
            <p className="text-xs sm:text-sm mt-4 opacity-90 text-right">
              Hãy trở thành tình nguyện viên ngay
            </p>
          </div>
        </div>

        {/* Text + Steps */}
        <div className="flex-1 space-y-6 text-center lg:text-left mb-4">
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

          {/* Steps với progress line */}
          <div className="text-block mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative">
              {/* Step 1 */}
              <div className="step flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full btn-color text-white flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h4 className="font-semibold text-lg">Chọn chiến dịch</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Lựa chọn chiến dịch mà bạn muốn đồng hành
                </p>
              </div>

              {/* Line 1 */}
              <div className="hidden sm:block flex-1 h-[2px] bg-gray-300 relative">
                <div className="absolute top-0 left-0 h-[2px] btn-color w-0 progress-line"></div>
              </div>

              {/* Step 2 */}
              <div className="step flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full btn-color text-white flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h4 className="font-semibold text-lg">Quyên góp bữa ăn</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Góp phần mang đến bữa ăn dinh dưỡng cho cộng đồng
                </p>
              </div>

              {/* Line 2 */}
              <div className="hidden sm:block flex-1 h-[2px] bg-gray-300 relative">
                <div className="absolute top-0 left-0 h-[2px] btn-color w-0 progress-line"></div>
              </div>

              {/* Step 3 */}
              <div className="step flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full btn-color text-white flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h4 className="font-semibold text-lg">Lan tỏa yêu thương</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Chia sẻ thông điệp, kết nối thêm nhiều tấm lòng
                </p>
              </div>
            </div>
          </div>

          {/* Counter */}
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

          {/* Info cards */}
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

          {/* Hotline */}
          <div className="text-block flex flex-col sm:flex-row items-center gap-4 mt-6">
            <div className="text-center sm:text-left">
              <p className="text-gray-500">
                Gọi cho chúng tôi bất kỳ lúc nào:{" "}
                <span className="font-semibold text-lg underline text-color">
                  +84 123 654 991
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
