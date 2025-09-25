"use client";

import { useState, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { graphQLAuthService } from "@/services/auth.service";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const imageRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { xPercent: 0, autoAlpha: 1 });
      gsap.set(loginRef.current, { xPercent: 0, autoAlpha: 1 });
      gsap.set(registerRef.current, { xPercent: 100, autoAlpha: 0 });
      gsap.set(textRef.current, { autoAlpha: 0, y: 30 });

      const intro = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
      });
      intro
        .fromTo(
          imageRef.current,
          { xPercent: -100, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1 },
          0
        )
        .fromTo(
          loginRef.current,
          { xPercent: 100, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1 },
          0.2
        )
        .to(textRef.current, { autoAlpha: 1, y: 0 }, 0.4);
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.inOut" },
    });

    if (!imageRef.current || !loginRef.current || !registerRef.current) return;

    if (isLogin) {
      tl.to(imageRef.current, { xPercent: 0, borderRadius: "0 2rem 2rem 0" }, 0)
        .to(loginRef.current, { xPercent: 0, autoAlpha: 1 }, 0)
        .to(registerRef.current, { xPercent: 100, autoAlpha: 0 }, 0);
    } else {
      tl.to(
        imageRef.current,
        { xPercent: 100, borderRadius: "2rem 0 0 2rem" },
        0
      )
        .to(loginRef.current, { xPercent: -100, autoAlpha: 0 }, 0)
        .to(registerRef.current, { xPercent: 0, autoAlpha: 1 }, 0);
    }

    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
    );
  }, [isLogin]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f9f0e4] text-black">
      <div className="relative w-screen h-screen overflow-hidden">
        <div
          ref={imageRef}
          className="
            hidden md:block
            absolute inset-y-0 left-0
            md:w-1/2 will-change-transform z-20 bg-[#f9f0e4] overflow-hidden
          "
        >
          <Image
            src="/images/login-register.svg"
            alt="FoodFund Auth"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />

          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Chào mừng bạn đến với chúng tôi!
                </h2>
                <p className="text-white/90 mb-6 w-full">
                  Nếu đây là lần đầu tiên bạn ghé thăm, hãy tạo ngay một tài
                  khoản để khám phá đầy đủ tính năng và cùng chúng tôi bắt đầu
                  một hành trình ý nghĩa.
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(false)}
                  className="text-white font-semibold hover:text-[#f9f0e4] cursor-pointer"
                >
                  Đăng ký ngay hôm nay
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Rất vui được gặp lại bạn!
                </h2>
                <p className="text-white/90 mb-6 w-full">
                  Hãy đăng nhập để tiếp tục hành trình, theo dõi tiến trình của
                  bạn và cùng nhau lan tỏa nhiều điều tốt đẹp hơn.
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(true)}
                  className="text-white font-semibold hover:text-[#f9f0e4] cursor-pointer"
                >
                  Đăng nhập để tiếp tục
                </Button>
              </>
            )}
          </div>
        </div>

        <div
          ref={loginRef}
          className="
            absolute inset-y-0 right-0
            w-full md:w-1/2 p-6 flex items-center justify-center
            will-change-transform z-10 bg-[#f9f0e4]
          "
        >
          <div className="max-w-md w-full">
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          </div>
        </div>

        <div
          ref={registerRef}
          className="
            absolute inset-y-0 left-0
            w-full md:w-1/2 p-6 flex items-center justify-center
            will-change-transform z-10 bg-[#f9f0e4]
          "
        >
          <div className="max-w-md w-full">
            <RegisterForm
              authService={graphQLAuthService}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
