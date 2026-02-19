import React from "react";
import Link from "next/link";
import Image from "next/image";

const currentYear = new Date().getFullYear();

const SiteFooter = React.memo(() => {
  return (
    <footer className="bg-[#111827] text-white pt-20 pb-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/imgs/logo-only.png" alt="Viatryon" width={48} height={48} className="h-12 w-12" />
              <span className="text-2xl font-serif font-semibold" style={{ color: "#2D8C88" }}>
                Viatryon
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              AI-powered virtual try-on for jewelry e-commerce. Let your
              customers see it on themselves before they buy.
            </p>
            <a href="mailto:viatryon@gmail.com" className="text-gray-500 text-sm hover:text-[#2D8C88] transition-colors">viatryon@gmail.com</a>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: "#2D8C88" }}>
                Product
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/#how-it-works" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    Live Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: "#2D8C88" }}>
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-gray-400">Terms</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-6" style={{ color: "#2D8C88" }}>
                Account
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-gray-400 hover:text-[#F28C38] transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Viatryon. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a href="#" className="text-gray-500 hover:text-[#2D8C88] transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-gray-500 hover:text-[#2D8C88] transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

SiteFooter.displayName = "SiteFooter";

export default SiteFooter;
