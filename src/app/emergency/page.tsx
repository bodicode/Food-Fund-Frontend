"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CampaignCard } from "@/components/campaign-card";

type Campaign = {
  id: string;
  title: string;
  image: string;
  raised: number;
  goal: number;
  deadline: string;
};

const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Bữa cơm khẩn cấp cho trẻ em vùng cao",
    image: "/images/what-we-do-2.jpg",
    raised: 3500,
    goal: 5000,
    deadline: "2025-09-25",
  },
  {
    id: "2",
    title: "Thực phẩm cho bà con vùng lũ",
    image: "/images/what-we-do-2.jpg",
    raised: 7200,
    goal: 10000,
    deadline: "2025-09-23",
  },
  {
    id: "3",
    title: "Nấu 1000 suất ăn cho bệnh viện",
    image: "/images/what-we-do-2.jpg",
    raised: 2100,
    goal: 4000,
    deadline: "2025-09-22",
  },
];

export default function EmergencyPage() {
  return (
    <div className="flex flex-col pb-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-[70vh] flex items-center justify-center text-center text-white"
      >
        <Image
          src="/images/emergency-hero.png"
          alt="Emergency support"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Các chiến dịch khẩn cấp
          </h1>
          <p className="text-lg drop-shadow-md">
            Những chiến dịch gần đến hạn, cần sự hỗ trợ ngay để mang bữa ăn đến
            cộng đồng.
          </p>
        </div>
      </motion.section>

      {/* List */}
      <section className="-mt-24 px-6 md:px-16 relative z-20">
        <div className="grid gap-8 md:grid-cols-3">
          {campaigns.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2 * idx,
                ease: "easeOut",
              }}
            >
              <CampaignCard
                id={Number(c.id)}
                title={c.title}
                image={c.image}
                donations={Math.floor(c.raised / 1000)}
                raised={c.raised}
                goal={c.goal}
                progress={(c.raised / c.goal) * 100}
                deadline={c.deadline}
                isEmergency
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
