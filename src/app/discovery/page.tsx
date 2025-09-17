"use client";

import {
  Utensils,
  Baby,
  School,
  HeartHandshake,
  Home,
  Hospital,
  Mountain,
  Leaf,
  Factory,
  CloudRain,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const categories = [
  {
    title: "Bữa ăn học đường",
    desc: "Hỗ trợ bữa sáng/bữa trưa dinh dưỡng cho học sinh nghèo.",
    icon: School,
  },
  {
    title: "Thực phẩm cho trẻ em suy dinh dưỡng",
    desc: "Sữa, bột, vitamin và bữa ăn cải thiện thể trạng.",
    icon: Baby,
  },
  {
    title: "Bữa cơm cho gia đình khó khăn",
    desc: "Hỗ trợ gạo, nhu yếu phẩm và bữa ăn miễn phí.",
    icon: Home,
  },
  {
    title: "Bếp ăn dã chiến",
    desc: "Bếp ăn cho khu cách ly, vùng thiên tai khẩn cấp.",
    icon: Utensils,
  },
  {
    title: "Bữa ăn ấm áp mùa đông",
    desc: "Suất ăn nóng cho người vô gia cư, dân vùng cao.",
    icon: HeartHandshake,
  },
  {
    title: "Nhu yếu phẩm dài hạn",
    desc: "Cung cấp gạo, mì, nước mắm, dầu ăn định kỳ.",
    icon: Utensils,
  },
  {
    title: "Thực phẩm cho mẹ và bé",
    desc: "Bữa ăn và dinh dưỡng riêng cho phụ nữ mang thai, mẹ bỉm.",
    icon: Baby,
  },
  {
    title: "Suất ăn hỗ trợ viện phí",
    desc: "Bữa ăn giá rẻ/miễn phí trong bệnh viện.",
    icon: Hospital,
  },
  {
    title: "Thực phẩm cho dân tộc thiểu số",
    desc: "Hỗ trợ gạo, thực phẩm cho bản làng xa xôi.",
    icon: Mountain,
  },
  {
    title: "Bữa ăn xanh – lành mạnh",
    desc: "Rau củ quả, thực phẩm sạch cho gia đình khó khăn.",
    icon: Leaf,
  },
  {
    title: "Thực phẩm cứu trợ thiên tai",
    desc: "Gạo, mì, nước sạch cho vùng lũ, bão, thiên tai.",
    icon: CloudRain,
  },
  {
    title: "Hỗ trợ bữa ăn công nhân",
    desc: "Bữa cơm giá rẻ và nhu yếu phẩm cho công nhân.",
    icon: Factory,
  },
];

export default function CampaignCategoriesPage() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;

      const enter = () => {
        gsap.to(card, {
          scale: 1.05,
          rotate: 1.5,
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
          duration: 0.2,
          ease: "power3.out",
        });
      };

      const leave = () => {
        gsap.to(card, {
          scale: 1,
          rotate: 0,
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          duration: 0.2,
          ease: "power3.inOut",
        });
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);

      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      };
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-color mb-4">
          Phân loại chiến dịch
        </h1>
        <p className="text-muted-foreground">
          Chọn danh mục phù hợp để khám phá các chiến dịch gây quỹ cho bữa ăn và
          thực phẩm.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              className="rounded-xl border bg-white p-6 shadow-sm transition group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <Icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition" />
              <h3 className="font-semibold text-lg mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-500">{cat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
