import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductShowcase from '@/components/vto/ProductShowcase';

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Load products by category
  const { data: watches } = await supabase
    .from("products")
    .select("id,name,type,image_url,metadata,is_active")
    .eq("type", "watch")
    .eq("is_active", true)
    .limit(6);

  const { data: bracelets } = await supabase
    .from("products")
    .select("id,name,type,image_url,metadata,is_active")
    .eq("type", "bracelet")
    .eq("is_active", true)
    .limit(6);

  const { data: rings } = await supabase
    .from("products")
    .select("id,name,type,image_url,metadata,is_active")
    .eq("type", "ring")
    .eq("is_active", true)
    .limit(6);

  const products = {
    watches: watches || [],
    bracelets: bracelets || [],
    rings: rings || [],
  };

  const brandLogos = [
    { name: 'Rolex', src: '/imgs/brands/rolex.png' },
    { name: 'Omega', src: '/imgs/brands/Omega.png' },
    { name: 'Seiko', src: '/imgs/brands/Seiko.png' },
    { name: 'Tissot', src: '/imgs/brands/Tissot.png' },
    { name: 'Citizen', src: '/imgs/brands/Citizen.png' },
  ];

  const stats = [
    { value: '99%', label: 'Accuracy Rate' },
    { value: '<2s', label: 'Processing Time' },
    { value: '24/7', label: 'Availability' },
    { value: '100+', label: 'Products Supported' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white shadow-lg py-3 transition-all duration-300">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/imgs/logo-only.png" alt="ViaTryon" width={40} height={40} className="h-10 w-10" />
              <span className="font-serif text-2xl font-medium text-[#1F2937] tracking-tight">
                ViaTryon
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#1F2937] text-base font-medium hover:text-[#F28C38] transition-colors">
                Home
              </Link>
              <Link href="/how-it-works" className="text-[#1F2937] text-base font-medium hover:text-[#F28C38] transition-colors">
                How It Works
              </Link>
              <Link href="/requirements" className="text-[#1F2937] text-base font-medium hover:text-[#F28C38] transition-colors">
                Requirements
              </Link>
              <Link href="/demo" className="text-[#1F2937] text-base font-medium hover:text-[#F28C38] transition-colors">
                Demo
              </Link>
              <Link
                href="/login"
                className="bg-[#2D8C88] text-white px-6 py-2 rounded-full font-medium hover:bg-[#F28C38] transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-60 w-[40rem] h-[40rem] rounded-full blur-[120px] animate-pulse"
            style={{
              background: `linear-gradient(135deg, rgba(45, 140, 136, 0.15) 0%, rgba(242, 140, 56, 0.15) 100%)`,
            }}
          />
          <div
            className="absolute bottom-1/4 -right-60 w-[40rem] h-[40rem] rounded-full blur-[120px] animate-pulse"
            style={{
              background: `linear-gradient(315deg, rgba(45, 140, 136, 0.15) 0%, rgba(242, 140, 56, 0.15) 100%)`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm font-medium text-[#2D8C88]">AI-Powered Virtual Try-On</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-serif text-[#1F2937] mb-6 leading-tight">
                <span className="block italic font-light">Elevate Your</span>
                <span className="block font-medium mt-2">
                  <span className="bg-gradient-to-r from-[#2D8C88] to-[#F28C38] bg-clip-text text-transparent">
                    Jewelry Experience
                  </span>
                </span>
              </h1>

              <p className="text-lg text-[#4B5563] mb-8 max-w-xl">
                Transform your online jewelry store with cutting-edge AR virtual try-on. 
                Let customers experience watches, bracelets, and rings in real-time on their own wrist or hand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="bg-[#2D8C88] text-white px-8 py-4 rounded-full font-medium hover:bg-[#F28C38] transition-all duration-200 text-center"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/demo"
                  className="border-2 border-[#2D8C88] text-[#2D8C88] px-8 py-4 rounded-full font-medium hover:bg-[#2D8C88] hover:text-white transition-all duration-200 text-center"
                >
                  Try Demo
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative h-[500px] flex items-center justify-center">
              <Image
                src="/imgs/tryon.png"
                alt="Virtual Try-On Experience"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[#2D8C88] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <ProductShowcase products={products} />

      {/* Brand Logos */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-serif text-[#1F2937] mb-2">Trusted by Leading Brands</h3>
            <p className="text-gray-600">Industry leaders choose ViaTryon</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {brandLogos.map((brand) => (
              <div
                key={brand.name}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="object-contain h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#1F2937] mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional virtual try-on technology powered by Perfect Corp API
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Real-Time AR</h3>
              <p className="text-gray-600">Experience jewelry on your wrist or hand with accurate sizing powered by advanced AR technology.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No App Required</h3>
              <p className="text-gray-600">Access virtual try-on directly in your browser without any downloads.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Perfect Corp Powered</h3>
              <p className="text-gray-600">Industry-leading virtual try-on technology trusted by major jewelry brands worldwide.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Multi-Jewelry Types</h3>
              <p className="text-gray-600">Support for watches, bracelets, and rings with specialized try-on for each category.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Track engagement, conversions, and product performance with detailed analytics.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Easy Integration</h3>
              <p className="text-gray-600">Embed with QR codes or widgets. Works with any e-commerce platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#2D8C88] to-[#F28C38]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-white mb-6">
            Ready to Transform Your Store?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join jewelry retailers using ViaTryon to boost customer confidence and increase conversions
          </p>
          <div>
            <Link
              href="/signup"
              className="inline-block bg-white text-[#2D8C88] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white pt-20 pb-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <div className="flex items-center mb-8">
                <Image src="/imgs/logo-only.png" alt="ViaTryon" width={56} height={56} className="h-14 mr-4" />
                <span className="text-3xl font-serif" style={{ color: '#2D8C88' }}>
                  ViaTryon
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-10 max-w-sm leading-relaxed">
                Elevate your luxury shopping with our cutting-edge AR virtual try-on. 
                Experience watches, bracelets, and rings in real-time, anywhere.
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: '#2D8C88' }}>
                  Try-On
                </h3>
                <ul className="space-y-4">
                  <li><Link href="/demo" className="text-gray-300 hover:text-[#F28C38] transition-colors">Virtual Try-On</Link></li>
                  <li><Link href="/how-it-works" className="text-gray-300 hover:text-[#F28C38] transition-colors">How It Works</Link></li>
                  <li><Link href="/requirements" className="text-gray-300 hover:text-[#F28C38] transition-colors">Requirements</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: '#2D8C88' }}>
                  Company
                </h3>
                <ul className="space-y-4">
                  <li><Link href="/about" className="text-gray-300 hover:text-[#F28C38] transition-colors">About</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-[#F28C38] transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: '#2D8C88' }}>
                  Account
                </h3>
                <ul className="space-y-4">
                  <li><Link href="/login" className="text-gray-300 hover:text-[#F28C38] transition-colors">Login</Link></li>
                  <li><Link href="/signup" className="text-gray-300 hover:text-[#F28C38] transition-colors">Sign Up</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ViaTryon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
