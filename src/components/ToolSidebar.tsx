import React from 'react';
import { ToolType, BrushType } from '../types';
import {
  Paintbrush,
  Pencil,
  PenTool,
  Highlighter,
  Sparkles,
  Eraser,
  PaintBucket,
  Pipette,
  Square,
  Type,
  Move,
  Hand,
  Maximize2,
  Grid,
  Scissors,
  CircleDot,
  Boxes,
  Flame,
  Radio,
} from 'lucide-react';

interface ToolSidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  activeBrushType: BrushType;
  setActiveBrushType: (brush: BrushType) => void;
  primaryColor: string;
  secondaryColor: string;
  onSwapColors: () => void;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  activeTool,
  setActiveTool,
  activeBrushType,
  setActiveBrushType,
  primaryColor,
  secondaryColor,
  onSwapColors,
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; brushType?: BrushType }[] = [
    { id: 'brush', label: 'Standard Brush (B)', icon: <Paintbrush className="w-4 h-4" />, brushType: 'standard' },
    { id: 'pencil', label: 'Pencil (P)', icon: <Pencil className="w-4 h-4" />, brushType: 'pencil' },
    { id: 'calligraphy', label: 'Calligraphy Nib', icon: <PenTool className="w-4 h-4" />, brushType: 'calligraphy' },
    { id: 'marker', label: 'Marker Pen', icon: <Highlighter className="w-4 h-4" />, brushType: 'marker' },
    { id: 'highlighter', label: 'Highlighter', icon: <Highlighter className="w-4 h-4 text-amber-400" />, brushType: 'highlighter' },
    { id: 'watercolor', label: 'Watercolor Wet', icon: <CircleDot className="w-4 h-4 text-blue-400" />, brushType: 'watercolor' },
    { id: 'airbrush', label: 'Airbrush Scatter', icon: <Radio className="w-4 h-4 text-purple-400" />, brushType: 'airbrush' },
    { id: 'pixel', label: 'Pixel / Retro', icon: <Grid className="w-4 h-4 text-emerald-400" />, brushType: 'pixel' },
    { id: 'neon', label: 'Neon Glow', icon: <Flame className="w-4 h-4 text-pink-400" />, brushType: 'neon' },
    { id: 'eraser', label: 'Eraser (E)', icon: <Eraser className="w-4 h-4" /> },
    { id: 'bucket', label: 'Paint Bucket Fill (G)', icon: <PaintBucket className="w-4 h-4" /> },
    { id: 'eyedropper', label: 'Color Eyedropper (I)', icon: <Pipette className="w-4 h-4" /> },
    { id: 'shape', label: 'Shape Generator (U)', icon: <Square className="w-4 h-4" /> },
    { id: 'text', label: 'Text Tool (T)', icon: <Type className="w-4 h-4" /> },
    { id: 'gradient', label: 'Gradient Fill', icon: <Boxes className="w-4 h-4" /> },
    { id: 'select-marquee', label: 'Marquee Selection (M)', icon: <Maximize2 className="w-4 h-4" /> },
    { id: 'select-lasso', label: 'Lasso Selection (L)', icon: <Scissors className="w-4 h-4" /> },
    { id: 'hand', label: 'Hand / Pan Canvas (H)', icon: <Hand className="w-4 h-4" /> },
    { id: 'transform', label: 'Transform Layer (V)', icon: <Move className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-14 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-2 text-slate-300 z-20 select-none justify-between">
      {/* Top: Tools List */}
      <div className="flex flex-col items-center space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-slate-700">
        {tools.map((t) => {
          const isBrushCategory = [
            'brush',
            'pencil',
            'calligraphy',
            'marker',
            'highlighter',
            'watercolor',
            'airbrush',
            'pixel',
            'neon',
          ].includes(t.id);

          const isActive =
            activeTool === t.id ||
            (isBrushCategory && activeTool === 'brush' && activeBrushType === t.brushType);

          return (
            <button
              key={t.id + (t.brushType || '')}
              onClick={() => {
                if (t.brushType) {
                  setActiveTool('brush');
                  setActiveBrushType(t.brushType);
                } else {
                  setActiveTool(t.id);
                }
              }}
              title={t.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
              }`}
            >
              {t.icon}
            </button>
          );
        })}
      </div>

      {/* Bottom: Primary & Secondary Color Swatch Controls */}
      <div className="flex flex-col items-center pt-2 border-t border-slate-800 w-full px-2">
        <div className="relative w-10 h-10 mb-1">
          {/* Secondary Swatch */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 rounded-md border border-slate-600 shadow cursor-pointer transition hover:scale-105"
            style={{ backgroundColor: secondaryColor }}
            title="Secondary Color (Click Swap)"
            onClick={onSwapColors}
          />
          {/* Primary Swatch */}
          <div
            className="absolute top-0 left-0 w-6 h-6 rounded-md border-2 border-slate-200 shadow-lg cursor-pointer transition hover:scale-105"
            style={{ backgroundColor: primaryColor }}
            title="Primary Color"
          />
        </div>
        <button
          onClick={onSwapColors}
          title="Swap Colors (X)"
          className="text-[10px] text-slate-400 hover:text-sky-400 font-mono underline"
        >
          Swap (X)
        </button>
      </div>
    </aside>
  );
};
