import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapNavigation(
  headerRef: React.RefObject<HTMLElement | null>,
  pathname: string
) {
  useLayoutEffect(() => {
    if (!headerRef.current) return;

    // Kill hết triggers cũ
    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (pathname !== "/") {
      // Đảm bảo nav luôn visible khi không phải homepage
      gsap.set(headerRef.current, { 
        clearProps: "all",
        y: 0,
        opacity: 1,
        yPercent: 0
      });
      return;
    }

    const ctx = gsap.context(() => {
      let lastScroll = 0;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "200 top",
        onUpdate: (self) => {
          if (self.scroll() > 50) {
            headerRef.current?.classList.add("text-color");
            headerRef.current?.classList.remove("text-white");
            gsap.to(headerRef.current, {
              backgroundImage:
                "linear-gradient(to bottom right, #fefcf8, #fef7f0, #fdf2e8)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              duration: 0.4,
              ease: "power2.out",
            });
          } else {
            headerRef.current?.classList.add("text-white");
            headerRef.current?.classList.remove("text-color");
            gsap.to(headerRef.current, {
              backgroundImage: "none",
              backdropFilter: "blur(0px)",
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              duration: 0.4,
              ease: "power2.out",
            });
          }
        },
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(headerRef.current, {
              yPercent: -150,
              opacity: 0,
              duration: 0.5,
              ease: "power3.inOut",
            });
          } else {
            gsap.to(headerRef.current, {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.inOut",
            });
          }
          lastScroll = currentScroll;
        },
      });
    }, headerRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname, headerRef]);
}
