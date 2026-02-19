"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import SiteFooter from "@/components/layout/SiteFooter";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard/admin");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      <div className="flex flex-1">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2D8C88] to-[#F28C38] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 text-white">
            <Image 
              src="/imgs/logo-only.png" 
              alt="ViaTryon" 
              width={48} 
              height={48} 
              priority
              className="h-12 w-12" 
            />
            <span className="font-serif text-3xl font-medium tracking-tight">
              ViaTryon
            </span>
          </Link>
        </div>
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-serif font-semibold mb-4">
            Welcome Back to Your Dashboard
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Manage your virtual try-on products and track performance metrics.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Product Management</h3>
                <p className="text-white/80 text-sm">Upload and configure your jewelry catalog</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics & Insights</h3>
                <p className="text-white/80 text-sm">Track engagement and conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/imgs/logo-only.png" alt="ViaTryon" width={40} height={40} className="h-10 w-10" />
              <span className="font-serif text-2xl font-medium text-[#1F2937] tracking-tight">
                ViaTryon
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">Sign In</h1>
            <p className="text-[#4B5563] mb-8">
              Access your ViaTryOn dashboard
            </p>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Email Address</label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Password
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                className="w-full bg-[#2D8C88] text-white py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#4B5563]">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#2D8C88] font-semibold hover:text-[#F28C38] transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#4B5563] hover:text-[#2D8C88] transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
