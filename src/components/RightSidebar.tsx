import React, { useState } from 'react';
import {
  Layer,
  BlendMode,
  FilterSettings,
  HistoryStep,
  ColorPalette,
} from '../types';
import {
  Layers,
  Palette,
  Sliders,
  History,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  PlusCircle,
  Check,
} from 'lucide-react';

interface RightSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Layer State
  layers: Layer[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (from: number, to: number) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  onUpdateLayerOpacity: (id: string, opacity: number) => void;
  onUpdateLayerBlendMode: (id: string, mode: BlendMode) => void;
  onRenameLayer: (id: string, newName: string) => void;

  // Color Management State
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  customPalette: string[];
  onAddCustomColor: (color: string) => void;

  // Filters State
  filterSettings: FilterSettings;
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;

  // History State
  historyStack: HistoryStep[];
  historyIndex: number;
  onJumpToHistory: (index: number) => void;

  // Mobile Props
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  setActiveTab,
  layers,
  activeLayerId,
  setActiveLayerId,
  onAddLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onUpdateLayerOpacity,
  onUpdateLayerBlendMode,
  onRenameLayer,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  customPalette,
  onAddCustomColor,
  filterSettings,
  setFilterSettings,
  onApplyFilters,
  onResetFilters,
  historyStack,
  historyIndex,
  onJumpToHistory,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState('');

  // Preset Palettes
  const presetPalettes: ColorPalette[] = [
    {
      name: 'Basic',
      colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'],
    },
    {
      name: 'Pastel',
      colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8AEFF', '#FFDFD3', '#C7CEEA'],
    },
    {
      name: 'Neon',
      colors: ['#39FF14', '#FF073A', '#00F5FF', '#FF007F', '#CCFF00', '#BF00FF', '#FF5F1F', '#FFE600'],
    },
    {
      name: 'Earth',
      colors: ['#5C4033', '#8B5A2B', '#A0522D', '#CD853F', '#D2691E', '#B8860B', '#2E8B57', '#556B2F'],
    },
  ];

  const handleRenameSubmit = (id: string) => {
    if (editingLayerName.trim()) {
      onRenameLayer(id, editingLayerName.trim());
    }
    setEditingLayerId(null);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden text-slate-200">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 shrink-0">
        {[
          { id: 'layers', label: 'Layers', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'colors', label: 'Colors', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'filters', label: 'Filters', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 text-xs font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-sky-500 text-sky-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
        {/* TAB 1: LAYERS */}
        {activeTab === 'layers' && (
          <div className="flex flex-col h-full space-y-3">
            {/* Layers Header Actions */}
            <div className="flex items-center justify-between bg-slate-850 p-2 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                Layers ({layers.length})
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={onAddLayer}
                  title="New Layer"
                  className="p-1 rounded hover:bg-sky-600 hover:text-white text-slate-300 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDuplicateLayer(activeLayerId)}
                  title="Duplicate Active Layer"
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteLayer(activeLayerId)}
                  disabled={layers.length <= 1}
                  title="Delete Active Layer"
                  className="p-1 rounded hover:bg-red-600 hover:text-white text-slate-300 disabled:opacity-30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Layer Stack Items (Top layer displayed first) */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {[...layers].reverse().map((layer, reverseIdx) => {
                const actualIdx = layers.length - 1 - reverseIdx;
                const isActive = layer.id === activeLayerId;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-2.5 rounded-lg border flex flex-col space-y-2 transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 border-sky-500/80 shadow-md'
                        : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Layer Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {/* Visibility Eye */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLayerVisibility(layer.id);
                          }}
                          className="text-slate-400 hover:text-slate-100"
                        >
                          {layer.visible ? (
                            <Eye className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>

                        {/* Lock Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLayerLock(layer.id);
                          }}
                          className="text-slate-400 hover:text-slate-100"
                        >
                          {layer.locked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>

                        {/* Name Input / Display */}
                        {editingLayerId === layer.id ? (
                          <input
                            type="text"
                            value={editingLayerName}
                            onChange={(e) => setEditingLayerName(e.target.value)}
                            onBlur={() => handleRenameSubmit(layer.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(layer.id)}
                            autoFocus
                            className="bg-slate-900 border border-sky-500 rounded px-1.5 py-0.5 text-xs text-white w-full"
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingLayerId(layer.id);
                              setEditingLayerName(layer.name);
                            }}
                            className="text-xs font-medium text-slate-200 truncate cursor-text hover:text-sky-300"
                            title="Double-click to rename"
                          >
                            {layer.name}
                          </span>
                        )}
                      </div>

                      {/* Reorder Arrows */}
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderLayer(actualIdx, actualIdx + 1);
                          }}
                          disabled={actualIdx === layers.length - 1}
                          className="p-0.5 hover:text-sky-400 text-slate-500 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderLayer(actualIdx, actualIdx - 1);
                          }}
                          disabled={actualIdx === 0}
                          className="p-0.5 hover:text-sky-400 text-slate-500 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Layer Controls Row (Opacity & Blend Mode) */}
                    <div className="flex items-center space-x-3 pt-1 border-t border-slate-800/80 text-[11px]">
                      <div className="flex items-center space-x-1.5 flex-1">
                        <span className="text-slate-400">Opacity:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={layer.opacity}
                          onChange={(e) => onUpdateLayerOpacity(layer.id, Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 accent-sky-500 h-1"
                        />
                        <span className="w-8 font-mono text-slate-300 text-right">
                          {Math.round(layer.opacity * 100)}%
                        </span>
                      </div>

                      <select
                        value={layer.blendMode}
                        onChange={(e) => onUpdateLayerBlendMode(layer.id, e.target.value as BlendMode)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                      >
                        <option value="source-over">Normal</option>
                        <option value="multiply">Multiply</option>
                        <option value="screen">Screen</option>
                        <option value="overlay">Overlay</option>
                        <option value="darken">Darken</option>
                        <option value="lighten">Lighten</option>
                        <option value="color-dodge">Color Dodge</option>
                        <option value="hard-light">Hard Light</option>
                        <option value="difference">Difference</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COLOR MANAGEMENT */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Visual HTML Native Color Picker */}
            <div className="flex flex-col items-center bg-slate-850 p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400 mb-2 font-medium">Primary Color Picker</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-24 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <div className="flex items-center justify-between w-full mt-3 text-xs">
                <span className="text-slate-400 font-mono">HEX:</span>
                <input
                  type="text"
                  value={primaryColor.toUpperCase()}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center font-mono text-sky-400 font-bold w-28"
                />
              </div>
            </div>

            {/* Quick Add to Saved Custom Palette */}
            <button
              onClick={() => onAddCustomColor(primaryColor)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition"
            >
              <PlusCircle className="w-4 h-4 text-sky-400" />
              <span>Save Current Color to Palette</span>
            </button>

            {/* Custom Saved Swatches */}
            {customPalette.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium">Saved Custom Swatches:</span>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-850 rounded-lg border border-slate-800">
                  {customPalette.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrimaryColor(color)}
                      className="w-6 h-6 rounded border border-slate-700 hover:scale-110 transition shadow"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pre-made Palettes */}
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-medium">Preset Color Palettes:</span>
              {presetPalettes.map((pal) => (
                <div key={pal.name} className="space-y-1 bg-slate-850/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-300">{pal.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pal.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrimaryColor(c)}
                        className="w-5 h-5 rounded border border-slate-700 hover:scale-110 transition"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FILTERS */}
        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200">Layer Image Adjustments</span>
              <button
                onClick={onResetFilters}
                className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Brightness</span>
                  <span className="font-mono text-sky-400">{filterSettings.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filterSettings.brightness}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, brightness: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Contrast</span>
                  <span className="font-mono text-sky-400">{filterSettings.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filterSettings.contrast}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, contrast: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Saturation</span>
                  <span className="font-mono text-sky-400">{filterSettings.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={filterSettings.saturation}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, saturation: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Hue */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Hue Shift</span>
                  <span className="font-mono text-sky-400">{filterSettings.hue}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={filterSettings.hue}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, hue: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Gaussian Blur</span>
                  <span className="font-mono text-sky-400">{filterSettings.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filterSettings.blur}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, blur: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Sepia</span>
                  <span className="font-mono text-sky-400">{filterSettings.sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterSettings.sepia}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, sepia: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Grayscale</span>
                  <span className="font-mono text-sky-400">{filterSettings.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterSettings.grayscale}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, grayscale: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>

              {/* Invert */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Invert Colors</span>
                  <span className="font-mono text-sky-400">{filterSettings.invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterSettings.invert}
                  onChange={(e) => setFilterSettings((s) => ({ ...s, invert: Number(e.target.value) }))}
                  className="w-full accent-sky-500 h-1"
                />
              </div>
            </div>

            <button
              onClick={onApplyFilters}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow transition"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters to Current Layer</span>
            </button>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200">
                Action History ({historyStack.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {historyStack.map((step, idx) => {
                const isActive = idx === historyIndex;
                const isPast = idx < historyIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => onJumpToHistory(idx)}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition border ${
                      isActive
                        ? 'bg-sky-950/60 border-sky-500 text-sky-300 font-semibold'
                        : isPast
                        ? 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    <span className="truncate">{step.description}</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-2">
                      {new Date(step.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Right Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-900 border-l border-slate-800 flex-col text-slate-200 z-20 select-none shrink-0 h-full">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Right Slide-Over Panel */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />

          {/* Slide-over panel */}
          <div className="relative w-80 max-w-[88vw] bg-slate-900 border-l border-slate-800 flex flex-col z-50 shadow-2xl h-full animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
              <span className="font-bold text-sky-400 text-sm">Panels & Layers</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
