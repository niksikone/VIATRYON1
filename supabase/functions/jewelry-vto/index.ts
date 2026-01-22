import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validate V2 API key format
 * V2 keys should start with 'sk-' and not be V1 tokens (access_token, id_token, client_secret)
 */
function validateApiKeyFormat(key: string): { valid: boolean; error?: string } {
  const trimmed = key.trim();

  // V2 keys should start with 'sk-'
  if (!trimmed.startsWith("sk-")) {
    return {
      valid: false,
      error:
        'API key does not appear to be a V2 S2S Secret Key. V2 keys start with "sk-". Ensure you are not using a V1 access_token, id_token, or client_secret.',
    };
  }

  // Basic length check (V2 keys are typically longer)
  if (trimmed.length < 20) {
    return {
      valid: false,
      error:
        "API key appears to be too short. V2 S2S Secret Keys are typically longer.",
    };
  }

  return { valid: true };
}

const extractResultUrl = (payload: any) => {
  return (
    payload?.data?.result_url ||
    payload?.data?.resultUrl ||
    payload?.data?.result?.[0]?.url ||
    payload?.data?.result?.[0]?.result_url ||
    null
  );
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiUrl = Deno.env.get("PERFECT_CORP_API_URL") || "";
  const rawApiKey = Deno.env.get("PERFECT_CORP_API_KEY") || "";

  if (!apiUrl || !rawApiKey) {
    return new Response("Perfect Corp API not configured", { status: 500 });
  }

  // Clean the key: remove any accidental quotes or whitespace
  const apiKey = rawApiKey.trim().replace(/^["']|["']$/g, "");

  // Validate API key format
  const keyValidation = validateApiKeyFormat(apiKey);
  if (!keyValidation.valid) {
    console.error("API Key Format Validation Failed:", keyValidation.error);
    return new Response(
      JSON.stringify({
        error: "API key validation failed",
        details: keyValidation.error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json().catch(() => null);
  const type = body?.type as string | undefined;
  const srcFileUrl = body?.src_file_url as string | undefined;
  const refFileUrls = body?.ref_file_urls as string[] | undefined;
  const metadata = body?.metadata || {};

  if (!type || !srcFileUrl || !refFileUrls?.length) {
    return new Response("Missing required payload", { status: 400 });
  }

  const taskResponse = await fetch(`${apiUrl}/s2s/v2.0/task/2d-vto/${type}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      src_file_url: srcFileUrl,
      ref_file_urls: refFileUrls,
      source_info: { name: srcFileUrl },
      object_infos: [metadata],
    }),
  });

  const taskPayload = await taskResponse.json().catch(() => null);
  const taskId = taskPayload?.data?.task_id;

  if (!taskResponse.ok || !taskId) {
    const errorDetails = {
      error: taskPayload?.error || "Task creation failed",
      status: taskPayload?.status || taskResponse.status,
    };

    // Enhanced 401 error handling
    if (taskPayload?.status === 401 || taskResponse.status === 401) {
      console.warn("--- AUTHENTICATION TROUBLESHOOTING ---");
      console.warn(
        '1. Authorization header format: Verify "Authorization: Bearer YOUR_API_KEY" (capital A, no colon after Bearer)'
      );
      console.warn(
        "2. Key type: Ensure you're using a V2 S2S Secret Key (starts with 'sk-'), not a V1 access_token/id_token/client_secret"
      );
      console.warn(
        "3. Key status: Check https://yce.makeupar.com/api-console/en/api-keys/ to verify key is active and not expired"
      );
      console.warn(
        "4. Environment: Ensure .env file has no quotes around the key value"
      );
    }

    return new Response(JSON.stringify(errorDetails), {
      status: taskPayload?.status || 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let status = "pending";
  let resultUrl: string | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await sleep(5000);
    const pollResponse = await fetch(
      `${apiUrl}/s2s/v2.0/task/2d-vto/${type}/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const pollPayload = await pollResponse.json().catch(() => null);
    status = pollPayload?.data?.task_status || status;
    resultUrl = extractResultUrl(pollPayload);

    if (status === "success" && resultUrl) {
      break;
    }

    if (status === "error") {
      break;
    }
  }

  if (status !== "success" || !resultUrl) {
    return new Response(JSON.stringify({ error: "Task failed or timed out" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ resultUrl, taskId }), {
    headers: { "Content-Type": "application/json" },
  });
});
