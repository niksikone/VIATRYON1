"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

type JewelryType = "watch" | "ring" | "bracelet";

const defaultMetadata: Record<JewelryType, Record<string, number>> = {
  watch: {
    watch_wearing_location: 0.3,
    watch_shadow_intensity: 0.15,
    watch_ambient_light_intensity: 1,
  },
  bracelet: {
    bracelet_wearing_location: 0.3,
    bracelet_shadow_intensity: 0.15,
    bracelet_ambient_light_intensity: 1,
  },
  ring: {
    ring_wearing_location: 0.3,
    ring_shadow_intensity: 0.15,
    ring_ambient_light_intensity: 1,
  },
};

export default function TenantNewProductPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.tenantId as string;
  const supabase = createSupabaseBrowserClient();

  const [name, setName] = useState("");
  const [type, setType] = useState<JewelryType>("watch");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, number>>(
    defaultMetadata.watch
  );
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: userResult } = await supabase.auth.getUser();
      const userId = userResult.user?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      // Admin access is enforced by middleware (service role key bypasses RLS).
      // If the user reached this page, they are an admin.
      setIsAdmin(true);

      // Fetch tenant name for the breadcrumb
      const { data: tenant } = await supabase
        .from("tenants")
        .select("name")
        .eq("id", tenantId)
        .maybeSingle();

      setTenantName(tenant?.name || null);
      setChecking(false);
    };

    checkAccess();
  }, [supabase, tenantId, router]);

  useEffect(() => {
    setMetadata(defaultMetadata[type]);
  }, [type]);

  const updateMetadata = (key: string, value: number) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!tenantId) {
      setError("Missing tenant context.");
      return;
    }
    if (!image) {
      setError("Product image is required.");
      return;
    }

    setLoading(true);

    const fileExt = image.name.split(".").pop();
    const path = `${tenantId}/${crypto.randomUUID()}.${
      fileExt || "png"
    }`.toLowerCase();

    const { error: uploadError } = await supabase.storage
      .from("jewelry-products")
      .upload(path, image, { upsert: false });

    if (uploadError) {
      setLoading(false);
      setError(uploadError.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("jewelry-products")
      .getPublicUrl(path);

    const { error: insertError } = await supabase.from("products").insert({
      tenant_id: tenantId,
      name,
      type,
      image_url: publicUrl.publicUrl,
      price: price ? Number(price) : null,
      metadata,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/dashboard/admin/${tenantId}`);
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2D8C88]" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#4B5563]">
        <Link
          href="/dashboard/admin"
          className="hover:text-[#2D8C88] transition-colors"
        >
          Stores
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          href={`/dashboard/admin/${tenantId}`}
          className="hover:text-[#2D8C88] transition-colors"
        >
          {tenantName || "Store"}
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1F2937] font-medium">Add Product</span>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">
          Add Product for {tenantName || "Store"}
        </h1>
        <p className="text-[#4B5563]">
          Upload a jewelry product and configure virtual try-on settings for this store
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Basic Information */}
        <div className="bg-[#F9FAFB] rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Product Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                placeholder="e.g., Classic Silver Watch"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Jewelry Type
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                value={type}
                onChange={(event) => setType(event.target.value as JewelryType)}
              >
                <option value="watch">Watch</option>
                <option value="ring">Ring</option>
                <option value="bracelet">Bracelet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#4B5563]">$</span>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Product Image
              </label>
              <div className="mt-2">
                <input
                  className="w-full text-sm text-[#4B5563] file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2D8C88] file:text-white hover:file:bg-[#F28C38] file:cursor-pointer cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files?.[0] || null)}
                  required
                />
                <p className="mt-2 text-xs text-[#4B5563]">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Try-On Configuration */}
        <div className="bg-[#F9FAFB] rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1F2937]">Virtual Try-On Settings</h2>
            <p className="text-sm text-[#4B5563] mt-1">Fine-tune how this product appears in AR</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#1F2937] mb-2 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(event) =>
                    updateMetadata(key, Number(event.target.value))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            className="bg-[#2D8C88] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Product"
            )}
          </button>
          <button
            className="border-2 border-gray-300 text-[#4B5563] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200"
            type="button"
            onClick={() => router.push(`/dashboard/admin/${tenantId}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
