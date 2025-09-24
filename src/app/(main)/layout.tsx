import "./globals.css";
import { Navigation } from "@/components/home/navigation";
import { Footer } from "@/components/home/footer";
import SmoothScrollProvider from "@/providers/smooth-scroll-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <Navigation />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
