"use client";

import { Button } from "../components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Home, Search, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

import "../app/(main)/globals.css";

export default function NotFound() {
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effect for the illustration
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <div
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#fefcf8]"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[#E77731]/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 120, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-[#ad4e28]/10 blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#E77731]/20 to-transparent blur-3xl" />

          <div className="flex flex-col items-center text-center space-y-8">
            {/* Illustration Section */}
            <motion.div
              style={{ rotateX, rotateY, perspective: 1000 }}
              className="relative cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-[#E77731]/5 blur-2xl" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              >
                <Image
                  src="https://illustrations.popsy.co/gray/crashed-error.svg"
                  alt="404 illustration"
                  width={288}
                  height={288}
                  className="w-56 h-56 md:w-72 md:h-72 drop-shadow-2xl relative z-10"
                  priority
                />
              </motion.div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white shadow-xl"
              >
                <UtensilsCrossed className="w-6 h-6 text-[#E77731]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 -left-8 p-3 rounded-2xl bg-white shadow-xl"
              >
                <Search className="w-6 h-6 text-[#ad4e28]" />
              </motion.div>
            </motion.div>

            {/* Text Section */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase">
                  Error 404
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                  Ồ! Có gì đó <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">sai sai</span> ở đây
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mx-auto max-w-md text-base md:text-lg text-gray-600 leading-relaxed"
              >
                Trang bạn đang tìm kiếm có vẻ như đã đi lạc khỏi bếp của Food Fund. Hãy thử quay lại trang trước hoặc về trang chủ nhé!
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.back()}
                className="group relative h-14 w-full sm:w-auto min-w-[200px] overflow-hidden rounded-2xl bg-white px-8 transition-all hover:bg-gray-50 border-2 border-gray-100 hover:border-[#E77731]/30"
              >
                <motion.div className="flex items-center justify-center gap-2 font-bold text-gray-700">
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span>Quay lại ngay</span>
                </motion.div>
              </Button>

              <Button
                size="lg"
                onClick={() => router.push("/")}
                className="group relative h-14 w-full sm:w-auto min-w-[200px] overflow-hidden rounded-2xl bg-[#E77731] px-8 shadow-[0_10px_20px_-5px_rgba(231,119,49,0.4)] transition-all hover:bg-[#d16629] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-2 font-bold text-white">
                  <Home className="w-5 h-5" />
                  <span>Về trang chủ</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          Cần hỗ trợ? <a href="#" className="underline hover:text-[#E77731] transition-colors">Liên hệ với chúng tôi</a>
        </motion.p>
      </div>
    </div>
  );
}
