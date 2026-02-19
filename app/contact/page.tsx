import React from "react";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const dynamic = "force-static";

export default function Contact() {
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
              <span className="block italic font-light">Contact</span>
              <span className="block font-medium mt-2 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] bg-clip-text text-transparent">
                ViaTryon
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">
              Get in touch—we&apos;d love to hear from you
            </p>
          </div>
        </div>
      </section>

      {/* Contact via email only */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center bg-white rounded-2xl border border-gray-200 p-12 shadow-sm">
            <p className="text-[#4B5563] text-lg mb-6">
              Contact us via email:
            </p>
            <a
              href="mailto:viatryon@gmail.com"
              className="text-xl md:text-2xl font-semibold text-[#2D8C88] hover:text-[#F28C38] transition-colors underline underline-offset-4"
            >
              viatryon@gmail.com
            </a>
            <p className="text-sm text-gray-500 mt-6">
              We&apos;ll respond as soon as we can.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
