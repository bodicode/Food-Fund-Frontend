// src/components/campaign/hero-banner.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Copy, type LucideIcon } from "lucide-react";
import { coverSrc } from "@/lib/utils/utils";

export function HeroBanner({
  title,
  coverImage,
  status,
  categoryTitle,
  copied,
  onShare,
  onViewDonations,
}: {
  title: string;
  coverImage?: string;
  status: { color: string; label: string; icon: LucideIcon }; // 👈 dùng LucideIcon
  categoryTitle?: string;
  copied: boolean;
  onShare: () => void;
  onViewDonations: () => void;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden ring-1 ring-gray-200 shadow-sm mb-8">
      <Image
        src={coverSrc(coverImage)}
        alt={title}
        width={1600}
        height={900}
        priority
        className="object-cover w-full h-[280px] md:h-[420px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <Badge
          className={`${status.color} flex items-center gap-1 border-0 shadow`}
        >
          <status.icon className="w-4 h-4" /> {status.label}
        </Badge>
        {categoryTitle && (
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {categoryTitle}
          </Badge>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={onShare}
            className="backdrop-blur bg-white/80"
          >
            {copied ? (
              <Copy className="w-4 h-4 mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}{" "}
            {copied ? "Đã sao chép" : "Chia sẻ"}
          </Button>
          <Button
            variant="outline"
            onClick={onViewDonations}
            className="bg-white/80 backdrop-blur border-white/70"
          >
            Xem quyên góp
          </Button>
        </div>
      </div>
    </div>
  );
}
