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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  activeTool,
  setActiveTool,
  activeBrushType,
  setActiveBrushType,
  primaryColor,
  secondaryColor,
  onSwapColors,
  isMobileOpen = false,
  onCloseMobile,
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

  const renderToolButton = (t: typeof tools[0], isWide = false) => {
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
          if (onCloseMobile) onCloseMobile();
        }}
        title={t.label}
        className={`rounded-lg flex items-center transition ${
          isWide
            ? 'w-full px-3 py-2 space-x-2.5 text-xs text-left'
            : 'w-9 h-9 justify-center'
        } ${
          isActive
            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-medium'
            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
        }`}
      >
        <span className="shrink-0">{t.icon}</span>
        {isWide && <span className="truncate">{t.label.split('(')[0]}</span>}
      </button>
    );
  };

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex w-14 bg-slate-900 border-r border-slate-800 flex-col items-center py-2 text-slate-300 z-20 select-none justify-between shrink-0">
        {/* Top: Tools List */}
        <div className="flex flex-col items-center space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {tools.map((t) => renderToolButton(t, false))}
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

      {/* 2. Mobile Tool Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="relative w-64 max-w-[80vw] bg-slate-900 border-r border-slate-800 flex flex-col p-4 z-50 shadow-2xl text-slate-200 h-full animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sky-400 text-sm">Drawing Tools</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Tools List Grid */}
            <div className="flex-1 overflow-y-auto my-3 space-y-1.5 no-scrollbar pr-1">
              {tools.map((t) => renderToolButton(t, true))}
            </div>

            {/* Color Swatches */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9">
                  <div
                    className="absolute bottom-0 right-0 w-5 h-5 rounded border border-slate-600 cursor-pointer"
                    style={{ backgroundColor: secondaryColor }}
                    onClick={onSwapColors}
                  />
                  <div
                    className="absolute top-0 left-0 w-5 h-5 rounded border-2 border-slate-200 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
                <div className="text-xs">
                  <div className="text-slate-300 font-medium">Colors</div>
                  <div className="text-[10px] font-mono text-sky-400">{primaryColor}</div>
                </div>
              </div>

              <button
                onClick={onSwapColors}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-medium border border-slate-700"
              >
                Swap (X)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
