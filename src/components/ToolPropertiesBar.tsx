import React from 'react';
import {
  ToolType,
  BrushSettings,
  ShapeSettings,
  TextSettings,
  SymmetryMode,
  GridType,
} from '../types';
import {
  Sliders,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Activity,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';

interface ToolPropertiesBarProps {
  activeTool: ToolType;
  brushSettings: BrushSettings;
  setBrushSettings: React.Dispatch<React.SetStateAction<BrushSettings>>;
  shapeSettings: ShapeSettings;
  setShapeSettings: React.Dispatch<React.SetStateAction<ShapeSettings>>;
  textSettings: TextSettings;
  setTextSettings: React.Dispatch<React.SetStateAction<TextSettings>>;
  bucketTolerance: number;
  setBucketTolerance: (val: number) => void;
  symmetryMode: SymmetryMode;
  setSymmetryMode: (mode: SymmetryMode) => void;
  symmetryAxes: number;
  setSymmetryAxes: (val: number) => void;
  gridType: GridType;
  setGridType: (grid: GridType) => void;
  gridSize: number;
  setGridSize: (val: number) => void;
}

export const ToolPropertiesBar: React.FC<ToolPropertiesBarProps> = ({
  activeTool,
  brushSettings,
  setBrushSettings,
  shapeSettings,
  setShapeSettings,
  textSettings,
  setTextSettings,
  bucketTolerance,
  setBucketTolerance,
  symmetryMode,
  setSymmetryMode,
  symmetryAxes,
  setSymmetryAxes,
  gridType,
  setGridType,
  gridSize,
  setGridSize,
}) => {
  return (
    <div className="h-10 bg-slate-900/90 border-b border-slate-800 flex items-center px-2 sm:px-4 text-xs text-slate-300 z-10 overflow-x-auto gap-3 sm:gap-4 select-none no-scrollbar shrink-0 whitespace-nowrap">
      {/* 1. Brush Tool Properties */}
      {['brush', 'pencil', 'calligraphy', 'marker', 'highlighter', 'watercolor', 'airbrush', 'pixel', 'neon', 'eraser'].includes(activeTool) && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">Size:</span>
            <input
              type="range"
              min="1"
              max="200"
              value={brushSettings.size}
              onChange={(e) => setBrushSettings((s) => ({ ...s, size: Number(e.target.value) }))}
              className="w-20 accent-sky-500 h-1"
            />
            <span className="w-8 font-mono text-slate-200 text-[11px]">{brushSettings.size}px</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">Opacity:</span>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={brushSettings.opacity}
              onChange={(e) => setBrushSettings((s) => ({ ...s, opacity: Number(e.target.value) }))}
              className="w-16 accent-sky-500 h-1"
            />
            <span className="w-10 font-mono text-slate-200 text-[11px]">
              {Math.round(brushSettings.opacity * 100)}%
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">Hardness:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={brushSettings.hardness}
              onChange={(e) => setBrushSettings((s) => ({ ...s, hardness: Number(e.target.value) }))}
              className="w-16 accent-sky-500 h-1"
            />
            <span className="w-8 font-mono text-slate-200 text-[11px]">
              {Math.round(brushSettings.hardness * 100)}%
            </span>
          </div>

          {/* Pressure Sensitivity Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer hover:text-slate-100">
            <input
              type="checkbox"
              checked={brushSettings.usePressure}
              onChange={(e) => setBrushSettings((s) => ({ ...s, usePressure: e.target.checked }))}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-3.5 h-3.5"
            />
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Stylus Pressure</span>
          </label>

          <div className="h-4 w-px bg-slate-800" />

          {/* Symmetry Options */}
          <div className="flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Symmetry:</span>
            <select
              value={symmetryMode}
              onChange={(e) => setSymmetryMode(e.target.value as SymmetryMode)}
              className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="none">Off</option>
              <option value="vertical">Vertical Line</option>
              <option value="horizontal">Horizontal Line</option>
              <option value="radial">Radial Axes</option>
            </select>

            {symmetryMode === 'radial' && (
              <div className="flex items-center space-x-1">
                <span className="text-slate-400">Axes:</span>
                <input
                  type="number"
                  min="3"
                  max="16"
                  value={symmetryAxes}
                  onChange={(e) => setSymmetryAxes(Number(e.target.value))}
                  className="w-12 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-slate-100"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Shape Tool Properties */}
      {activeTool === 'shape' && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Shape:</span>
            <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700">
              {[
                { type: 'rectangle', icon: <Square className="w-3.5 h-3.5" /> },
                { type: 'circle', icon: <Circle className="w-3.5 h-3.5" /> },
                { type: 'triangle', icon: <Triangle className="w-3.5 h-3.5" /> },
                { type: 'star', icon: <Star className="w-3.5 h-3.5" /> },
                { type: 'polygon', icon: <Sparkles className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setShapeSettings((s) => ({ ...s, type: item.type as any }))}
                  className={`p-1 rounded ${
                    shapeSettings.type === item.type ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Draw Mode:</span>
            <select
              value={shapeSettings.drawMode}
              onChange={(e) => setShapeSettings((s) => ({ ...s, drawMode: e.target.value as any }))}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200"
            >
              <option value="stroke">Stroke Only</option>
              <option value="fill">Fill Only</option>
              <option value="both">Fill & Stroke</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Stroke Width:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={shapeSettings.strokeWidth}
              onChange={(e) => setShapeSettings((s) => ({ ...s, strokeWidth: Number(e.target.value) }))}
              className="w-12 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-slate-100"
            />
          </div>

          {(shapeSettings.type === 'polygon' || shapeSettings.type === 'star') && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Points/Sides:</span>
              <input
                type="number"
                min="3"
                max="12"
                value={shapeSettings.sides}
                onChange={(e) => setShapeSettings((s) => ({ ...s, sides: Number(e.target.value) }))}
                className="w-12 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-slate-100"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Text Tool Properties */}
      {activeTool === 'text' && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Font:</span>
            <select
              value={textSettings.fontFamily}
              onChange={(e) => setTextSettings((t) => ({ ...t, fontFamily: e.target.value }))}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200"
            >
              <option value="Arial">Arial</option>
              <option value="Inter">Inter</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Comic Sans MS">Comic Sans</option>
              <option value="Impact">Impact</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Size:</span>
            <input
              type="number"
              min="8"
              max="200"
              value={textSettings.fontSize}
              onChange={(e) => setTextSettings((t) => ({ ...t, fontSize: Number(e.target.value) }))}
              className="w-14 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-slate-100"
            />
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTextSettings((t) => ({ ...t, bold: !t.bold }))}
              className={`px-2 py-0.5 rounded font-bold border ${
                textSettings.bold ? 'bg-sky-600 border-sky-500 text-white' : 'border-slate-700 text-slate-400'
              }`}
            >
              B
            </button>
            <button
              onClick={() => setTextSettings((t) => ({ ...t, italic: !t.italic }))}
              className={`px-2 py-0.5 rounded italic border ${
                textSettings.italic ? 'bg-sky-600 border-sky-500 text-white' : 'border-slate-700 text-slate-400'
              }`}
            >
              I
            </button>
          </div>
        </div>
      )}

      {/* 4. Bucket Tool Properties */}
      {activeTool === 'bucket' && (
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">Tolerance:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={bucketTolerance}
            onChange={(e) => setBucketTolerance(Number(e.target.value))}
            className="w-32 accent-sky-500 h-1"
          />
          <span className="w-8 font-mono text-slate-200">{bucketTolerance}%</span>
        </div>
      )}

      {/* Grid Settings Bar */}
      <div className="ml-auto flex items-center space-x-3 text-slate-400 border-l border-slate-800 pl-4">
        <span className="text-[11px]">Grid:</span>
        <select
          value={gridType}
          onChange={(e) => setGridType(e.target.value as GridType)}
          className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 text-xs"
        >
          <option value="none">None</option>
          <option value="square">Square Grid</option>
          <option value="isometric">Isometric</option>
        </select>
        {gridType !== 'none' && (
          <input
            type="number"
            min="5"
            max="100"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-12 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-slate-100"
          />
        )}
      </div>
    </div>
  );
};
