export type ToolType =
  | 'select-marquee'
  | 'select-lasso'
  | 'brush'
  | 'pencil'
  | 'calligraphy'
  | 'marker'
  | 'highlighter'
  | 'watercolor'
  | 'airbrush'
  | 'pixel'
  | 'neon'
  | 'eraser'
  | 'bucket'
  | 'eyedropper'
  | 'shape'
  | 'text'
  | 'gradient'
  | 'transform'
  | 'hand';

export type BrushType =
  | 'standard'
  | 'pencil'
  | 'calligraphy'
  | 'marker'
  | 'highlighter'
  | 'watercolor'
  | 'airbrush'
  | 'pixel'
  | 'neon';

export type ShapeType =
  | 'line'
  | 'rectangle'
  | 'square'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'star'
  | 'polygon';

export type ShapeDrawMode = 'fill' | 'stroke' | 'both';

export type SymmetryMode = 'none' | 'vertical' | 'horizontal' | 'radial';

export type GradientType = 'linear' | 'radial';

export type GridType = 'none' | 'square' | 'isometric';

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface BrushSettings {
  type: BrushType;
  size: number; // 1 to 200
  opacity: number; // 0 to 1
  hardness: number; // 0 to 1
  spacing: number; // 0.05 to 1
  usePressure: boolean;
  pressureSensitivity: number; // 0.1 to 2
}

export interface ShapeSettings {
  type: ShapeType;
  drawMode: ShapeDrawMode;
  strokeWidth: number;
  sides: number; // For polygon / star points
  starInnerRadiusRatio: number; // 0.1 to 0.9
  cornerRadius: number;
}

export interface TextSettings {
  text: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  fillColor: string;
}

export interface FilterSettings {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
  blur: number; // 0 to 20
  sepia: number; // 0 to 100
  grayscale: number; // 0 to 100
  invert: number; // 0 to 100
}

export interface SelectionArea {
  type: 'rectangle' | 'ellipse' | 'lasso';
  points: Point[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  active: boolean;
  imageData?: ImageData;
}

export interface CanvasTransform {
  zoom: number; // 0.1 to 10
  panX: number;
  panY: number;
}

export interface ProjectState {
  version: string;
  width: number;
  height: number;
  layers: {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
    blendMode: BlendMode;
    dataUrl: string;
  }[];
}

export interface HistoryStep {
  description: string;
  timestamp: number;
  layersData: {
    id: string;
    imageData: ImageData;
  }[];
  activeLayerId: string;
}

export interface ColorPalette {
  name: string;
  colors: string[];
}
