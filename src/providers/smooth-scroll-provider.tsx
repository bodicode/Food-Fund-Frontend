"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).msMaxTouchPoints > 0;

    const opts: LenisOptions = isTouch
      ? { lerp: 0.16, smoothWheel: true, smoothTouch: true }
      : { lerp: 0.08, smoothWheel: true, smoothTouch: false };

    const lenis = new Lenis(opts);
    lenisRef.current = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const loop = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);

    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";

    return () => {
      history.scrollRestoration = prev;
      lenis.off("scroll", onLenisScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
