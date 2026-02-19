/**
 * Wrist Size Scaling Configuration
 * Maps wrist sizes to watch scale percentages
 */
export const WRIST_SIZE_SCALES = {
  small: 0.92, // 92% - watch appears smaller for small wrists
  medium: 1.0, // 100% - baseline
  large: 1.08, // 108% - watch appears larger for large wrists
} as const;

export type WristSize = keyof typeof WRIST_SIZE_SCALES;

/**
 * Scales an image using Canvas API (browser) or Sharp (server)
 * This is a client-side version for reference
 */
export async function scaleImageBrowser(
  imageUrl: string,
  scaleFactor: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Calculate new dimensions
      const newWidth = Math.round(img.width * scaleFactor);
      const newHeight = Math.round(img.height * scaleFactor);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw scaled image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, "image/png");
    };
    
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Server-side image scaling using canvas (for Next.js API routes)
 * Uses node-canvas or equivalent
 */
export async function scaleImageServer(
  imageBuffer: Buffer,
  scaleFactor: number
): Promise<Buffer> {
  // MVP: defer scaling to Perfect Corp's object_infos parameters
  return imageBuffer;
}

/**
 * Get scale factor for a wrist size
 */
export function getScaleForSize(size: WristSize): number {
  return WRIST_SIZE_SCALES[size];
}

/**
 * Get all wrist sizes
 */
export function getAllWristSizes(): WristSize[] {
  return Object.keys(WRIST_SIZE_SCALES) as WristSize[];
}
