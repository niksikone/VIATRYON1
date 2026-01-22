'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Extract',
      description: 'We extract your product images and specifications from your existing catalog, ensuring accurate AR representation.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Configure',
      description: 'Our team configures the AR experience to match your brand guidelines and product specifications, ensuring seamless integration.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Implement',
      description: 'Add our AR snippet to your website with simple QR code or widget integration. No complex setup required.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Launch',
      description: 'After thorough QA and testing, your AR try-on experience goes live, allowing customers to virtually try your products.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  const features = [
    {
      title: 'Real-Time AR',
      description: 'Experience watches, bracelets, and rings on your wrist or hand with accurate sizing powered by advanced AR technology.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'No App Required',
      description: 'Access virtual try-on directly in your browser without any downloads, making it easy for customers to try instantly.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Perfect Corp Technology',
      description: 'Industry-leading virtual try-on powered by Perfect Corp API, trusted by major jewelry brands worldwide.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: 'Device Compatibility',
      description: 'Works seamlessly across smartphones, tablets, and desktop devices ensuring a consistent experience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white shadow-lg py-3">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="font-serif text-2xl font-medium text-[#1F2937]">ViaTryon</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#1F2937] hover:text-[#F28C38]">Home</Link>
              <Link href="/how-it-works" className="text-[#2D8C88] font-medium">How It Works</Link>
              <Link href="/requirements" className="text-[#1F2937] hover:text-[#F28C38]">Requirements</Link>
              <Link href="/demo" className="text-[#1F2937] hover:text-[#F28C38]">Demo</Link>
              <Link href="/login" className="bg-[#2D8C88] text-white px-6 py-2 rounded-full hover:bg-[#F28C38]">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 -left-60 w-[40rem] h-[40rem] rounded-full blur-[120px]"
            style={{ background: `linear-gradient(135deg, rgba(45, 140, 136, 0.15) 0%, rgba(242, 140, 56, 0.15) 100%)` }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1F2937] mb-6 leading-tight"
            >
              <span className="block italic font-light">How Our</span>
              <span className="block font-medium mt-2 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] bg-clip-text text-transparent">
                Virtual Try-On Works
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-8"
            >
              From product extraction to live AR experience in four simple steps
            </motion.p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] flex items-center justify-center text-white">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl font-bold text-[#2D8C88]">0{step.id}</span>
                    <h3 className="text-2xl font-semibold text-[#1F2937]">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F2937] mb-4">Key Features</h2>
            <p className="text-gray-600">Everything you need for a world-class virtual try-on experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2D8C88]/10 text-[#2D8C88] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
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
            href="/signup"
            className="inline-block bg-white text-[#2D8C88] px-8 py-4 rounded-full font-semibold hover:bg-gray-100"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white pt-20 pb-12">
        <div className="container mx-auto px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ViaTryon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
