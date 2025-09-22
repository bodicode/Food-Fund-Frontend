"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

import "../app/(main)/globals.css";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="text-center space-y-8 px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative flex justify-center"
        >
          <motion.img
            src="https://illustrations.popsy.co/gray/crashed-error.svg"
            alt="404 illustration"
            className="w-72 h-72 drop-shadow-lg"
            initial={{ rotate: -10 }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
          <p className="mt-2 text-lg text-gray-600">
            Oops! Trang bạn tìm kiếm không tồn tại.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="gap-2 px-6 py-5 rounded-full shadow-md hover:shadow-lg transition"
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
