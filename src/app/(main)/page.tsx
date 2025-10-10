import { FeaturedCampaigns } from "@/components/home/featured-campaigns";
import { FeaturedFundraisers } from "@/components/home/featured-fundraisers";
import Hero from "@/components/home/hero";
import { Stories } from "@/components/home/stories";
import { WhatWeDo } from "@/components/home/what-we-do";

export default function Home() {
  return (
    <div className="bg-color-base">
      <Hero />
      <WhatWeDo />
      <FeaturedCampaigns />
      <FeaturedFundraisers />
      <Stories />
    </div>
  );
}
