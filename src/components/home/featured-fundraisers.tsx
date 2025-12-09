"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { organizationService } from "@/services/organization.service";
import { Organization } from "@/types/api/organization";

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

    // Set initial state
    gsap.set(root, {
      opacity: 1,
      y: 0,
      transformStyle: "preserve-3d",
      transformOrigin: "50% 50%",
      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    });

    // Animate in
    gsap.from(root, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 80%", once: true },
    });

    const MAX_TILT = 6;
    const SCALE_HOVER = 1.01;

    const qRotX = gsap.quickTo(root, "rotationX", {
      duration: 0.3,
      ease: "power2.out",
    });
    const qRotY = gsap.quickTo(root, "rotationY", {
      duration: 0.3,
      ease: "power2.out",
    });
    const qScale = gsap.quickTo(root, "scale", {
      duration: 0.3,
      ease: "power2.out",
    });

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const relX = (e.clientX - cx) / (rect.width / 2);
      const relY = (e.clientY - cy) / (rect.height / 2);

      const rotX = gsap.utils.clamp(-MAX_TILT, MAX_TILT, -relY * MAX_TILT);
      const rotY = gsap.utils.clamp(-MAX_TILT, MAX_TILT, relX * MAX_TILT);

      qRotX(rotX);
      qRotY(rotY);
      qScale(SCALE_HOVER);
    };

    const onLeave = () => {
      qRotX(0);
      qRotY(0);
      qScale(1);
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loading]);

  return (
    <section className="container mx-auto pb-6 md:pb-20 px-4">
      <div
        ref={rootRef}
        className="mx-auto overflow-hidden bg-gradient-to-br from-[#E77731] via-[#E77731]/95 to-[#ad4e28] rounded-2xl md:rounded-3xl shadow-2xl min-h-[300px]"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 pt-8 md:pt-12 mb-16 md:mb-20">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg text-center md:text-left">
            Tổ chức, cá nhân gây quỹ nổi bật
          </h2>
          <Link
            href="/organizations"
            className="inline-flex items-center gap-2 text-white hover:text-white/90 text-sm font-semibold transition-all duration-300 hover:gap-3 group"
          >
            <span>Xem tất cả</span>
            <span aria-hidden className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 pb-8 md:pb-12 items-stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="relative bg-white/95 backdrop-blur-sm dark:bg-card rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 flex flex-col h-full animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded mb-5" />
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                  </div>
                  <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))
          ) : organizations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white/80 text-lg">Chưa có tổ chức nào</p>
            </div>
          ) : (
            organizations.map((org) => (
              <div key={org.id} className="group">
                <article
                  className="relative bg-white/95 backdrop-blur-sm dark:bg-card text-gray-800 dark:text-foreground
                             rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl ring-1 ring-white/50 dark:ring-white/10
                             p-6 md:p-8 flex flex-col h-full will-change-transform transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:text-[#E77731] transition-colors duration-300 line-clamp-2">
                          {org.name}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground">
                          @{org.representative?.user_name || "organization"}
                        </span>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#E77731] to-[#ad4e28] flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {org.description && (
                      <p className="text-sm text-gray-600 dark:text-muted-foreground mb-5 line-clamp-3">
                        {org.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-3 border border-[#E77731]/10">
                        <p className="text-xs text-gray-500 dark:text-muted-foreground font-medium mb-1">
                          Hoạt động
                        </p>
                        <p className="text-2xl font-bold" style={{ color: "#E77731" }}>
                          {org.active_members || 0}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-3 border border-[#E77731]/10">
                        <p className="text-xs text-gray-500 dark:text-muted-foreground font-medium mb-1">
                          Tổng TV
                        </p>
                        <p className="text-2xl font-bold" style={{ color: "#E77731" }}>
                          {org.total_members || 0}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/organizations/${createSlug(org.name)}`}
                      className="btn-color w-full h-11 md:h-12 rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      Xem chi tiết
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </article>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
