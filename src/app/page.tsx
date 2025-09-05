import Hero from "@/components/hero";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      <div className="h-100"></div>
    </div>
  );
}
