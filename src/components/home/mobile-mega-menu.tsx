"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";

interface MegaMenuSection {
  heading?: string;
  items: {
    title: string;
    desc?: string;
    href: string;
  }[];
}

interface MobileMegaMenuProps {
  label: string;
  sections: MegaMenuSection[];
}

export function MobileMegaMenu({ label, sections }: MobileMegaMenuProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={label.toLowerCase().replace(/\s+/g, "-")}>
        <AccordionTrigger className="px-2 py-2">{label}</AccordionTrigger>
        <AccordionContent className="pl-4 space-y-4 mt-2">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.heading && (
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  {section.heading}
                </p>
              )}
              <div className="flex flex-col space-y-2">
                {section.items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col rounded-md px-2 py-1 hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.desc && (
                      <span className="text-xs text-muted-foreground">
                        {item.desc}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
