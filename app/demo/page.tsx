import { createSupabaseServerClient } from "@/lib/supabase/server";
import EmbedWidget from "@/components/vto/EmbedWidget";
import Link from "next/link";
import Image from "next/image";

export default async function Demo() {
  const supabase = await createSupabaseServerClient();
  const demoProductIds = process.env.NEXT_PUBLIC_DEMO_PRODUCT_IDS?.split(',');

  let products = [];

  if (demoProductIds && demoProductIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("id,name,type,image_url,metadata,is_active")
      .in("id", demoProductIds)
      .eq("is_active", true);
    if (data) {
      products = data;
    }
  }

  if (products.length === 0) {
    const { data } = await supabase
      .from("products")
      .select("id,name,type,image_url,metadata,is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3);
    if (data && data.length > 0) {
      products = data;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
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
              <Link href="/demo" className="text-[#2D8C88] text-base font-bold">
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
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-60 w-[40rem] h-[40rem] rounded-full blur-[120px]"
            style={{
              background: `linear-gradient(135deg, rgba(45, 140, 136, 0.15) 0%, rgba(242, 140, 56, 0.15) 100%)`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-sm font-medium text-[#2D8C88]">Live Demo</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-[#1F2937] mb-6">Try It Yourself</h1>
            <p className="text-xl text-gray-600">
              Experience AI-powered virtual try-on with our demo products
            </p>
          </div>
        </div>
      </section>

      {/* Demo Products */}
      <section className="container mx-auto px-6 py-16">
        {products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {products.map((product: any) => (
              <div key={product.id} className="flex w-full justify-center">
                <EmbedWidget product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-lg max-w-2xl mx-auto">
            <div className="text-6xl mb-4">💍</div>
            <p className="text-lg text-gray-700 mb-2">
              No demo products available at the moment.
            </p>
            <p className="text-sm text-gray-500">
              Contact us to set up a personalized demo with your products.
            </p>
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center text-3xl font-serif text-[#1F2937]">How to Try</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2D8C88] text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Click "Try It On"</h3>
                  <p className="text-gray-600">
                    Select any product above and click the try-on button
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2D8C88] text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Allow Camera Access</h3>
                  <p className="text-gray-600">
                    Grant camera permission when prompted (required for try-on)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2D8C88] text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Capture Your Photo</h3>
                  <p className="text-gray-600">
                    Follow the on-screen guide to position your wrist or hand correctly
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2D8C88] text-white font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">See the Result</h3>
                  <p className="text-gray-600">
                    Wait a few seconds for Perfect Corp AI to process your virtual try-on
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2D8C88] to-[#F28C38]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Impressed? Add This to Your Store</h2>
            <p className="text-lg text-white/90 mb-8">
              Set up virtual try-on for your entire jewelry catalog in minutes
            </p>
            <div>
              <Link
                href="/signup"
                className="inline-block bg-white text-[#2D8C88] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
              >
                Start Free Trial
              </Link>
            </div>
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
