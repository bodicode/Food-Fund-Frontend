"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      key={theme} 
      className="transition-all duration-700 ease-in-out opacity-0 animate-fadeIn"
    >
      {children}
    </div>
  );
}
