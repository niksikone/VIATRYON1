"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const SiteNav = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/imgs/logo-only.png"
              alt="Viatryon"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="font-serif text-2xl font-semibold text-[#1F2937] tracking-tight">
              Viatryon
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#how-it-works"
              className="text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              className="text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/#faq"
              className="text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/#cta"
              className={`bg-[#2D8C88] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#F28C38] transition-all duration-300 shadow-md hover:shadow-lg ${
                scrolled
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              Book Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#4B5563] hover:text-[#2D8C88] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3 animate-fade-in bg-white rounded-xl p-4 shadow-lg">
            <Link href="/#how-it-works" className="block text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] py-2" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="/#features" className="block text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] py-2" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#testimonials" className="block text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] py-2" onClick={() => setMobileOpen(false)}>
              Testimonials
            </Link>
            <Link href="/#faq" className="block text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] py-2" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/login" className="block text-[#4B5563] text-sm font-medium hover:text-[#2D8C88] py-2" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link
              href="/#cta"
              className="block bg-[#2D8C88] text-white text-center px-6 py-3 rounded-full text-sm font-bold hover:bg-[#F28C38] transition-all mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Book Demo
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
});

SiteNav.displayName = "SiteNav";

export default SiteNav;
