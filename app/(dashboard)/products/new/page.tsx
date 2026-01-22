"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<JewelryType>("watch");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, number>>(
    defaultMetadata.watch
  );
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTenant = async () => {
      const { data: userResult } = await supabase.auth.getUser();
      const userId = userResult.user?.id;
      if (!userId) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", userId)
        .maybeSingle();
      setTenantId(profile?.tenant_id || null);
    };
    loadTenant();
  }, [supabase]);

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
      setError("Missing tenant profile.");
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

    router.push("/dashboard/products");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New product</h1>
        <p className="text-sm text-neutral-400">
          Upload a product image and configure Perfect Corp settings.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Product name
          </label>
          <input
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Jewelry type
          </label>
          <select
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
            value={type}
            onChange={(event) => setType(event.target.value as JewelryType)}
          >
            <option value="watch">Watch</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Product image
          </label>
          <input
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Price (optional)
          </label>
          <input
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-200">
            VTO configuration
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(metadata).map(([key, value]) => (
              <label key={key} className="text-xs text-neutral-300">
                {key}
                <input
                  className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white"
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(event) =>
                    updateMetadata(key, Number(event.target.value))
                  }
                />
              </label>
            ))}
          </div>
        </div>
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create product"}
          </button>
          <button
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300"
            type="button"
            onClick={() => router.push("/dashboard/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
