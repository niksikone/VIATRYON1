"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

type JewelryType = "watch" | "ring" | "bracelet";

const VALID_TYPES: JewelryType[] = ["watch", "ring", "bracelet"];

type ParsedRow = {
  rowIndex: number;
  name: string;
  type: string;
  price: string;
  image_url: string;
  errors: string[];
};

type ImportResult = {
  rowIndex: number;
  name: string;
  status: "success" | "error";
  error?: string;
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        row.push(current.trim());
        current = "";
        if (row.some((cell) => cell !== "")) {
          rows.push(row);
        }
        row = [];
        if (char === "\r") i++;
      } else {
        current += char;
      }
    }
  }

  // Last row
  row.push(current.trim());
  if (row.some((cell) => cell !== "")) {
    rows.push(row);
  }

  return rows;
}

function validateRow(row: string[], rowIndex: number): ParsedRow {
  const [name = "", type = "", price = "", image_url = ""] = row;
  const errors: string[] = [];

  if (!name) errors.push("Name is required");
  if (!type) {
    errors.push("Type is required");
  } else if (!VALID_TYPES.includes(type.toLowerCase() as JewelryType)) {
    errors.push(`Type must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!image_url) {
    errors.push("Image URL is required");
  } else {
    try {
      new URL(image_url);
    } catch {
      errors.push("Image URL must be a valid URL");
    }
  }
  if (price && isNaN(Number(price))) {
    errors.push("Price must be a number");
  }

  return {
    rowIndex,
    name,
    type: type.toLowerCase(),
    price,
    image_url,
    errors,
  };
}

export default function BulkImportPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.tenantId as string;
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tenantName, setTenantName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [phase, setPhase] = useState<"upload" | "preview" | "importing" | "done">("upload");
  const [fileError, setFileError] = useState<string | null>(null);

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

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setFileError("Please upload a .csv file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File too large. Maximum 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setFileError("Could not read file.");
        return;
      }

      const rawRows = parseCSV(text);

      if (rawRows.length === 0) {
        setFileError("CSV file is empty.");
        return;
      }

      // Check if first row is a header
      const firstRow = rawRows[0];
      const isHeader =
        firstRow[0]?.toLowerCase() === "name" ||
        firstRow[0]?.toLowerCase() === "product name" ||
        firstRow[1]?.toLowerCase() === "type";

      const dataRows = isHeader ? rawRows.slice(1) : rawRows;

      if (dataRows.length === 0) {
        setFileError("CSV file has no data rows (only a header).");
        return;
      }

      const validated = dataRows.map((row, i) => validateRow(row, i + 1 + (isHeader ? 1 : 0)));
      setParsedRows(validated);
      setPhase("preview");
    };

    reader.onerror = () => {
      setFileError("Failed to read file.");
    };

    reader.readAsText(file);
  }, []);

  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const invalidRows = parsedRows.filter((r) => r.errors.length > 0);

  const handleImport = useCallback(async () => {
    if (validRows.length === 0) return;

    setPhase("importing");
    setImporting(true);
    setProgress(0);
    setResults([]);

    const BATCH_SIZE = 20;
    const allResults: ImportResult[] = [];

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE);

      const insertData = batch.map((row) => ({
        tenant_id: tenantId,
        name: row.name,
        type: row.type,
        image_url: row.image_url,
        price: row.price ? Number(row.price) : null,
        metadata:
          row.type === "watch"
            ? { watch_wearing_location: 0.3, watch_shadow_intensity: 0.15, watch_ambient_light_intensity: 1 }
            : row.type === "bracelet"
            ? { bracelet_wearing_location: 0.3, bracelet_shadow_intensity: 0.15, bracelet_ambient_light_intensity: 1 }
            : { ring_wearing_location: 0.3, ring_shadow_intensity: 0.15, ring_ambient_light_intensity: 1 },
      }));

      const { error } = await supabase.from("products").insert(insertData);

      if (error) {
        // If batch fails, try individually
        for (const row of batch) {
          const { error: singleError } = await supabase.from("products").insert({
            tenant_id: tenantId,
            name: row.name,
            type: row.type,
            image_url: row.image_url,
            price: row.price ? Number(row.price) : null,
            metadata:
              row.type === "watch"
                ? { watch_wearing_location: 0.3, watch_shadow_intensity: 0.15, watch_ambient_light_intensity: 1 }
                : row.type === "bracelet"
                ? { bracelet_wearing_location: 0.3, bracelet_shadow_intensity: 0.15, bracelet_ambient_light_intensity: 1 }
                : { ring_wearing_location: 0.3, ring_shadow_intensity: 0.15, ring_ambient_light_intensity: 1 },
          });

          allResults.push({
            rowIndex: row.rowIndex,
            name: row.name,
            status: singleError ? "error" : "success",
            error: singleError?.message,
          });
        }
      } else {
        // Batch succeeded
        for (const row of batch) {
          allResults.push({
            rowIndex: row.rowIndex,
            name: row.name,
            status: "success",
          });
        }
      }

      setProgress(Math.min(i + BATCH_SIZE, validRows.length));
      setResults([...allResults]);
    }

    setImporting(false);
    setPhase("done");
  }, [validRows, tenantId, supabase]);

  const handleReset = useCallback(() => {
    setParsedRows([]);
    setResults([]);
    setProgress(0);
    setFileError(null);
    setPhase("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2D8C88]" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#4B5563] flex-wrap">
        <Link href="/dashboard/admin" className="hover:text-[#2D8C88] transition-colors">
          Stores
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/dashboard/admin/${tenantId}`} className="hover:text-[#2D8C88] transition-colors">
          {tenantName || "Store"}
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1F2937] font-medium">Bulk Import</span>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">
          Bulk Import Products
        </h1>
        <p className="text-[#4B5563]">
          Upload a CSV file to add multiple products to {tenantName || "this store"} at once
        </p>
      </div>

      {/* Upload Phase */}
      {phase === "upload" && (
        <div className="space-y-6">
          {/* CSV Format Guide */}
          <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-3">CSV Format</h2>
            <p className="text-sm text-[#4B5563] mb-4">
              Your CSV file should have 4 columns in this order. A header row is optional and will be auto-detected.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 text-[#1F2937] font-semibold">Column</th>
                    <th className="text-left py-2 px-3 text-[#1F2937] font-semibold">Required</th>
                    <th className="text-left py-2 px-3 text-[#1F2937] font-semibold">Description</th>
                    <th className="text-left py-2 px-3 text-[#1F2937] font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="text-[#4B5563]">
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 font-mono text-xs bg-gray-100 rounded">name</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">Product name</td>
                    <td className="py-2 px-3">Classic Silver Watch</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 font-mono text-xs bg-gray-100 rounded">type</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">watch, ring, or bracelet</td>
                    <td className="py-2 px-3">watch</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 font-mono text-xs bg-gray-100 rounded">price</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Numeric price</td>
                    <td className="py-2 px-3">299.99</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-xs bg-gray-100 rounded">image_url</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">Full URL to product image</td>
                    <td className="py-2 px-3 break-all">https://cdn.store.com/watch1.png</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-lg bg-white border border-gray-200 p-4">
              <p className="text-xs font-medium text-[#4B5563] mb-2 uppercase tracking-wider">Example CSV</p>
              <code className="block text-sm text-[#1F2937] font-mono whitespace-pre bg-gray-50 rounded-lg p-3">
{`name,type,price,image_url
Classic Silver Watch,watch,299.99,https://cdn.store.com/watch1.png
Gold Diamond Ring,ring,1299.00,https://cdn.store.com/ring1.png
Pearl Bracelet,bracelet,449.50,https://cdn.store.com/bracelet1.png`}
              </code>
            </div>
          </div>

          {/* File Upload */}
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center hover:border-[#2D8C88] transition-colors">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-[#1F2937] font-medium mb-2">Upload your CSV file</p>
            <p className="text-sm text-[#4B5563] mb-4">Up to 5MB, .csv format</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm text-[#4B5563] file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2D8C88] file:text-white hover:file:bg-[#F28C38] file:cursor-pointer cursor-pointer"
            />
          </div>

          {fileError && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{fileError}</span>
            </div>
          )}
        </div>
      )}

      {/* Preview Phase */}
      {phase === "preview" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4">
              <p className="text-xs uppercase tracking-wider text-[#4B5563] font-medium mb-1">Total Rows</p>
              <p className="text-2xl font-bold text-[#1F2937]">{parsedRows.length}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wider text-green-700 font-medium mb-1">Valid</p>
              <p className="text-2xl font-bold text-green-700">{validRows.length}</p>
            </div>
            <div className={`rounded-xl border p-4 ${invalidRows.length > 0 ? "border-red-200 bg-red-50" : "border-gray-200 bg-[#F9FAFB]"}`}>
              <p className={`text-xs uppercase tracking-wider font-medium mb-1 ${invalidRows.length > 0 ? "text-red-700" : "text-[#4B5563]"}`}>Errors</p>
              <p className={`text-2xl font-bold ${invalidRows.length > 0 ? "text-red-700" : "text-[#1F2937]"}`}>{invalidRows.length}</p>
            </div>
          </div>

          {/* Error rows */}
          {invalidRows.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <h3 className="font-semibold text-red-800 mb-3">Rows with errors (will be skipped)</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {invalidRows.map((row) => (
                  <div key={row.rowIndex} className="flex items-start gap-2 text-sm text-red-700 bg-white rounded-lg px-3 py-2 border border-red-100">
                    <span className="font-mono text-xs bg-red-100 px-1.5 py-0.5 rounded flex-shrink-0">Row {row.rowIndex}</span>
                    <span className="font-medium flex-shrink-0">{row.name || "(no name)"}</span>
                    <span className="text-red-500">—</span>
                    <span>{row.errors.join("; ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview table */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 bg-[#F9FAFB] border-b border-gray-200">
              <h3 className="font-semibold text-[#1F2937]">Preview ({validRows.length} products to import)</h3>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">#</th>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">Name</th>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">Type</th>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">Price</th>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">Image URL</th>
                    <th className="text-left py-2 px-4 text-[#4B5563] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 100).map((row) => (
                    <tr key={row.rowIndex} className={`border-t border-gray-100 ${row.errors.length > 0 ? "bg-red-50/50" : ""}`}>
                      <td className="py-2 px-4 text-[#4B5563] font-mono text-xs">{row.rowIndex}</td>
                      <td className="py-2 px-4 text-[#1F2937] font-medium">{row.name || "—"}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          VALID_TYPES.includes(row.type as JewelryType)
                            ? "bg-[#2D8C88]/10 text-[#2D8C88]"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {row.type || "—"}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-[#4B5563]">{row.price ? `$${Number(row.price).toFixed(2)}` : "—"}</td>
                      <td className="py-2 px-4 text-[#4B5563] max-w-xs truncate text-xs font-mono">{row.image_url || "—"}</td>
                      <td className="py-2 px-4">
                        {row.errors.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Error
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 100 && (
                <div className="px-4 py-2 text-sm text-[#4B5563] bg-gray-50 border-t border-gray-100">
                  Showing first 100 of {parsedRows.length} rows...
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              className="bg-[#2D8C88] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleImport}
              disabled={validRows.length === 0}
            >
              Import {validRows.length} Products
            </button>
            <button
              className="border-2 border-gray-300 text-[#4B5563] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200"
              onClick={handleReset}
            >
              Upload Different File
            </button>
            <button
              className="border-2 border-gray-300 text-[#4B5563] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200"
              onClick={() => router.push(`/dashboard/admin/${tenantId}`)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Importing Phase */}
      {phase === "importing" && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#2D8C88]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#1F2937]">Importing products...</p>
            <p className="text-sm text-[#4B5563] mt-1">{progress} of {validRows.length} processed</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#2D8C88] h-3 rounded-full transition-all duration-300"
              style={{ width: `${validRows.length > 0 ? (progress / validRows.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Done Phase */}
      {phase === "done" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className={`rounded-xl border p-6 text-center ${
            errorCount === 0
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }`}>
            <div className="text-4xl mb-3">{errorCount === 0 ? "✅" : "⚠️"}</div>
            <h2 className={`text-xl font-semibold mb-2 ${errorCount === 0 ? "text-green-800" : "text-yellow-800"}`}>
              {errorCount === 0 ? "Import Complete!" : "Import Completed with Errors"}
            </h2>
            <p className={`text-sm ${errorCount === 0 ? "text-green-700" : "text-yellow-700"}`}>
              {successCount} products imported successfully
              {errorCount > 0 && `, ${errorCount} failed`}
            </p>
          </div>

          {/* Error details */}
          {errorCount > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <h3 className="font-semibold text-red-800 mb-3">Failed imports</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {results
                  .filter((r) => r.status === "error")
                  .map((r) => (
                    <div key={r.rowIndex} className="flex items-start gap-2 text-sm text-red-700 bg-white rounded-lg px-3 py-2 border border-red-100">
                      <span className="font-mono text-xs bg-red-100 px-1.5 py-0.5 rounded flex-shrink-0">Row {r.rowIndex}</span>
                      <span className="font-medium flex-shrink-0">{r.name}</span>
                      <span className="text-red-500">—</span>
                      <span>{r.error || "Unknown error"}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link
              href={`/dashboard/admin/${tenantId}`}
              className="bg-[#2D8C88] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Store Products
            </Link>
            <button
              className="border-2 border-gray-300 text-[#4B5563] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200"
              onClick={handleReset}
            >
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
