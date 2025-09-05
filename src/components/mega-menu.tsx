"use client";

import Link from "next/link";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    icon?: React.ReactNode;  // optional leading icon
    sections: Section[];     // typically 2 sections for 2 columns
    align?: "start" | "center" | "end";
}) {
    return (
        <HoverCard openDelay={80} closeDelay={120}>
            <HoverCardTrigger asChild>
                <button
                    className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full",
                        "text-white hover:text-white/70",
                        "hover:bg-foreground/5 transition-colors"
                    )}
                >
                    {label}
                    <ChevronDown className="h-4 w-4" />
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
                                <p className="text-sm font-medium text-foreground/70">{s.heading}</p>
                            )}
                            <ul className="space-y-3">
                                {s.items.map((item) => (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className="group block"
                                        >
                                            <p className="text-base font-semibold group-hover:underline underline-offset-4">
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
