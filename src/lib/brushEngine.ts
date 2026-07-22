import { BrushSettings, Point, SymmetryMode } from '../types';

export class BrushEngine {
  /**
   * Draws a stroke segment from prevPoint to currentPoint using the selected brush settings,
   * accounting for pressure sensitivity and symmetry modes.
   */
  static drawStroke(
    ctx: CanvasRenderingContext2D,
    prevPoint: Point,
    currentPoint: Point,
    color: string,
    settings: BrushSettings,
    symmetryMode: SymmetryMode = 'none',
    symmetryAxes: number = 6,
    canvasWidth: number = 800,
    canvasHeight: number = 600
  ): void {
    const pointsToDraw = this.getSymmetryPoints(
      currentPoint,
      prevPoint,
      symmetryMode,
      symmetryAxes,
      canvasWidth,
      canvasHeight
    );

    ctx.save();

    for (const { curr, prev } of pointsToDraw) {
      // Calculate dynamic pressure size & opacity
      const pressure = settings.usePressure ? curr.pressure ?? 0.5 : 1;
      const effectiveSize = Math.max(
        1,
        settings.size * (settings.usePressure ? 0.2 + pressure * 0.8 : 1)
      );
      const effectiveOpacity =
        settings.opacity * (settings.usePressure ? 0.3 + pressure * 0.7 : 1);

      switch (settings.type) {
        case 'standard':
          this.drawStandardBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity, settings.hardness);
          break;
        case 'pencil':
          this.drawPencilBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'calligraphy':
          this.drawCalligraphyBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'marker':
          this.drawMarkerBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'highlighter':
          this.drawHighlighterBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'watercolor':
          this.drawWatercolorBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'airbrush':
          this.drawAirbrush(ctx, curr, color, effectiveSize, effectiveOpacity);
          break;
        case 'pixel':
          this.drawPixelBrush(ctx, prev, curr, color, Math.max(1, Math.round(effectiveSize)));
          break;
        case 'neon':
          this.drawNeonBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity);
          break;
        default:
          this.drawStandardBrush(ctx, prev, curr, color, effectiveSize, effectiveOpacity, settings.hardness);
      }
    }

    ctx.restore();
  }

  /**
   * Calculates point reflections for Symmetry modes.
   */
  private static getSymmetryPoints(
    curr: Point,
    prev: Point,
    mode: SymmetryMode,
    axes: number,
    w: number,
    h: number
  ): { curr: Point; prev: Point }[] {
    if (mode === 'none') {
      return [{ curr, prev }];
    }

    const centerX = w / 2;
    const centerY = h / 2;
    const results: { curr: Point; prev: Point }[] = [{ curr, prev }];

    if (mode === 'vertical') {
      results.push({
        curr: { x: 2 * centerX - curr.x, y: curr.y, pressure: curr.pressure },
        prev: { x: 2 * centerX - prev.x, y: prev.y, pressure: prev.pressure },
      });
    } else if (mode === 'horizontal') {
      results.push({
        curr: { x: curr.x, y: 2 * centerY - curr.y, pressure: curr.pressure },
        prev: { x: prev.x, y: 2 * centerY - prev.y, pressure: prev.pressure },
      });
    } else if (mode === 'radial') {
      const angleStep = (2 * Math.PI) / axes;
      for (let i = 1; i < axes; i++) {
        const angle = i * angleStep;

        const rotatePoint = (p: Point): Point => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
          const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
          return { x: centerX + rx, y: centerY + ry, pressure: p.pressure };
        };

        results.push({
          curr: rotatePoint(curr),
          prev: rotatePoint(prev),
        });
      }
    }

    return results;
  }

  private static drawStandardBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number,
    hardness: number
  ): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.globalAlpha = opacity;

    if (hardness >= 0.95) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else {
      // Soft brush gradient circle interpolation
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const steps = Math.max(1, Math.ceil(dist / (size * 0.25)));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = p1.x + (p2.x - p1.x) * t;
        const y = p1.y + (p2.y - p1.y) * t;

        const radGradient = ctx.createRadialGradient(x, y, size * hardness * 0.5, x, y, size * 0.5);
        radGradient.addColorStop(0, color);
        radGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = radGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private static drawPencilBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1, size * 0.5);
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity * 0.85;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Graphite noise texture dots along the path
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const count = Math.floor(dist * 0.8);
    ctx.fillStyle = color;

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const x = p1.x + (p2.x - p1.x) * t + (Math.random() - 0.5) * size;
      const y = p1.y + (p2.y - p1.y) * t + (Math.random() - 0.5) * size;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  private static drawCalligraphyBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;

    const angle = Math.PI / 4; // 45 degree nib angle
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const steps = Math.max(1, Math.ceil(dist));

    const nibWidth = size;
    const nibHeight = Math.max(2, size * 0.2);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillRect(-nibWidth / 2, -nibHeight / 2, nibWidth, nibHeight);
      ctx.restore();
    }
  }

  private static drawMarkerBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity * 0.45;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  private static drawHighlighterBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.lineCap = 'butt';
    ctx.lineWidth = size * 1.5;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity * 0.5;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  }

  private static drawWatercolorBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const steps = Math.max(1, Math.ceil(dist / (size * 0.2)));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      // Layered soft wet rings
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = size * (0.3 + Math.random() * 0.4);
        const grad = ctx.createRadialGradient(
          x,
          y,
          0,
          x + (Math.random() - 0.5) * 4,
          y + (Math.random() - 0.5) * 4,
          ringRadius
        );
        grad.addColorStop(0, color);
        grad.addColorStop(0.7, color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.globalAlpha = opacity * 0.08;
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private static drawAirbrush(
    ctx: CanvasRenderingContext2D,
    p: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.fillStyle = color;
    const density = Math.floor(size * 4);

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (size / 2);
      const x = p.x + Math.cos(angle) * radius;
      const y = p.y + Math.sin(angle) * radius;

      ctx.globalAlpha = opacity * (1 - radius / (size / 2)) * 0.3;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  private static drawPixelBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    pixelSize: number
  ): void {
    ctx.fillStyle = color;
    ctx.globalAlpha = 1.0;

    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const steps = Math.max(1, Math.ceil(dist / pixelSize));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.floor((p1.x + (p2.x - p1.x) * t) / pixelSize) * pixelSize;
      const y = Math.floor((p1.y + (p2.y - p1.y) * t) / pixelSize) * pixelSize;

      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }

  private static drawNeonBrush(
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string,
    size: number,
    opacity: number
  ): void {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Outer Glow Shadow
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 1.8;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Inner bright white core
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1, size * 0.3);
    ctx.globalAlpha = opacity * 0.9;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }
}
