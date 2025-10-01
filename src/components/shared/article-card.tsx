"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

interface StoryCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date?: string; // 👈 thêm ngày đăng
  variant?: "large" | "default";
}

export default function StoryCard({
  title,
  excerpt,
  image,
  date,
  variant = "default",
}: StoryCardProps) {
  const isLarge = variant === "large";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white group h-full flex flex-col"
    >
      {/* Image */}
      <div
        className={`relative w-full ${isLarge ? "flex-1 min-h-[60%]" : "h-48"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:brightness-90 transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col">
        {/* 👇 Date */}
        {date && <span className="text-xs text-gray-500 mb-1">{date}</span>}

        <h3
          className={`font-semibold text-gray-800 mb-2 ${
            isLarge ? "text-2xl line-clamp-2" : "text-lg line-clamp-2"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-gray-600 ${
            isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-3"
          }`}
        >
          {excerpt}
        </p>
        <span className="mt-3 inline-flex items-center text-sm font-medium text-color nav-hover-btn w-fit">
          Đọc thêm{" "}
          <ArrowRight
            animate
            animateOnView
            animateOnHover
            className="w-4 h-4 inline-block ml-1"
          />
        </span>
      </div>
    </motion.div>
  );
}
