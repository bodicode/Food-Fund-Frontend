import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Navigation } from "@/components/home/navigation";
import { Footer } from "@/components/home/footer";
import SmoothScrollProvider from "@/providers/smooth-scroll-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "FoodFund",
  description: "FoodFund is a platform for funding food projects",
  icons: "/images/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <SmoothScrollProvider>
          <Navigation />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
