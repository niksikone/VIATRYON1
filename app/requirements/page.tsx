import Link from "next/link";

export default function Requirements() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            VIATRYON
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="/requirements" className="text-sm text-gray-900 font-medium">
              Requirements
            </Link>
            <Link href="/demo" className="text-sm text-gray-600 hover:text-gray-900">
              Demo
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-gray-200 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900">Technical Requirements</h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know to integrate VIATRYON
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
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Integration Requirements</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <h3 className="mb-3 text-lg font-semibold">E-Commerce Platforms</h3>
                    <p className="mb-4 text-gray-600">
                  VIATRYON works with any platform that allows custom HTML/JavaScript:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    Shopify
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    WooCommerce
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    Magento
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    BigCommerce
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    Wix
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    Squarespace
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    Custom Sites
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm text-gray-700">
                    More...
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <h3 className="mb-3 text-lg font-semibold">Installation Methods</h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 font-semibold">Option 1: JavaScript Widget (Recommended)</div>
                    <div className="rounded-lg bg-gray-900 p-4">
                      <code className="text-xs text-green-400">
                        {`<script src="https://viatryon.com/embed.js"></script>`}
                        <br />
                        {`<div data-viatryon-product="YOUR_PRODUCT_ID"></div>`}
                      </code>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-semibold">Option 2: iframe Embed</div>
                    <div className="rounded-lg bg-gray-900 p-4">
                      <code className="text-xs text-green-400">
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
                  <h3 className="mb-4 text-lg font-semibold">Mobile (Recommended)</h3>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>iPhone 7 or newer (iOS 11.1+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Android 8.0+ with camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Minimum 2GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Rear camera: 8MP or higher</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Desktop</h3>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">ℹ</span>
                      <span>Desktop users see QR code to continue on mobile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">ℹ</span>
                      <span>Webcam support for try-on (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">ℹ</span>
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
      <section className="border-t border-gray-200 bg-emerald-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">All Requirements Met?</h2>
          <p className="mt-4 text-lg text-gray-600">
            You're ready to integrate VIATRYON into your jewelry store
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-lg bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Learn How It Works →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          © {new Date().getFullYear()} VIATRYON. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
