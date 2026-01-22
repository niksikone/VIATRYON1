"use client";

import { useState } from "react";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function AdminTenantForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    const payload = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error || "Failed to create tenant.");
      return;
    }

    setMessage("Tenant created.");
    setName("");
    setSlug("");
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
          placeholder="Store name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSlug(slugify(event.target.value));
          }}
          required
        />
        <input
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
          placeholder="store-slug"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          required
        />
      </div>
      <button
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create tenant"}
      </button>
      {message && (
        <p className="text-xs text-neutral-400">{message}</p>
      )}
    </form>
  );
}
