"use client";

import React, { useState, useCallback } from "react";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const AdminTenantForm = React.memo(() => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
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
  }, [name, slug]);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    setSlug(slugify(value));
  }, []);

  const handleSlugChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(event.target.value));
  }, []);

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider">Add New Store</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
          placeholder="Store name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#1F2937] focus:border-[#2D8C88] focus:ring-2 focus:ring-[#2D8C88]/20 outline-none transition-all"
          placeholder="store-slug"
          value={slug}
          onChange={handleSlugChange}
          required
        />
      </div>
      <button
        className="rounded-full bg-[#2D8C88] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#F28C38] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Store"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-[#2D8C88]"}`}>{message}</p>
      )}
    </form>
  );
});

AdminTenantForm.displayName = 'AdminTenantForm';

export default AdminTenantForm;
