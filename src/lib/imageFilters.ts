import { FilterSettings } from '../types';

/**
 * Applies pixel-level image filters to an ImageData object and returns the modified ImageData.
 */
export function applyImageFilters(originalData: ImageData, filters: FilterSettings): ImageData {
  const width = originalData.width;
  const height = originalData.height;
  const src = originalData.data;
  
  // Clone source data
  const output = new ImageData(new Uint8ClampedArray(src), width, height);
  const dst = output.data;

  const { brightness, contrast, saturation, hue, blur, sepia, grayscale, invert } = filters;

  // 1. Pointwise Color Transformations (Brightness, Contrast, Saturation, Hue, Sepia, Grayscale, Invert)
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const hueRad = (hue * Math.PI) / 180;
  const cosHue = Math.cos(hueRad);
  const sinHue = Math.sin(hueRad);

  for (let i = 0; i < dst.length; i += 4) {
    let r = dst[i];
    let g = dst[i + 1];
    let b = dst[i + 2];
    const a = dst[i + 3];

    if (a === 0) continue; // Skip fully transparent pixels

    // Invert
    if (invert > 0) {
      const invRatio = invert / 100;
      r = r * (1 - invRatio) + (255 - r) * invRatio;
      g = g * (1 - invRatio) + (255 - g) * invRatio;
      b = b * (1 - invRatio) + (255 - b) * invRatio;
    }

    // Brightness
    if (brightness !== 0) {
      r += brightness * 2.55;
      g += brightness * 2.55;
      b += brightness * 2.55;
    }

    // Contrast
    if (contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // Grayscale
    if (grayscale > 0) {
      const grayRatio = grayscale / 100;
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - grayRatio) + gray * grayRatio;
      g = g * (1 - grayRatio) + gray * grayRatio;
      b = b * (1 - grayRatio) + gray * grayRatio;
    }

    // Sepia
    if (sepia > 0) {
      const sepiaRatio = sepia / 100;
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - sepiaRatio) + sr * sepiaRatio;
      g = g * (1 - sepiaRatio) + sg * sepiaRatio;
      b = b * (1 - sepiaRatio) + sb * sepiaRatio;
    }

    // Hue & Saturation
    if (hue !== 0 || saturation !== 0) {
      // Saturation matrix adjustment
      const satRatio = 1 + saturation / 100;
      const lumR = 0.213;
      const lumG = 0.715;
      const lumB = 0.072;

      // Combine Hue shift + Saturation
      const sr = (lumR + cosHue * (1 - lumR) + sinHue * -lumR) * satRatio;
      const sg = (lumG + cosHue * -lumG + sinHue * -lumG) * satRatio;
      const sb = (lumB + cosHue * -lumB + sinHue * (1 - lumB)) * satRatio;

      const newR = r * sr + g * sg + b * sb;
      const newG = r * (lumR + cosHue * -lumR + sinHue * 0.143) + g * (lumG + cosHue * (1 - lumG) + sinHue * 0.14) + b * (lumB + cosHue * -lumB + sinHue * -0.283);
      const newB = r * (lumR + cosHue * -lumR + sinHue * -(1 - lumR)) + g * (lumG + cosHue * -lumG + sinHue * lumG) + b * (lumB + cosHue * (1 - lumB) + sinHue * 0.116);

      r = newR;
      g = newG;
      b = newB;
    }

    // Clamp values
    dst[i] = Math.min(255, Math.max(0, r));
    dst[i + 1] = Math.min(255, Math.max(0, g));
    dst[i + 2] = Math.min(255, Math.max(0, b));
  }

  // 2. Spatial Convolution Filters (Blur)
  if (blur > 0) {
    return applyBoxBlur(output, Math.round(blur));
  }

  return output;
}

/**
 * Fast box blur approximation for smooth blur performance
 */
function applyBoxBlur(imageData: ImageData, radius: number): ImageData {
  if (radius <= 0) return imageData;
  
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);
  const size = radius * 2 + 1;

  // Horizontal blur pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let k = -radius; k <= radius; k++) {
        const px = Math.min(width - 1, Math.max(0, x + k));
        const idx = (y * width + px) * 4;
        r += src[idx];
        g += src[idx + 1];
        b += src[idx + 2];
        a += src[idx + 3];
        count++;
      }
      const outIdx = (y * width + x) * 4;
      dst[outIdx] = r / count;
      dst[outIdx + 1] = g / count;
      dst[outIdx + 2] = b / count;
      dst[outIdx + 3] = a / count;
    }
  }

  // Vertical blur pass
  const finalDst = new ImageData(width, height);
  const finalData = finalDst.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(height - 1, Math.max(0, y + k));
        const idx = (py * width + x) * 4;
        r += dst[idx];
        g += dst[idx + 1];
        b += dst[idx + 2];
        a += dst[idx + 3];
        count++;
      }
      const outIdx = (y * width + x) * 4;
      finalData[outIdx] = r / count;
      finalData[outIdx + 1] = g / count;
      finalData[outIdx + 2] = b / count;
      finalData[outIdx + 3] = a / count;
    }
  }

  return finalDst;
}

/**
 * Sharpen image filter using a 3x3 convolution matrix
 */
export function applySharpenFilter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  const output = ctx.createImageData(width, height);
  const dst = output.data;

  // Kernel: [ 0, -1,  0,
  //         -1,  5, -1,
  //          0, -1,  0 ]
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const kVal = kernel[(ky + 1) * 3 + (kx + 1)];
          r += src[idx] * kVal;
          g += src[idx + 1] * kVal;
          b += src[idx + 2] * kVal;
        }
      }
      const outIdx = (y * width + x) * 4;
      dst[outIdx] = Math.min(255, Math.max(0, r));
      dst[outIdx + 1] = Math.min(255, Math.max(0, g));
      dst[outIdx + 2] = Math.min(255, Math.max(0, b));
      dst[outIdx + 3] = src[outIdx + 3]; // Preserve original alpha
    }
  }

  ctx.putImageData(output, 0, 0);
}
