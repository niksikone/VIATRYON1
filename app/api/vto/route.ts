import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TaskStatus = "pending" | "success" | "error";

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

/**
 * Polls the Perfect Corp status endpoint until success or error.
 */
/**
 * Polls the Perfect Corp status endpoint until success or error.
 */
async function pollTaskStatus(
  taskId: string,
  apiKey: string,
  apiUrl: string,
  pollEndpoint: string
): Promise<{ error?: string; status?: number; data?: any }> {
  const pollUrl = `${apiUrl}${pollEndpoint}/${taskId}`;
  const maxRetries = 15; // Increased retries for slower processing
  const interval = 2000; // 2 seconds between polls

  for (let i = 0; i < maxRetries; i++) {
    await sleep(interval);

    try {
      const response = await fetch(pollUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (result?.status === 200) {
        const taskStatus = result.data?.task_status;

        if (taskStatus === "success") {
          console.log("VTO Task Successful");
          return { data: result.data };
        } else if (taskStatus === "error") {
          console.error("VTO Task Error:", result.data?.error_message);
          return {
            error: result.data?.error_message || "Task failed",
            status: 400,
          };
        }
        // If status is 'processing' or 'pending', loop continues
        console.log(`Task status: ${taskStatus} (Attempt ${i + 1}/${maxRetries})...`);
      } else if (response.status === 401) {
        return { error: "Authentication failed during polling", status: 401 };
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }

  return { error: "Task timed out during polling", status: 504 };
}

const extractResultUrl = (payload: any) => {
  // Perfect Corp watch VTO returns results in data.results object
  if (payload?.data?.results) {
    const results = payload.data.results;
    // Try common result URL fields
    return (
      results.result_url ||
      results.url ||
      results.image_url ||
      results.output_url ||
      null
    );
  }
  // Fallback to other possible structures
  return (
    payload?.data?.result_url ||
    payload?.data?.resultUrl ||
    payload?.data?.result?.[0]?.url ||
    payload?.data?.result?.[0]?.result_url ||
    null
  );
};

/**
 * Get VTO endpoint and parameters based on product type
 */
function getVTOConfig(productType: string) {
  const type = productType.toLowerCase();
  
  switch (type) {
    case "watch":
      return {
        endpoint: "/s2s/v2.0/task/2d-vto/watch",
        pollEndpoint: "/s2s/v2.0/task/2d-vto/watch",
        parameters: {
          watch_need_remove_background: false,
          watch_wearing_location: 0.3,
          watch_shadow_intensity: 0.15,
          watch_ambient_light_intensity: 1,
        },
      };
    
    case "bracelet":
      return {
        endpoint: "/s2s/v2.0/task/2d-vto/bracelet",
        pollEndpoint: "/s2s/v2.0/task/2d-vto/bracelet",
        parameters: {
          bracelet_need_remove_background: false,
          bracelet_wearing_location: 0.3,
          bracelet_shadow_intensity: 0.15,
          bracelet_ambient_light_intensity: 1,
        },
      };
    
    case "ring":
      return {
        endpoint: "/s2s/v2.0/task/2d-vto/ring",
        pollEndpoint: "/s2s/v2.0/task/2d-vto/ring",
        parameters: {
          ring_need_remove_background: false,
          ring_wearing_location: 0.3,
          ring_shadow_intensity: 0.15,
          ring_ambient_light_intensity: 1,
        },
      };
    
    default:
      throw new Error(`Unsupported product type: ${productType}`);
  }
}

/**
 * Helper function to create and poll a single VTO task
 */
async function createAndPollVTOTask(params: {
  apiKey: string;
  baseUrl: string;
  sourceUrl: string;
  productImageUrl: string;
  productType: string;
  metadata: Record<string, any>;
}): Promise<{ resultUrl?: string; error?: string; taskId?: string; maskUrl?: string }> {
  const { apiKey, baseUrl, sourceUrl, productImageUrl, productType, metadata } = params;

  // Get VTO configuration based on product type
  const vtoConfig = getVTOConfig(productType);

  // Build parameter object with VTO parameters
  const parameter: any = { ...vtoConfig.parameters };

  // Add any custom metadata parameters (e.g., anchor points)
  if (productType.toLowerCase() === "watch" && metadata.watch_anchor_point && Array.isArray(metadata.watch_anchor_point)) {
    parameter.watch_anchor_point = metadata.watch_anchor_point;
  }
  if (productType.toLowerCase() === "bracelet" && metadata.bracelet_anchor_point && Array.isArray(metadata.bracelet_anchor_point)) {
    parameter.bracelet_anchor_point = metadata.bracelet_anchor_point;
  }
  if (productType.toLowerCase() === "ring" && metadata.ring_anchor_point && Array.isArray(metadata.ring_anchor_point)) {
    parameter.ring_anchor_point = metadata.ring_anchor_point;
  }

  const objectInfo: any = {
    name: productImageUrl,
    parameter,
  };

  if (metadata.ref_mask_url) {
    objectInfo.mask_name = metadata.ref_mask_url;
  }

  const payload: any = {
    src_file_url: sourceUrl,
    source_info: { name: sourceUrl },
    ref_file_urls: [productImageUrl],
    ref_file_ids: [],
    refmsk_file_urls: [],
    refmsk_file_ids: [],
    object_infos: [objectInfo],
  };

  if (metadata.src_mask_url) {
    payload.srcmsk_file_url = metadata.src_mask_url;
    payload.source_info.mask_name = metadata.src_mask_url;
  }

  if (metadata.ref_mask_url) {
    payload.refmsk_file_urls = [metadata.ref_mask_url];
  }

  const apiEndpoint = `${baseUrl}${vtoConfig.endpoint}`;
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  };

  console.log(`[PERFECT CORP] Creating ${productType} VTO task - THIS WILL CHARGE 1 UNIT`);

  try {
    const initResponse = await fetch(apiEndpoint, fetchOptions);
    const initData = await initResponse.json().catch(() => null);

    if (!initResponse.ok || initData?.status !== 200) {
      console.error(`Perfect Corp Task Creation Failed:`, JSON.stringify(initData, null, 2));
      return { error: `Task creation failed` };
    }

    const taskId = initData.data?.task_id;
    if (!taskId) {
      console.error(`No task_id in response`);
      return { error: `No task ID returned` };
    }

    console.log(`${productType} Task Created. ID: ${taskId}. Starting polling...`);

    const pollResult = await pollTaskStatus(taskId, apiKey, baseUrl, vtoConfig.pollEndpoint);

    if (pollResult.error) {
      return { error: pollResult.error, taskId };
    }

    // Log full response to discover mask/segmentation data
    console.log(`[PERFECT CORP RESPONSE] Full data:`, JSON.stringify(pollResult.data, null, 2));

    const resultUrl = extractResultUrl({ data: pollResult.data });

    if (!resultUrl) {
      return { error: `No result URL found`, taskId };
    }

    console.log(`[${productType}] Result URL: ${resultUrl}`);
    
    // Check for mask/segmentation data
    const maskUrl = pollResult.data?.results?.mask_url || 
                    pollResult.data?.mask_url ||
                    pollResult.data?.results?.segmentation_url ||
                    null;
    
    if (maskUrl) {
      console.log(`[MASK FOUND] ${maskUrl}`);
    } else {
      console.log(`[MASK NOT FOUND] Perfect Corp may not provide mask data for ${productType} VTO`);
    }
    
    return { resultUrl, taskId, maskUrl };
  } catch (error) {
    console.error(`Network error during VTO:`, error);
    return { error: `Network error` };
  }
}

export async function POST(request: Request) {
  const supabaseAdmin = createSupabaseAdminClient();
  const formData = await request.formData();
  const sessionId = String(formData.get("sessionId") || "");
  const productId = String(formData.get("productId") || "");
  const file = formData.get("file");

  if (!sessionId || !productId || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing sessionId, productId, or file." },
      { status: 400 }
    );
  }

  // No wrist size validation - client handles visual scaling
  // API always generates baseline 60mm result

  // Validate file before processing - CRITICAL: Perfect Corp charges on task creation
  // Reject obviously invalid files to prevent wasted charges
  if (file.size < 1000) {
    return NextResponse.json(
      { error: "File too small. Please capture a valid image." },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Invalid file type. Please upload an image." },
      { status: 400 }
    );
  }

  const { data: session } = await supabaseAdmin
    .from("vto_sessions")
    .select("id,tenant_id,product_id,task_id,status")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.product_id !== productId) {
    return NextResponse.json({ error: "Invalid session." }, { status: 404 });
  }

  // CRITICAL: If a task was already created for this session, don't create another
  // This prevents duplicate charges if user retries
  if (session.task_id && session.status === "pending") {
    return NextResponse.json(
      { error: "Task already in progress. Please wait for the current attempt to complete." },
      { status: 400 }
    );
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id,type,image_url,metadata")
    .eq("id", productId)
    .maybeSingle();

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const path = `${session.tenant_id}/${session.id}/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("vto-captures")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 400 }
    );
  }

  const { data: publicUrl } = supabaseAdmin.storage
    .from("vto-captures")
    .getPublicUrl(path);

  const sourceUrl = publicUrl.publicUrl;

  // Update session with source image (wrist size handled client-side)
  await supabaseAdmin
    .from("vto_sessions")
    .update({ 
      source_image_url: sourceUrl, 
      status: "pending"
    })
    .eq("id", session.id);

  const apiKey = (process.env.PERFECT_CORP_API_KEY || "").trim();
  const baseUrl =
    process.env.PERFECT_CORP_API_URL ||
    "https://yce-api-01.makeupar.com";

  // Diagnostic check: Ensure API key exists and has the correct prefix
  if (!apiKey) {
    console.error("Configuration Error: PERFECT_CORP_API_KEY is missing.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Clean the key: remove any accidental quotes or whitespace
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");

  // Validate API key format
  const keyValidation = validateApiKeyFormat(cleanKey);
  if (!keyValidation.valid) {
    console.error("API Key Format Validation Failed:", keyValidation.error);
    await supabaseAdmin
      .from("vto_sessions")
      .update({
        status: "error",
        error_message: keyValidation.error || "Invalid API key format",
      })
      .eq("id", session.id);
    return NextResponse.json(
      {
        error: "API key validation failed",
        details: keyValidation.error,
      },
      { status: 500 }
    );
  }

  // LOGGING FOR DEBUGGING
  console.log(`Attempting VTO with Key Prefix: ${cleanKey.substring(0, 8)}...`);
  console.log(`Key Length: ${cleanKey.length} characters`);
  console.log(`[VTO] Product Type: ${product.type}`);

  const metadata = product.metadata || {};

  try {
    // Create VTO task based on product type
    console.log(`[VTO] Creating ${product.type} try-on task...`);

    const result = await createAndPollVTOTask({
      apiKey: cleanKey,
      baseUrl,
      sourceUrl,
      productImageUrl: product.image_url,
      productType: product.type,
      metadata,
    });

    if (result.error || !result.resultUrl) {
      await supabaseAdmin
        .from("vto_sessions")
        .update({
          status: "error",
          task_id: result.taskId || null,
          error_message: result.error || "VTO task failed",
        })
        .eq("id", session.id);

      return NextResponse.json(
        { error: result.error || "VTO task failed" },
        { status: 500 }
      );
    }

    // Save task_id and mark as pending
    await supabaseAdmin
      .from("vto_sessions")
      .update({
        task_id: result.taskId || null,
        status: "pending",
      })
      .eq("id", session.id);

    // Check if already succeeded (prevent double charges on retries)
    const { data: existingSession } = await supabaseAdmin
      .from("vto_sessions")
      .select("status,result_url")
      .eq("id", session.id)
      .single();

    const alreadySucceeded = existingSession?.status === "success" && existingSession?.result_url;

    // Deduct 1 unit for custom size VTO
    if (!alreadySucceeded) {
      const { data: tenant } = await supabaseAdmin
        .from("tenants")
        .select("api_units")
        .eq("id", session.tenant_id)
        .single();

      if (tenant && tenant.api_units > 0) {
        await supabaseAdmin
          .from("tenants")
          .update({ api_units: tenant.api_units - 1 })
          .eq("id", session.tenant_id);
        console.log(
          `[UNIT DEDUCTED] Tenant ${session.tenant_id}. Product: ${product.type}. Remaining: ${tenant.api_units - 1}`
        );
      } else {
        console.warn(
          `[UNIT WARNING] Cannot decrement units for tenant ${session.tenant_id}. Current units: ${tenant?.api_units || 0}`
        );
      }
    } else {
      console.log(`[UNIT SKIP] Session ${session.id} already succeeded - NOT deducting units again`);
    }

    await supabaseAdmin
      .from("vto_sessions")
      .update({
        status: "success",
        result_url: result.resultUrl,
      })
      .eq("id", session.id);

    console.log(`[RESULT URL] ${result.resultUrl}`);
    try {
      const parsedUrl = new URL(result.resultUrl);
      console.log(`[RESULT URL DOMAIN] ${parsedUrl.hostname}`);
    } catch (e) {
      console.warn("[RESULT URL] Could not parse URL:", result.resultUrl);
    }

    // Return result URL and mask URL (if available) for client-side canvas manipulation
    return NextResponse.json({ 
      resultUrl: result.resultUrl,
      maskUrl: result.maskUrl || null 
    });
  } catch (error) {
    console.error("Network/Server Error during VTO call:", error);
    await supabaseAdmin
      .from("vto_sessions")
      .update({
        status: "error",
        error_message:
          error instanceof Error ? error.message : "Network error",
      })
      .eq("id", session.id);

    return NextResponse.json(
      { error: "Network error during VTO processing" },
      { status: 500 }
    );
  }
}
