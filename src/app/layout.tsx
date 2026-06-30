import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kali Mirch Restaurant & Cafe | Shalimar Garden, Ghaziabad",
  description: "Bold flavours, honest food. Visit Kali Mirch Restaurant & Cafe at Shalimar Garden, Sahibabad, Ghaziabad — bringing you the real taste of India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-gold-600/30 selection:text-gold-300">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
