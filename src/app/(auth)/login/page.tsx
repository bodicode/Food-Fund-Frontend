"use client";

import { useState, useLayoutEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../../../components/auth/login-form";
import RegisterForm from "../../../components/auth/register-form";
import { Button } from "../../../components/ui/button";
import Snowfall from "react-snowfall";

export default function Login() {
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");

  const imageRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([imageRef.current, loginRef.current], { xPercent: 0, autoAlpha: 1 });
      gsap.set(registerRef.current, { xPercent: 100, autoAlpha: 0 });
      gsap.set(textRef.current, { autoAlpha: 0, y: 30 });

      gsap
        .timeline({ defaults: { duration: 1, ease: "power3.out" } })
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
    if (!imageRef.current || !loginRef.current || !registerRef.current) return;
    const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.inOut" } });

    if (activeForm === "login") {
      tl.to(imageRef.current, { xPercent: 0, borderRadius: "0 2rem 2rem 0" }, 0)
        .to(loginRef.current, { xPercent: 0, autoAlpha: 1 }, 0)
        .to(registerRef.current, { xPercent: 100, autoAlpha: 0 }, 0);
    } else {
      tl.to(imageRef.current, { xPercent: 100, borderRadius: "2rem 0 0 2rem" }, 0)
        .to(loginRef.current, { xPercent: -100, autoAlpha: 0 }, 0)
        .to(registerRef.current, { xPercent: 0, autoAlpha: 1 }, 0);
    }

    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
    );
  }, [activeForm]);

  const switchToLogin = useCallback(() => setActiveForm("login"), []);
  const switchToRegister = useCallback(() => setActiveForm("register"), []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#f9f0e4]">
      {/* Snowfall Background Effect */}
      <div className="absolute inset-0 pointer-events-none z-[100]">
        <Snowfall
          color="#dee4e7"
          snowflakeCount={150}
          style={{
            opacity: 0.6,
            position: 'fixed',
            width: '100vw',
            height: '100vh',
          }}
        />
      </div>

      <div className="relative w-full h-full flex overflow-hidden">
        {/* ==================== IMAGE + TEXT SECTION ==================== */}
        <div
          ref={imageRef}
          className="hidden lg:block absolute inset-y-0 left-0 lg:w-1/2 will-change-transform z-20 overflow-hidden group bg-[#f9f0e4]"
        >
          <Image
            src="/images/login-register.svg"
            alt="FoodFund Auth"
            fill
            className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="relative w-full max-w-lg backdrop-blur-md bg-white/10 p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ad4e28]/20 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 blur-[80px] rounded-full" />

              <AnimatePresence mode="wait">
                {activeForm === "login" ? (
                  <motion.div
                    key="login-text"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 text-center space-y-4"
                  >
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                      Chào mừng bạn <br />
                      <span className="text-[#f9f0e4]">đến với chúng tôi!</span>
                    </h2>
                    <p className="text-[#f9f0e4]/80 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
                      Nếu đây là lần đầu tiên bạn ghé thăm, hãy tạo ngay tài khoản để khám phá đầy đủ tính năng và cùng chúng tôi bắt đầu hành trình ý nghĩa.
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="link"
                        onClick={switchToRegister}
                        className="group/btn relative text-white font-black uppercase tracking-widest text-[11px] md:text-xs p-0 h-auto"
                      >
                        Đăng ký ngay hôm nay
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white origin-left scale-x-100 group-hover/btn:scale-x-50 transition-transform duration-300" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-text"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 text-center space-y-4"
                  >
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                      Rất vui được <br />
                      <span className="text-[#f9f0e4]">gặp lại bạn!</span>
                    </h2>
                    <p className="text-[#f9f0e4]/80 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
                      Hãy đăng nhập để tiếp tục hành trình, theo dõi tiến trình của bạn và cùng nhau lan tỏa nhiều điều tốt đẹp hơn.
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="link"
                        onClick={switchToLogin}
                        className="group/btn relative text-white font-black uppercase tracking-widest text-[11px] md:text-xs p-0 h-auto"
                      >
                        Đăng nhập để tiếp tục
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white origin-left scale-x-100 group-hover/btn:scale-x-50 transition-transform duration-300" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div
          ref={loginRef}
          className="absolute inset-y-0 right-0 w-full lg:w-1/2 flex items-center justify-center
            will-change-transform z-10 bg-[#f9f0e4]"
        >
          <div className="w-full px-8 lg:px-24">
            <LoginForm onSwitchToRegister={switchToRegister} />
          </div>
        </div>

        <div
          ref={registerRef}
          className="absolute inset-y-0 left-0 w-full lg:w-1/2 flex items-center justify-center
            will-change-transform z-10 bg-[#f9f0e4]"
        >
          <div className="w-full px-8 lg:px-24">
            <RegisterForm onSwitchToLogin={switchToLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
