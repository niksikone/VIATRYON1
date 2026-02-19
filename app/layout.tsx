import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viatryon — Virtual Try-On for Jewelry Stores",
  description:
    "Boost conversions by 3x and cut returns by 60% with AI-powered virtual try-on for jewelry. Works on any device. No app needed.",
  keywords: [
    "virtual try-on",
    "jewelry",
    "AR",
    "augmented reality",
    "e-commerce",
    "Shopify",
    "WooCommerce",
    "rings",
    "bracelets",
    "watches",
    "earrings",
    "necklaces",
  ],
  openGraph: {
    title: "Viatryon — Virtual Try-On for Jewelry Stores",
    description:
      "Let your customers try on jewelry before they buy. AI-powered virtual try-on that works on any device.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#F9FAFB] text-[#1F2937]`}
      >
        {children}
      </body>
    </html>
  );
}
