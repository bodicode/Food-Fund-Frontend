"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

let gsap: any = null,
  ScrollTrigger: any = null;
if (typeof window !== "undefined") {
  try {
    gsap = require("gsap");
    ScrollTrigger = require("gsap/ScrollTrigger");
    gsap?.registerPlugin?.(ScrollTrigger);
  } catch {}
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    const opts: any = isTouch
      ? { lerp: 0.16, smoothWheel: true, smoothTouch: true }
      : { lerp: 0.08, smoothWheel: true, smoothTouch: false };

    opts.autoRaf = true;

    const lenis = new (Lenis as any)(opts);
    lenisRef.current = lenis;

    const onLenisScroll = () => {
      try {
        ScrollTrigger?.update?.();
      } catch {}
    };
    lenis.on?.("scroll", onLenisScroll);

    const needManualRaf = !(lenis as any).options?.autoRaf;
    const loop = (time: number) => {
      lenis.raf?.(time);
      rafIdRef.current = requestAnimationFrame(loop);
    };
    if (needManualRaf) {
      rafIdRef.current = requestAnimationFrame(loop);
    }

    try {
      lenis.start?.();
    } catch {}

    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";

    return () => {
      history.scrollRestoration = prev;
      try {
        lenis.off?.("scroll", onLenisScroll);
      } catch {}
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy?.();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
