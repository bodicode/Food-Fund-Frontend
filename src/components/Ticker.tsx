"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const items = [
    "Chia sẻ", "Gây quỹ", "Chiến dịch", "Tình thương",
    "Minh bạch", "Cộng đồng", "Trao đi", "Kết nối",
];

export default function Ticker() {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = tickerRef.current;
        if (!el) return;

        const totalWidth = el.offsetWidth / 2;

        gsap.to(el, {
            x: `-=${totalWidth}`,
            duration: 20,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth), // Loop seamlessly
            },
        });
    }, []);

    return (
        <div className="absolute bottom-0 left-0 right-0 text-white overflow-hidden py-2 z-50 bg-transparent">
            <div
                ref={tickerRef}
                className="flex whitespace-nowrap gap-8 text-base text-sm font-semibold tracking-wide"
            >
                {[...items, ...items].map((text, i) => (
                    <span key={i} className="px-4">✦ {text}</span>
                ))}
            </div>
        </div>
    );
}
