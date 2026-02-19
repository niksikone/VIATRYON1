import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

// This is a fully static page
export const dynamic = 'force-static';

export default function Requirements() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      <SiteNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-[#2D8C88]/10 border border-[#2D8C88]/20 mb-6">
            <span className="text-sm font-semibold text-[#2D8C88]">Technical Documentation</span>
          </div>
          <h1 className="text-5xl font-serif font-semibold text-[#1F2937] mb-4">System Requirements</h1>
          <p className="text-xl text-[#4B5563]">
            Everything you need to integrate ViaTryOn into your store
          </p>
        </div>
      </section>

      {/* Requirements Content */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-16">
          {/* Browser Requirements */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Browser Requirements</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">Supported Browsers</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 font-semibold text-gray-900">Mobile</div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Safari 11.1+ (iOS)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Chrome 80+ (Android)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Samsung Internet 12+
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Firefox 74+ (Mobile)
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 font-semibold text-gray-900">Desktop</div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Chrome 80+
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Edge 80+
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Firefox 74+
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          Safari 13.1+
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <span className="text-yellow-400">⚠️</span>
                    <div>
                      <div className="font-semibold text-yellow-400">Important Note</div>
                      <p className="mt-1 text-sm text-gray-700">
                        Camera access requires HTTPS. In-app browsers (Facebook, Instagram, WeChat) may have limited camera support. We recommend users open links in their native browser (Safari/Chrome).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Requirements */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Product Image Requirements</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">File Specifications</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span><strong>Format:</strong> JPEG, PNG</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span><strong>Size:</strong> Up to 10MB</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span><strong>Dimensions:</strong> Long side ≤ 4096px</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span><strong>Recommended:</strong> 2000x2000px minimum</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Quality Guidelines</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>High resolution, well-lit photos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Front-facing view (45° for bracelets)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Clear, unobstructed product</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Neutral or transparent background</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Requirements */}
          <div>
            <h2 className="mb-6 text-3xl font-serif font-semibold text-[#1F2937]">Integration Requirements</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-8 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-[#1F2937]">E-Commerce Platforms</h3>
                <p className="mb-6 text-[#4B5563]">
                  ViaTryOn works with any platform that allows custom HTML/JavaScript:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    Shopify
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    WooCommerce
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    Magento
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    BigCommerce
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    Wix
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    Squarespace
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    Custom Sites
                  </div>
                  <div className="rounded-lg border border-[#2D8C88]/20 bg-white px-4 py-3 text-center shadow-sm text-[#1F2937] font-medium">
                    More...
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-8 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-[#1F2937]">Installation Methods</h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 font-semibold text-[#1F2937]">Option 1: JavaScript Widget (Recommended)</div>
                    <div className="rounded-lg bg-[#1F2937] p-4">
                      <code className="text-sm text-[#2D8C88] font-mono">
                        {`<script src="https://viatryon.com/embed.js"></script>`}
                        <br />
                        {`<div data-viatryon-product="YOUR_PRODUCT_ID"></div>`}
                      </code>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-semibold text-[#1F2937]">Option 2: iframe Embed</div>
                    <div className="rounded-lg bg-[#1F2937] p-4">
                      <code className="text-sm text-[#2D8C88] font-mono">
                        {`<iframe src="https://viatryon.com/widget/YOUR_PRODUCT_ID" 
        width="100%" height="600"></iframe>`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Requirements */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Device Requirements</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">Mobile (Recommended)</h3>
                  <ul className="space-y-3 text-[#4B5563]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2D8C88]">✓</span>
                      <span>iPhone 7 or newer (iOS 11.1+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2D8C88]">✓</span>
                      <span>Android 8.0+ with camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2D8C88]">✓</span>
                      <span>Minimum 2GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2D8C88]">✓</span>
                      <span>Rear camera: 8MP or higher</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">Desktop</h3>
                  <ul className="space-y-3 text-[#4B5563]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#F28C38]">ℹ</span>
                      <span>Desktop users see QR code to continue on mobile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F28C38]">ℹ</span>
                      <span>Webcam support for try-on (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F28C38]">ℹ</span>
                      <span>Modern browser with WebRTC support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Network Requirements */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Network & Performance</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Minimum Connection</h3>
                    <p className="text-gray-600">
                    3G connection or faster (4G/5G recommended for best experience)
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Processing Time</h3>
                    <p className="text-gray-600">
                    8-10 seconds for results (varies by network speed)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 py-20 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-semibold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/95 mb-8">
              All requirements met? Start converting browsers into buyers today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-block bg-white text-[#2D8C88] px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/how-it-works"
                className="inline-block border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-[#2D8C88] transition-all duration-200"
              >
                Learn How It Works
              </Link>
            </div>
            <p className="mt-6 text-white/90 text-sm">No credit card required • Setup in minutes</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
