"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "./animate-ui/icons/arrow-right";

interface StoryCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

export default function StoryCard({ title, excerpt, image }: StoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white group"
    >
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-96 object-cover group-hover:brightness-90 transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{excerpt}</p>
        <span className="mt-3 inline-block text-sm font-medium text-color nav-hover-btn">
          Đọc thêm{" "}
          <ArrowRight
            animate
            animateOnView
            animateOnHover
            className="w-4 h-4 inline-block"
          />
        </span>
      </div>
    </motion.div>
  );
}
