import {
  BlendMode,
  CanvasTransform,
  FilterSettings,
  GridType,
  HistoryStep,
  Layer,
  Point,
  ProjectState,
  SelectionArea,
  ShapeSettings,
  SymmetryMode,
  TextSettings,
} from '../types';

export class CanvasEngine {
  width: number = 1920;
  height: number = 1080;
  layers: Layer[] = [];
  activeLayerId: string = '';
  transform: CanvasTransform = { zoom: 1, panX: 0, panY: 0 };

  // Overlays & Guides
  gridType: GridType = 'none';
  gridSize: number = 20;
  snapToGrid: boolean = false;
  showRulers: boolean = true;
  symmetryMode: SymmetryMode = 'none';
  symmetryAxes: number = 6;

  // History Stack
  historyStack: HistoryStep[] = [];
  historyIndex: number = -1;
  maxHistorySteps: number = 50;

  // Selection
  selection: SelectionArea = { type: 'rectangle', points: [], active: false };

  // Callbacks
  onStateChange?: () => void;

  constructor(width: number = 1280, height: number = 720) {
    this.width = width;
    this.height = height;
    this.initDefaultLayer();
  }

  initDefaultLayer(): void {
    const defaultLayer = this.createLayer('Background');
    // Fill white background on initial layer
    defaultLayer.ctx.fillStyle = '#FFFFFF';
    defaultLayer.ctx.fillRect(0, 0, this.width, this.height);
    this.layers = [defaultLayer];
    this.activeLayerId = defaultLayer.id;
    this.saveHistory('Initial Canvas');
  }

  createLayer(name?: string): Layer {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const id = 'layer_' + Math.random().toString(36).substring(2, 9);
    return {
      id,
      name: name || `Layer ${this.layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over' as BlendMode,
      canvas,
      ctx,
    };
  }

  getActiveLayer(): Layer | undefined {
    return this.layers.find((l) => l.id === this.activeLayerId);
  }

  addLayer(): Layer {
    const layer = this.createLayer();
    const activeIdx = this.layers.findIndex((l) => l.id === this.activeLayerId);
    if (activeIdx !== -1) {
      this.layers.splice(activeIdx + 1, 0, layer);
    } else {
      this.layers.push(layer);
    }
    this.activeLayerId = layer.id;
    this.saveHistory('Add Layer');
    this.notifyChange();
    return layer;
  }

  deleteLayer(id: string): void {
    if (this.layers.length <= 1) return; // Keep at least 1 layer
    const idx = this.layers.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.layers.splice(idx, 1);
      this.activeLayerId = this.layers[Math.max(0, idx - 1)].id;
      this.saveHistory('Delete Layer');
      this.notifyChange();
    }
  }

  duplicateLayer(id: string): Layer | undefined {
    const source = this.layers.find((l) => l.id === id);
    if (!source) return;

    const newLayer = this.createLayer(`${source.name} Copy`);
    newLayer.ctx.drawImage(source.canvas, 0, 0);
    newLayer.opacity = source.opacity;
    newLayer.blendMode = source.blendMode;

    const idx = this.layers.findIndex((l) => l.id === id);
    this.layers.splice(idx + 1, 0, newLayer);
    this.activeLayerId = newLayer.id;

    this.saveHistory('Duplicate Layer');
    this.notifyChange();
    return newLayer;
  }

  reorderLayers(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      fromIndex >= this.layers.length ||
      toIndex < 0 ||
      toIndex >= this.layers.length
    ) {
      return;
    }
    const [moved] = this.layers.splice(fromIndex, 1);
    this.layers.splice(toIndex, 0, moved);
    this.saveHistory('Reorder Layers');
    this.notifyChange();
  }

  clearActiveLayer(): void {
    const active = this.getActiveLayer();
    if (!active || active.locked) return;
    active.ctx.clearRect(0, 0, this.width, this.height);
    this.saveHistory('Clear Layer');
    this.notifyChange();
  }

  // --- Composite Canvas Rendering ---
  renderComposite(targetCtx: CanvasRenderingContext2D): void {
    targetCtx.clearRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);

    targetCtx.save();
    // Apply pan & zoom transform
    targetCtx.translate(this.transform.panX, this.transform.panY);
    targetCtx.scale(this.transform.zoom, this.transform.zoom);

    // Draw Checkerboard Background for Transparency
    this.drawCheckerboard(targetCtx);

    // Render each visible layer in bottom-to-top stack order
    for (const layer of this.layers) {
      if (!layer.visible) continue;

      targetCtx.save();
      targetCtx.globalAlpha = layer.opacity;
      targetCtx.globalCompositeOperation = layer.blendMode as GlobalCompositeModule;
      targetCtx.drawImage(layer.canvas, 0, 0);
      targetCtx.restore();
    }

    // Render Grid & Guides Overlay
    this.drawGridOverlay(targetCtx);
    this.drawSymmetryGuides(targetCtx);
    this.drawSelectionOverlay(targetCtx);

    targetCtx.restore();
  }

  private drawCheckerboard(ctx: CanvasRenderingContext2D): void {
    const size = 16;
    ctx.fillStyle = '#1A1D24';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#242832';
    for (let y = 0; y < this.height; y += size) {
      for (let x = 0; x < this.width; x += size) {
        if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }

  private drawGridOverlay(ctx: CanvasRenderingContext2D): void {
    if (this.gridType === 'none') return;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 / this.transform.zoom;

    if (this.gridType === 'square') {
      ctx.beginPath();
      for (let x = 0; x <= this.width; x += this.gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
      }
      for (let y = 0; y <= this.height; y += this.gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
      }
      ctx.stroke();
    } else if (this.gridType === 'isometric') {
      ctx.beginPath();
      const tan30 = Math.tan(Math.PI / 6);
      for (let x = -this.height; x <= this.width + this.height; x += this.gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + this.height * tan30, this.height);

        ctx.moveTo(x, 0);
        ctx.lineTo(x - this.height * tan30, this.height);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawSymmetryGuides(ctx: CanvasRenderingContext2D): void {
    if (this.symmetryMode === 'none') return;

    ctx.save();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'; // Blue highlight line
    ctx.lineWidth = 1.5 / this.transform.zoom;
    ctx.setLineDash([6 / this.transform.zoom, 4 / this.transform.zoom]);

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    if (this.symmetryMode === 'vertical') {
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, this.height);
      ctx.stroke();
    } else if (this.symmetryMode === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(this.width, centerY);
      ctx.stroke();
    } else if (this.symmetryMode === 'radial') {
      const step = (2 * Math.PI) / this.symmetryAxes;
      const radius = Math.max(this.width, this.height);

      for (let i = 0; i < this.symmetryAxes; i++) {
        const angle = i * step;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  private drawSelectionOverlay(ctx: CanvasRenderingContext2D): void {
    if (!this.selection.active) return;

    ctx.save();
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 1.5 / this.transform.zoom;
    ctx.setLineDash([4 / this.transform.zoom, 4 / this.transform.zoom]);

    if (
      this.selection.type === 'rectangle' &&
      this.selection.x !== undefined &&
      this.selection.width !== undefined
    ) {
      ctx.strokeRect(
        this.selection.x,
        this.selection.y!,
        this.selection.width,
        this.selection.height!
      );
    } else if (this.selection.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.selection.points[0].x, this.selection.points[0].y);
      for (let i = 1; i < this.selection.points.length; i++) {
        ctx.lineTo(this.selection.points[i].x, this.selection.points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Shape Rendering ---
  drawShape(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point,
    settings: ShapeSettings,
    strokeColor: string,
    fillColor: string,
    isShiftPressed: boolean = false
  ): void {
    ctx.save();
    ctx.lineWidth = settings.strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    let x = start.x;
    let y = start.y;
    let width = end.x - start.x;
    let height = end.y - start.y;

    if (isShiftPressed) {
      const side = Math.max(Math.abs(width), Math.abs(height));
      width = width >= 0 ? side : -side;
      height = height >= 0 ? side : -side;
    }

    ctx.beginPath();

    switch (settings.type) {
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        break;

      case 'rectangle':
      case 'square':
        if (settings.cornerRadius > 0 && ctx.roundRect) {
          ctx.roundRect(x, y, width, height, settings.cornerRadius);
        } else {
          ctx.rect(x, y, width, height);
        }
        break;

      case 'circle':
      case 'ellipse': {
        const radiusX = Math.abs(width / 2);
        const radiusY = Math.abs(height / 2);
        const cx = x + width / 2;
        const cy = y + height / 2;
        ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
        break;
      }

      case 'triangle': {
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        break;
      }

      case 'polygon': {
        const sides = Math.max(3, settings.sides);
        const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const cx = x + width / 2;
        const cy = y + height / 2;

        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const px = cx + radius * Math.cos(angle);
          const py = cy + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }

      case 'star': {
        const points = settings.sides * 2;
        const outerR = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const innerR = outerR * (settings.starInnerRadiusRatio || 0.4);
        const cx = x + width / 2;
        const cy = y + height / 2;

        for (let i = 0; i < points; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / settings.sides - Math.PI / 2;
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
    }

    if (settings.drawMode === 'fill' || settings.drawMode === 'both') {
      ctx.fill();
    }
    if (settings.drawMode === 'stroke' || settings.drawMode === 'both') {
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Text Tool ---
  drawText(textPos: Point, settings: TextSettings): void {
    const active = this.getActiveLayer();
    if (!active || active.locked) return;

    const ctx = active.ctx;
    ctx.save();
    ctx.font = `${settings.italic ? 'italic ' : ''}${
      settings.bold ? 'bold ' : ''
    }${settings.fontSize}px ${settings.fontFamily}`;
    ctx.fillStyle = settings.fillColor;
    ctx.textAlign = settings.align;
    ctx.textBaseline = 'top';

    ctx.fillText(settings.text, textPos.x, textPos.y);
    ctx.restore();

    this.saveHistory('Add Text');
    this.notifyChange();
  }

  // --- History & Undo/Redo ---
  saveHistory(description: string): void {
    // Truncate future steps if undoing
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }

    const layersData = this.layers.map((l) => ({
      id: l.id,
      imageData: l.ctx.getImageData(0, 0, this.width, this.height),
    }));

    this.historyStack.push({
      description,
      timestamp: Date.now(),
      layersData,
      activeLayerId: this.activeLayerId,
    });

    if (this.historyStack.length > this.maxHistorySteps) {
      this.historyStack.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo(): void {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.restoreHistoryStep(this.historyStack[this.historyIndex]);
  }

  redo(): void {
    if (this.historyIndex >= this.historyStack.length - 1) return;
    this.historyIndex++;
    this.restoreHistoryStep(this.historyStack[this.historyIndex]);
  }

  jumpToHistoryStep(index: number): void {
    if (index < 0 || index >= this.historyStack.length) return;
    this.historyIndex = index;
    this.restoreHistoryStep(this.historyStack[index]);
  }

  private restoreHistoryStep(step: HistoryStep): void {
    for (const data of step.layersData) {
      const layer = this.layers.find((l) => l.id === data.id);
      if (layer) {
        layer.ctx.putImageData(data.imageData, 0, 0);
      }
    }
    this.activeLayerId = step.activeLayerId;
    this.notifyChange();
  }

  // --- Project State Import / Export ---
  exportProjectJSON(): string {
    const project: ProjectState = {
      version: '1.0.0',
      width: this.width,
      height: this.height,
      layers: this.layers.map((l) => ({
        id: l.id,
        name: l.name,
        visible: l.visible,
        locked: l.locked,
        opacity: l.opacity,
        blendMode: l.blendMode,
        dataUrl: l.canvas.toDataURL('image/png'),
      })),
    };
    return JSON.stringify(project, null, 2);
  }

  async importProjectJSON(jsonString: string): Promise<void> {
    const project: ProjectState = JSON.parse(jsonString);
    this.width = project.width;
    this.height = project.height;
    this.layers = [];

    for (const layerData of project.layers) {
      const layer = this.createLayer(layerData.name);
      layer.id = layerData.id;
      layer.visible = layerData.visible;
      layer.locked = layerData.locked;
      layer.opacity = layerData.opacity;
      layer.blendMode = layerData.blendMode;

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          layer.ctx.drawImage(img, 0, 0);
          resolve();
        };
        img.src = layerData.dataUrl;
      });

      this.layers.push(layer);
    }

    this.activeLayerId = this.layers[0]?.id || '';
    this.saveHistory('Import Project');
    this.notifyChange();
  }

  // --- Export Raster Image ---
  exportImage(
    format: 'png' | 'jpeg' | 'svg' = 'png',
    quality: number = 0.95,
    includeBackground: boolean = true
  ): string {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.width;
    exportCanvas.height = this.height;
    const ctx = exportCanvas.getContext('2d')!;

    if (includeBackground && format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    for (const layer of this.layers) {
      if (!layer.visible) continue;
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeModule;
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.restore();
    }

    if (format === 'jpeg') {
      return exportCanvas.toDataURL('image/jpeg', quality);
    }
    return exportCanvas.toDataURL('image/png');
  }

  notifyChange(): void {
    if (this.onStateChange) this.onStateChange();
  }
}

type GlobalCompositeModule = GlobalCompositeOperation;
