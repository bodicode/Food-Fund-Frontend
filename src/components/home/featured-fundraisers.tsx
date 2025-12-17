"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { organizationService } from "../../services/organization.service";
import { Organization } from "../../types/api/organization";
import { Users, ArrowRight, Building2, CheckCircle2, Trophy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export function FeaturedFundraisers() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { organizations } = await organizationService.getActiveOrganizations();
        setOrganizations(organizations.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || loading) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(".ff-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true
          }
        }
      );
    }, root);

    // Tilt Effect Logic
    const cards = root.querySelectorAll<HTMLElement>(".ff-card-inner");

    cards.forEach(card => {
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
          duration: 0.5,
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.02,
          ease: "power2.out",
          transformPerspective: 1000,
          transformOrigin: "center"
        });
      };

      const handleLeave = () => {
        gsap.to(card, {
          duration: 0.5,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: "power2.out"
        });
      };

      card.parentElement?.addEventListener("mousemove", handleMove as unknown as EventListener);
      card.parentElement?.addEventListener("mouseleave", handleLeave);
    });

    return () => ctx.revert();
  }, [loading, organizations.length]);

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-white" ref={rootRef}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E77731]/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#E77731] tracking-tight mb-4">
              Đối tác <span className="text-gray-900">đồng hành</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Những tổ chức uy tín hàng đầu đang cùng chúng tôi kiến tạo những thay đổi tích cực cho cộng đồng.
            </p>
          </div>

          <Link
            href="/organizations"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 text-gray-900 font-bold hover:bg-gray-100 transition-all duration-300"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch perspective-1000">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-100 rounded-[2rem] animate-pulse" />
            ))
          ) : organizations.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400">
              Chưa có đối tác nào.
            </div>
          ) : (
            organizations.map((org) => (
              <div key={org.id} className="ff-card h-full group">
                <div className="ff-card-inner relative h-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 flex flex-col transition-all duration-300">

                  {/* Decorative Background Blob */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] rounded-tr-[2rem] -z-10 transition-colors group-hover:bg-orange-100/50" />

                  {/* Header: Logo & Name */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E77731] via-[#F48F56] to-[#F9B28D] shadow-lg shadow-orange-500/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-8 h-8 text-white stroke-[2.5]" />
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã xác thực
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E77731] transition-colors">
                    {org.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {org.description || "Một tổ chức tận tâm vì cộng đồng, luôn nỗ lực mang lại những giá trị tốt đẹp nhất."}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4 transition-colors group-hover:bg-[#E77731]/5">
                      <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Thành viên</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#E77731]" />
                        <span className="font-bold text-gray-900 text-lg">{org.total_members || 120}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 transition-colors group-hover:bg-[#E77731]/5">
                      <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Chiến dịch</span>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#E77731]" />
                        <span className="font-bold text-gray-900 text-lg">{org.active_members || 24}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/organizations/${createSlug(org.name)}`}
                    className="w-full py-4 rounded-xl border border-gray-200 text-gray-900 font-bold flex items-center justify-center gap-2 hover:bg-[#E77731] hover:text-white hover:border-[#E77731] transition-all duration-300"
                  >
                    <span>Tìm hiểu thêm</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
