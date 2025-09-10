"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Post = {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: { name: string; avatar: string };
  date: string;
  readingMinutes: number;
  featured?: boolean;
};

const posts: Post[] = [
  {
    id: "1",
    title: "Hành trình mang 5.000 suất ăn đến vùng lũ chỉ trong 72 giờ",
    excerpt:
      "Nhóm tình nguyện đã dựng bếp dã chiến, kết nối nhà hảo tâm và phân tuyến phát đồ ăn an toàn trong mưa lũ…",
    cover: "/images/what-we-do-2.jpg",
    category: "Câu chuyện",
    author: { name: "Lan Anh", avatar: "/images/what-we-do-1.jpg" },
    date: "2025-08-21",
    readingMinutes: 6,
    featured: true,
  },
  {
    id: "2",
    title: "Checklist tổ chức bếp ăn thiện nguyện an toàn & hiệu quả",
    excerpt:
      "Từ khâu nguyên liệu, lưu mẫu, vận chuyển đến quản trị nhân lực: bộ khung vận hành thực chiến cho nhóm thiện nguyện.",
    cover: "/images/what-we-do-1.jpg",
    category: "Hướng dẫn",
    author: { name: "Quốc Bảo", avatar: "/images/what-we-do-2.jpg" },
    date: "2025-08-10",
    readingMinutes: 8,
  },
  {
    id: "3",
    title: "Khi bữa trưa trở thành động lực đến trường",
    excerpt:
      "Một phần ăn ấm nóng thay đổi tỉ lệ đi học đều đặn như thế nào ở điểm trường vùng cao.",
    cover: "/images/what-we-do-2.jpg",
    category: "Tác động",
    author: { name: "Minh Tú", avatar: "/images/what-we-do-1.jpg" },
    date: "2025-07-30",
    readingMinutes: 4,
  },
  {
    id: "4",
    title: "Bên trong kho trung chuyển 10 tấn thực phẩm mỗi tuần",
    excerpt:
      "Theo chân đội kho: phân loại – đóng gói – lập tuyến – bàn giao trong 3 tiếng đồng hồ.",
    cover: "/images/what-we-do-1.jpg",
    category: "Hậu trường",
    author: { name: "Yến Nhi", avatar: "/images/what-we-do-2.jpg" },
    date: "2025-07-15",
    readingMinutes: 5,
  },
  {
    id: "5",
    title: "5 mẹo chụp ảnh hiện trường vừa đẹp vừa kể chuyện",
    excerpt:
      "Sử dụng ánh sáng tự nhiên, góc chụp kể chuyện và nguyên tắc 3 lớp để ghi lại khoảnh khắc chạm tim.",
    cover: "/images/what-we-do-2.jpg",
    category: "Hướng dẫn",
    author: { name: "Thái Sơn", avatar: "/images/what-we-do-1.jpg" },
    date: "2025-06-28",
    readingMinutes: 3,
  },
  {
    id: "6",
    title: "Checklist tổ chức bếp ăn thiện nguyện an toàn & hiệu quả",
    excerpt:
      "Từ khâu nguyên liệu, lưu mẫu, vận chuyển đến quản trị nhân lực: bộ khung vận hành thực chiến cho nhóm thiện nguyện.",
    cover: "/images/what-we-do-1.jpg",
    category: "Hướng dẫn",
    author: { name: "Quốc Bảo", avatar: "/images/what-we-do-2.jpg" },
    date: "2025-08-10",
    readingMinutes: 8,
  },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function BlogSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Header animation - nhẹ hơn và mượt hơn
      gsap.fromTo(
        ".blog-head",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-head",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Featured image animation - subtle reveal
      const featuredImg = document.querySelector<HTMLElement>(
        ".featured .parallax-img"
      );
      if (featuredImg) {
        gsap.fromTo(
          featuredImg,
          { scale: 1.08, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuredImg.closest(".featured") as Element,
              start: "top 75%",
              once: true,
            },
          }
        );
      }

      // Blog cards animation - staggered và nhẹ hơn
      ScrollTrigger.batch(".blog-card", {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch as Element[],
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              stagger: { each: 0.08, from: "start" },
            }
          );
        },
        onLeaveBack: (batch) => {
          gsap.to(batch as Element[], {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        },
      });

      // Parallax effect - nhẹ hơn
      document
        .querySelectorAll<HTMLElement>(".parallax-card")
        .forEach((card) => {
          const img = card.querySelector<HTMLElement>(".parallax-img");
          if (!img) return;

          if (!prefersReduced) {
            gsap.to(img, {
              yPercent: -6, // Giảm từ -10 xuống -6
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5, // Thêm scrub để mượt hơn
              },
            });
          }

          // Hover effect - subtle hơn
          const move = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(img, {
              xPercent: x * 3, // Giảm từ 5 xuống 3
              yPercent: y * 3,
              scale: 1.02, // Giảm từ 1.04 xuống 1.02
              duration: 0.3,
              ease: "power2.out",
            });
          };
          const leave = () =>
            gsap.to(img, {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          card.addEventListener("mousemove", move);
          card.addEventListener("mouseleave", leave);
        });

      // Magnetic effect - nhẹ hơn
      const magnets = gsap.utils.toArray<HTMLElement>(".magnetic");
      magnets.forEach((m) => {
        const strength = 8; // Giảm từ 12 xuống 8
        const onMove = (e: MouseEvent) => {
          const r = m.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          gsap.to(m, {
            x: (x / r.width) * strength,
            y: (y / r.height) * strength,
            duration: 0.3,
            ease: "power2.out",
          });
        };
        const onLeave = () =>
          gsap.to(m, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
        m.addEventListener("mousemove", onMove);
        m.addEventListener("mouseleave", onLeave);
      });

      // Chip animation - subtle hơn
      ScrollTrigger.batch(".chip", {
        start: "top 85%",
        onEnter: (els) => {
          gsap.fromTo(
            els as Element[],
            { y: 8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.06,
            }
          );
        },
      });

      // Box shadow animation - subtle hơn
      gsap.fromTo(
        rootRef.current,
        { boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );

      // Desktop parallax - nhẹ hơn
      mm.add("(min-width: 1024px)", () => {
        document
          .querySelectorAll<HTMLElement>(".parallax-card")
          .forEach((card) => {
            const img = card.querySelector<HTMLElement>(".parallax-img");
            if (!img) return;
            const st = ScrollTrigger.create({
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              onUpdate: (self) => {
                gsap.to(img, {
                  yPercent: gsap.utils.mapRange(0, 1, -8, 0)(self.progress), // Giảm từ -14 xuống -8
                  duration: 0.1,
                });
              },
            });

            return () => st.kill();
          });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured.id);

  return (
    <section ref={rootRef} className="py-10 px-4">
      <div className="container mx-auto px-3 md:px-4">
        <div className="blog-head flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-color">
              Blog & Câu chuyện
            </h2>
            <p className="text-gray-600 mt-2">
              Tin tức, kinh nghiệm vận hành và những khoảnh khắc đẹp từ cộng
              đồng.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* FEATURED */}
          <article className="featured blog-card parallax-card lg:col-span-2 rounded-2xl overflow-hidden bg-white group will-change-transform">
            <div className="relative overflow-hidden">
              <Image
                src={featured.cover}
                alt={featured.title}
                width={1200}
                height={800}
                className="parallax-img w-full h-[260px] sm:h-[360px] md:h-[580px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="chip absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 text-xs rounded-full border border-white shadow-sm">
                {featured.category}
              </span>
            </div>

            <div className="p-6">
              <Link href={`/blog/${featured.id}`} className="block">
                <h3 className="text-2xl font-bold leading-snug text-gray-900 hover:text-[#ad4e28] transition">
                  {featured.title}
                </h3>
                <p className="text-gray-600 mt-3 line-clamp-3">
                  {featured.excerpt}
                </p>
              </Link>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-8 h-8"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {featured.author.name}
                    </p>
                    <p className="text-gray-500">
                      {fmtDate(featured.date)} • {featured.readingMinutes} phút
                      đọc
                    </p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.id}`}
                  className="magnetic text-[#ad4e28] font-medium hover:underline"
                >
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          </article>

          {/* TOP RIGHT LIST */}
          <div className="grid grid-rows-2 gap-6">
            {rest.slice(0, 2).map((p) => (
              <article
                key={p.id}
                className="blog-card parallax-card rounded-2xl overflow-hidden bg-white group will-change-transform"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    width={900}
                    height={600}
                    className="parallax-img w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="chip absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 text-xs rounded-full border shadow-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4">
                  <Link href={`/blog/${p.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug hover:text-[#ad4e28] transition line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {p.excerpt}
                    </p>
                  </Link>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={p.author.avatar}
                        alt={p.author.name}
                        width={28}
                        height={28}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                      <span className="text-xs text-gray-700">
                        {p.author.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {fmtDate(p.date)} • {p.readingMinutes}’
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.slice(2).map((p) => (
            <article
              key={p.id}
              className="blog-card parallax-card rounded-2xl overflow-hidden bg-white group will-change-transform"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={p.cover}
                  alt={p.title}
                  width={900}
                  height={600}
                  className="parallax-img w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="chip absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 text-xs rounded-full border shadow-sm">
                  {p.category}
                </span>
              </div>

              <div className="p-4">
                <Link href={`/blog/${p.id}`} className="block">
                  <h3 className="text-lg font-semibold leading-snug text-gray-900 hover:text-[#ad4e28] transition line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">{p.excerpt}</p>
                </Link>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={p.author.avatar}
                      alt={p.author.name}
                      width={28}
                      height={28}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                    <span className="text-xs text-gray-700">
                      {p.author.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {fmtDate(p.date)} • {p.readingMinutes}’
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
