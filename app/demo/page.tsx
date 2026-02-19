import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import EmbedWidget from "@/components/vto/EmbedWidget";
import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

export default async function Demo() {
  const supabase = createSupabaseAdminClient();
  const demoProductIds = process.env.NEXT_PUBLIC_DEMO_PRODUCT_IDS?.split(',').filter(Boolean);

  type ProductRow = { id: string; name: string | null; type: string | null; image_url: string | null; metadata: unknown; is_active: boolean };
  let products: ProductRow[] = [];

  if (demoProductIds && demoProductIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("id,name,type,image_url,metadata,is_active")
      .in("id", demoProductIds)
      .eq("is_active", true);
    if (data && data.length > 0) {
      products = data;
    }
  }

  if (products.length === 0) {
    const { data } = await supabase
      .from("products")
      .select("id,name,type,image_url,metadata,is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (data && data.length > 0) {
      products = data;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      <SiteNav />

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
              No demo products available yet.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Seed demo products from this project (no external files needed):
            </p>
            <code className="block text-left bg-gray-100 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto">
              node scripts/seed-demo-from-public.js
            </code>
            <p className="text-sm text-gray-500 mt-4">
              Restart the dev server after running the script, then refresh this page.
            </p>
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="border-t border-gray-200 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-center text-3xl font-serif text-[#1F2937]">How to Try On</h2>
            <p className="text-center text-[#4B5563] mb-12">Follow these simple steps to experience virtual try-on</p>
            <div className="space-y-6">
              <div className="flex gap-4 bg-[#F9FAFB] rounded-xl p-6 border border-gray-200">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] text-white font-bold text-lg shadow-md">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Click "Try It On"</h3>
                  <p className="text-[#4B5563]">
                    Select any product above and click the try-on button
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-[#F9FAFB] rounded-xl p-6 border border-gray-200">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] text-white font-bold text-lg shadow-md">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Allow Camera Access</h3>
                  <p className="text-[#4B5563]">
                    Grant camera permission when prompted (required for try-on)
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-[#F9FAFB] rounded-xl p-6 border border-gray-200">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] text-white font-bold text-lg shadow-md">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">Capture Your Photo</h3>
                  <p className="text-[#4B5563]">
                    Follow the on-screen guide to position your wrist or hand correctly
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-[#F9FAFB] rounded-xl p-6 border border-gray-200">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D8C88] to-[#F28C38] text-white font-bold text-lg shadow-md">
                  4
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1F2937]">See the Result</h3>
                  <p className="text-[#4B5563]">
                    Wait a few seconds for AI processing - see the product on your wrist in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#2D8C88] to-[#F28C38] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-semibold text-white mb-4">Ready to Add This to Your Store?</h2>
            <p className="text-xl text-white/95 mb-8">
              Set up virtual try-on for your entire jewelry catalog in under 10 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-block bg-white text-[#2D8C88] px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/"
                className="inline-block border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-[#2D8C88] transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
            <p className="mt-6 text-white/90 text-sm">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
