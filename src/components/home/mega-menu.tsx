"use client";

import Link from "next/link";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import { ChevronDownIcon } from "../animate-ui/icons/chevron-down";

type Item = { title: string; desc?: string; href: string };
type Section = { heading?: string; items: Item[] };

export function MegaMenu({
  label,
  description,
  icon,
  sections,
  align = "start",
}: {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  sections: Section[];
  align?: "start" | "center" | "end";
}) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      openDelay={80}
      closeDelay={120}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full"
          )}
        >
          {label}
          <ChevronDownIcon
            animateOnHover
            animateOnTap
            animateOnView
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        align={align}
        sideOffset={12}
        className={cn(
          "w-[680px] p-5 rounded-2xl shadow-xl",
          "bg-background border"
        )}
      >
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <div className="h-9 w-9 rounded-full bg-foreground/5 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{description ?? label}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          {sections.map((s, i) => (
            <div key={i} className="space-y-3">
              {s.heading && (
                <p className="text-sm font-medium text-foreground/70">
                  {s.heading}
                </p>
              )}
              <ul className="space-y-3">
                {s.items.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group block">
                      <p className="inline-block text-base font-semibold nav-hover-btn nav-hover-black-btn">
                        {item.title}
                      </p>
                      {item.desc && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.desc}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
