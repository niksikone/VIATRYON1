"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return { count, ref };
}

/* ─── FAQ Accordion Item ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[#1F2937] font-medium pr-4 group-hover:text-[#2D8C88] transition-colors">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-[#2D8C88] flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[#4B5563] text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* ─── Sparkle Particles ─── */
function SparkleField() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; delay: string; duration: string; size: string }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 4}s`,
        size: `${2 + Math.random() * 3}px`,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const stat1 = useCounter(32, 2000);
  const stat2 = useCounter(60, 2000);
  const stat3 = useCounter(45, 2000);
  const stat4 = useCounter(89, 2000);

  const [email, setEmail] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB] overflow-x-hidden">
      <SiteNav />

      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-60 w-[40rem] h-[40rem] rounded-full blur-[120px] animate-pulse"
            style={{ background: "linear-gradient(135deg, rgba(45, 140, 136, 0.12) 0%, rgba(242, 140, 56, 0.12) 100%)" }}
          />
          <div
            className="absolute bottom-1/4 -right-60 w-[40rem] h-[40rem] rounded-full blur-[120px] animate-pulse"
            style={{ background: "linear-gradient(315deg, rgba(45, 140, 136, 0.12) 0%, rgba(242, 140, 56, 0.12) 100%)" }}
          />
          <SparkleField />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D8C88]/10 border border-[#2D8C88]/20 mb-8">
                <span className="text-sm">🚀</span>
                <span className="text-sm font-semibold text-[#2D8C88]">Trusted by 300+ Jewelry Brands</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-[#1F2937] leading-[1.1] mb-6">
                Let Your Customers{" "}
                <span className="text-brand-gradient">Try On Jewelry</span>
                {" "}&mdash; Before They Buy
              </h1>

              <p className="text-xl text-[#4B5563] mb-10 max-w-xl leading-relaxed">
                Boost conversions by 3x and cut returns by 60% with AI-powered
                virtual try-on. Works on any device. No app needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="#cta"
                  className="btn-primary-shimmer px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg"
                >
                  Get VTO for Your Store &rarr;
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#2D8C88] text-[#2D8C88] px-8 py-4 rounded-full font-semibold hover:bg-[#2D8C88] hover:text-white transition-all duration-300 text-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span>Works with:</span>
                <span className="text-[#4B5563] font-medium">Shopify</span>
                <span>&bull;</span>
                <span className="text-[#4B5563] font-medium">WooCommerce</span>
                <span>&bull;</span>
                <span className="text-[#4B5563] font-medium">Any Platform</span>
              </div>
            </motion.div>

            {/* Right: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2D8C88]/15 to-[#F28C38]/10 blur-2xl" />
                <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-xl overflow-hidden">
                  <Image
                    src="/imgs/tryon.png"
                    alt="Virtual Try-On Experience"
                    width={500}
                    height={500}
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 2. PROBLEM SECTION ═══ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1F2937] mb-4">
              Selling Jewelry Online Is <span className="text-brand-gradient">Broken</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              { icon: "📦", stat: "40%", text: "of jewelry bought online gets returned" },
              { icon: "🛒", stat: "67%", text: "abandon cart — they can't picture it on themselves" },
              { icon: "🚪", stat: "∞", text: "customers leave to try in-store and never come back" },
              { icon: "📸", stat: "0%", text: "of static photos show sparkle, scale, or fit" },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-lift rounded-2xl bg-[#F9FAFB] p-6 text-center"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <div className="text-3xl font-bold text-[#2D8C88] mb-2">{card.stat}</div>
                <p className="text-sm text-[#4B5563]">{card.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-12 text-lg text-[#4B5563]"
          >
            Your customers want to <span className="text-[#2D8C88] font-semibold">see it on</span>. Let them.
          </motion.p>
        </div>
      </section>

      {/* ═══ 3. HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1F2937] mb-4">
              Go Live in <span className="text-brand-gradient">3 Simple Steps</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#2D8C88]/30 to-transparent" />

            {[
              {
                step: "1",
                title: "Integrate",
                desc: "Add one code snippet to your store. Takes 10 minutes. Works with Shopify, WooCommerce, or any custom site.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Customer Tries On",
                desc: "They tap \"Try It On\" and see jewelry on themselves in real-time. No app needed — works in any browser.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "They Buy Confidently",
                desc: "No more guessing. Confident customers = more sales, fewer returns. Average 3.2x conversion boost.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D8C88] to-[#F28C38] flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-[#2D8C88]/20">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#2D8C88] uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{item.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-16"
          >
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 btn-primary-shimmer px-8 py-4 rounded-full font-bold text-lg shadow-lg"
            >
              See It In Action &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. STATS / RESULTS ═══ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[150px] bg-[#2D8C88]/5" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1F2937] mb-4">
              Results That <span className="text-brand-gradient">Speak For Themselves</span>
            </h2>
            <p className="text-[#4B5563]">Average results from Viatryon jewelry partners</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { ref: stat1.ref, value: `${stat1.count / 10}x`, label: "Higher Conversion Rate" },
              { ref: stat2.ref, value: `${stat2.count}%`, label: "Fewer Returns" },
              { ref: stat3.ref, value: `${stat3.count}%`, label: "Longer Time on Site" },
              { ref: stat4.ref, value: `${stat4.count}%`, label: "Customer Satisfaction" },
            ].map((stat, i) => (
              <div
                key={i}
                ref={stat.ref}
                className="text-center card-lift rounded-2xl bg-[#F9FAFB] p-8"
              >
                <div className="text-5xl font-serif font-bold text-[#2D8C88] mb-2">{stat.value}</div>
                <div className="text-sm text-[#4B5563]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. FEATURES ═══ */}
      <section id="features" className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1F2937] mb-4">
              Built for Jewelry Brands That Want to <span className="text-brand-gradient">Win</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              { icon: "✨", title: "True-to-Scale AR", desc: "Jewelry sized perfectly to each customer's face, ears, and hands" },
              { icon: "📱", title: "Any Device", desc: "Mobile, tablet, desktop — no app download required" },
              { icon: "🎨", title: "Skin Tone Adaptive", desc: "See how metals complement any complexion in real lighting" },
              { icon: "⚡", title: "Lightning Fast", desc: "Won't slow your site. Optimized for speed and Core Web Vitals" },
              { icon: "🔌", title: "One-Click Setup", desc: "Shopify app or simple embed code. Go live in 24 hours" },
              { icon: "📊", title: "Analytics Built-In", desc: "Track try-ons, conversions, and top-performing products" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-lift rounded-2xl bg-white p-6 group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2 group-hover:text-[#2D8C88] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 6. JEWELRY TYPES ═══ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-[#1F2937] mb-4">
              Works With <span className="text-brand-gradient">All Your Products</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "💎", name: "Earrings" },
              { icon: "📿", name: "Necklaces" },
              { icon: "💍", name: "Rings" },
              { icon: "⌚", name: "Bracelets" },
              { icon: "🕐", name: "Watches" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-lift rounded-2xl bg-[#F9FAFB] px-10 py-8 text-center min-w-[140px] group cursor-default"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="font-medium text-[#1F2937] group-hover:text-[#2D8C88] transition-colors">
                  {item.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 7. TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-[#1F2937] mb-4">
              Jewelry Brands <span className="text-brand-gradient">Love Viatryon</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                quote: "Conversions jumped 40% in month one. Customers actually try on earrings before buying now.",
                name: "Sarah M.",
                company: "Luxe Gems",
                initials: "SM",
              },
              {
                quote: "Returns dropped by half. This paid for itself in 2 weeks.",
                name: "David R.",
                company: "Modern Gold Co.",
                initials: "DR",
              },
              {
                quote: "Our online store finally feels as premium as our boutique.",
                name: "Elena K.",
                company: "Sparkle & Stone",
                initials: "EK",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-lift rounded-2xl bg-white p-8"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-[#F28C38]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#1F2937] leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1F2937] text-sm">{testimonial.name}</div>
                    <div className="text-xs text-[#6B7280]">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 8. CTA + FORM ═══ */}
      <section id="cta" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] bg-[#2D8C88]/8" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1F2937] mb-4">
              Ready to Transform Your <span className="text-brand-gradient">Jewelry Store</span>?
            </h2>
            <p className="text-lg text-[#4B5563] mb-10">
              Join 300+ brands already boosting sales with virtual try-on
            </p>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-lift rounded-2xl bg-[#F9FAFB] p-10 text-center"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-serif font-bold text-[#1F2937] mb-2">You&apos;re In!</h3>
                <p className="text-[#4B5563]">
                  We&apos;ll reach out within 24 hours to get you started.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-lift rounded-2xl bg-[#F9FAFB] p-8 space-y-4 shadow-lg"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                />
                <input
                  type="url"
                  placeholder="Store URL (optional)"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full btn-primary-shimmer px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  Get Started Free &rarr;
                </button>
                <div className="flex flex-wrap justify-center gap-6 pt-2 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">🔒 No credit card</span>
                  <span className="flex items-center gap-1">⚡ Live in 24 hours</span>
                  <span className="flex items-center gap-1">💬 Free setup help</span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ 9. FAQ ═══ */}
      <section id="faq" className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-[#1F2937] mb-4">
              Questions? We&apos;ve Got <span className="text-brand-gradient">Answers</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <FAQItem
              question="How long does setup take?"
              answer="Most stores go live in under 24 hours. You add a simple embed code or install our Shopify app — no developer needed."
            />
            <FAQItem
              question="Do customers need to download an app?"
              answer="No. The virtual try-on works directly in any mobile or desktop browser. Zero friction for your customers."
            />
            <FAQItem
              question="What jewelry types are supported?"
              answer="Earrings, necklaces, rings, bracelets, and watches. Our AI adapts to each category for realistic sizing and placement."
            />
            <FAQItem
              question="Will it slow down my website?"
              answer="No. Our widget is lightweight and optimized for Core Web Vitals. It loads asynchronously and won't affect your page speed score."
            />
            <FAQItem
              question="What platforms does it work with?"
              answer="Shopify, WooCommerce, Magento, Squarespace, or any custom-built store. If it has HTML, it works."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! 14 days free, no credit card required. Start with up to 50 products and see the results for yourself."
            />
          </div>
        </div>
      </section>

      {/* ═══ 10. FINAL CTA ═══ */}
      <section className="py-24 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
              Your Competitors Are Already Using This
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Don&apos;t let customers leave your store to try jewelry elsewhere
            </p>
            <a
              href="#cta"
              className="inline-block bg-white text-[#2D8C88] px-12 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-200 animate-glow-pulse"
            >
              Get VTO for Your Store &rarr;
            </a>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
