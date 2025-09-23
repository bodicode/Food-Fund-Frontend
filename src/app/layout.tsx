import type { Metadata } from "next";
import "../app/(main)/globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ApolloWrapper } from "@/lib/apollo-provider";

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
        <ApolloWrapper>
          {children}
          <Toaster richColors />
        </ApolloWrapper>
      </body>
    </html>
  );
}
