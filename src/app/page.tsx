import { BlogSection } from "@/components/home/blog";
import { FeaturedCampaigns } from "@/components/home/featured-campaigns";
import { FeaturedFundraisers } from "@/components/home/featured-fundraisers";
import { Footer } from "@/components/home/footer";
import Hero from "@/components/home/hero";
import { KitChenStaffIntroduce } from "@/components/home/kitchen-staff-introduce";
import { Navigation } from "@/components/home/navigation";
import { Stories } from "@/components/home/stories";
import { WhatWeDo } from "@/components/home/what-we-do";

export default function Home() {
  return (
    <div className="bg-color-base">
      <Navigation />
      <Hero />
      <WhatWeDo />
      <FeaturedCampaigns />
      <FeaturedFundraisers />
      <KitChenStaffIntroduce />
      <BlogSection />
      <Stories />
      <Footer />
    </div>
  );
}
