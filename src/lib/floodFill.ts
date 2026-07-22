/**
 * High-performance Flood Fill (Paint Bucket) algorithm using queue BFS.
 */
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number = 20
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Convert fill color hex to RGBA
  const fillRgb = hexToRgb(fillColorHex);
  if (!fillRgb) return;

  const targetIdx = (startY * width + startX) * 4;
  const startR = data[targetIdx];
  const startG = data[targetIdx + 1];
  const startB = data[targetIdx + 2];
  const startA = data[targetIdx + 3];

  // If start color is already the same as fill color, return early
  if (
    colorMatch(
      startR,
      startG,
      startB,
      startA,
      fillRgb.r,
      fillRgb.g,
      fillRgb.b,
      255,
      0
    )
  ) {
    return;
  }

  // Linear queue structure for fast traversal
  const queue = new Int32Array(width * height * 2);
  let qHead = 0;
  let qTail = 0;

  queue[qTail++] = startX;
  queue[qTail++] = startY;

  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;

  const maxDist = (tolerance / 100) * 255 * 3;

  while (qHead < qTail) {
    const x = queue[qHead++];
    const y = queue[qHead++];
    const idx = (y * width + x) * 4;

    // Apply Fill Color
    data[idx] = fillRgb.r;
    data[idx + 1] = fillRgb.g;
    data[idx + 2] = fillRgb.b;
    data[idx + 3] = 255;

    // Check 4 neighbors
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (!visited[vIdx]) {
          const nIdx = vIdx * 4;
          const dist =
            Math.abs(data[nIdx] - startR) +
            Math.abs(data[nIdx + 1] - startG) +
            Math.abs(data[nIdx + 2] - startB) +
            Math.abs(data[nIdx + 3] - startA);

          if (dist <= maxDist) {
            visited[vIdx] = 1;
            queue[qTail++] = nx;
            queue[qTail++] = ny;
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function colorMatch(
  r1: number,
  g1: number,
  b1: number,
  a1: number,
  r2: number,
  g2: number,
  b2: number,
  a2: number,
  maxDist: number
): boolean {
  const dist =
    Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
  return dist <= maxDist;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  let r = 0,
    g = 0,
    b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return null;
  }

  return { r, g, b };
}
