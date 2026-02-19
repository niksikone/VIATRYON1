import React from "react";
import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const dynamic = "force-static";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <SiteNav />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-60 w-[40rem] h-[40rem] rounded-full blur-[120px] animate-fade-in"
            style={{
              background: `linear-gradient(135deg, rgba(45, 140, 136, 0.15) 0%, rgba(242, 140, 56, 0.15) 100%)`,
              animationDuration: "1.5s",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1F2937] mb-6 leading-tight animate-fade-in-up">
              <span className="block italic font-light">About</span>
              <span className="block font-medium mt-2 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] bg-clip-text text-transparent">
                ViaTryon
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">
              AI-powered virtual try-on for jewelry e-commerce
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Company copy */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <p className="text-lg text-[#4B5563] leading-relaxed">
              ViaTryon helps jewelry brands and retailers let customers see products on themselves before they buy. We combine industry-leading virtual try-on technology with simple integration so you can go live in minutes, not months.
            </p>
            <p className="text-lg text-[#4B5563] leading-relaxed">
              Our mission is to make virtual try-on accessible to every jewelry store—so your customers get confidence and you get higher conversion and fewer returns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2D8C88] to-[#F28C38]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join jewelry retailers using ViaTryon to transform their online shopping experience
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2D8C88] px-8 py-4 rounded-full font-semibold hover:bg-gray-100"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
