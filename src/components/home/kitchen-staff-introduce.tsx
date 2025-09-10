"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Staff = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

const staffList: Staff[] = [
  {
    id: 1,
    name: "Nguyễn Thị Hoa",
    role: "Bếp trưởng",
    avatar: "/images/avatar.webp",
    bio: "Chị Hoa đã có hơn 10 năm kinh nghiệm nấu ăn cho các chương trình thiện nguyện.",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    role: "Phụ bếp",
    avatar: "/images/avatar.webp",
    bio: "Anh Minh luôn tận tâm chuẩn bị từng phần ăn đầy đủ dinh dưỡng và sạch sẽ.",
  },
  {
    id: 3,
    name: "Lê Thị Hạnh",
    role: "Điều phối",
    avatar: "/images/avatar.webp",
    bio: "Chị Hạnh phụ trách phối hợp tình nguyện viên, đảm bảo quy trình bếp vận hành trơn tru.",
  },
];

export function KitChenStaffIntroduce() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".staff-card");

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14 text-neutral-800">
          Đội ngũ <span className="text-color">nhân viên bếp</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {staffList.map((staff) => (
            <Card
              key={staff.id}
              className="staff-card pt-0 group overflow-hidden rounded-2xl shadow-md bg-white transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Ảnh */}
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={staff.avatar}
                  alt={staff.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </div>

              {/* Nội dung */}
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#ad4e28] group-hover:text-[#E77731] transition">
                  {staff.name}
                </CardTitle>
                <p className="text-sm text-neutral-500">{staff.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {staff.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
