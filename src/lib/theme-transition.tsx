"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);

    requestAnimationFrame(() => setReady(true));
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`transition-colors duration-300 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      data-theme={resolvedTheme}
    >
      {children}
    </div>
  );
}
