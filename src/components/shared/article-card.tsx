"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "../animate-ui/icons/arrow-right";

interface StoryCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date?: string;
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
      whileHover={{ y: -8 }}
      className="cursor-pointer rounded-[2.5rem] overflow-hidden shadow-xl bg-white group h-full flex flex-col border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-900/10"
    >
      {/* Image */}
      <div
        className={`relative w-full ${isLarge ? "flex-1 min-h-[70%]" : "h-[450px]"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col">
        {date && <span className="text-xs text-gray-500 mb-1">{date}</span>}

        <h3
          className={`font-semibold text-gray-800 mb-2 ${isLarge ? "text-2xl line-clamp-2" : "text-lg line-clamp-2"
            }`}
        >
          {title}
        </h3>
        <p
          className={`text-gray-600 ${isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-3"
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
