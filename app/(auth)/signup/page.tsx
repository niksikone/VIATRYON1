import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      <SiteNav />
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="mb-3 text-3xl font-serif font-semibold text-[#1F2937]">
            Signups are disabled
          </h1>
          <p className="text-[#4B5563] mb-8">
            Accounts are created by the platform administrator. Contact your admin or try logging in if you already have an account.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#2D8C88] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200"
          >
            Go to login
          </Link>
          <div className="mt-6">
            <Link href="/" className="text-sm text-[#4B5563] hover:text-[#2D8C88] transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
