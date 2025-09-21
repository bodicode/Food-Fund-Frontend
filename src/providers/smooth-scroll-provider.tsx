"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
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

export interface LenisController {
  pause: () => void;
  resume: () => void;
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider = forwardRef<
  LenisController,
  SmoothScrollProviderProps
>(({ children }, ref) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    pause: () => lenisRef.current?.stop(),
    resume: () => lenisRef.current?.start(),
  }));

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (typeof (navigator as Partial<{ msMaxTouchPoints: number }>)
        .msMaxTouchPoints === "number" &&
        (navigator as Partial<{ msMaxTouchPoints: number }>).msMaxTouchPoints! >
          0);

    const opts: LenisOptions = isTouch
      ? { lerp: 0.16, smoothWheel: true, smoothTouch: true }
      : { lerp: 0.08, smoothWheel: true, smoothTouch: false };

    const lenis = new Lenis(opts);
    lenisRef.current = lenis;

    const onLenisScroll = () => ScrollTrigger.update();
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
});

SmoothScrollProvider.displayName = "SmoothScrollProvider";

export default SmoothScrollProvider;
