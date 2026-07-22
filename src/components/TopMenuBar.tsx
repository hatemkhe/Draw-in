import React, { useState } from 'react';
import {
  FileUp,
  FileDown,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid,
  Sparkles,
  Download,
  Trash2,
  Printer,
  Eye,
  Sliders,
  Layers as LayersIcon,
  HelpCircle,
  Maximize2,
} from 'lucide-react';

interface TopMenuBarProps {
  projectName: string;
  setProjectName: (name: string) => void;
  onNewCanvas: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onExportImage: () => void;
  onImportImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  gridType: string;
  onToggleGrid: () => void;
  onClearLayer: () => void;
  onPrint: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onApplyFilterModal: () => void;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  projectName,
  setProjectName,
  onNewCanvas,
  onOpenProject,
  onSaveProject,
  onExportImage,
  onImportImage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  gridType,
  onToggleGrid,
  onClearLayer,
  onPrint,
  activeTab,
  setActiveTab,
  onApplyFilterModal,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenus = () => setOpenMenu(null);

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 text-slate-200 select-none z-30 relative">
      {/* Left: Branding & Main Menus */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mr-3 font-semibold text-sky-400 text-sm">
          <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent font-bold">
            Canvas Art Studio
          </span>
        </div>

        <nav className="flex items-center text-xs space-x-1">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('file')}
              className={`px-2.5 py-1 rounded hover:bg-slate-800 transition ${
                openMenu === 'file' ? 'bg-slate-800 text-sky-400' : ''
              }`}
            >
              File
            </button>
            {openMenu === 'file' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-slate-850 bg-slate-900 border border-slate-750 rounded-lg shadow-xl py-1 text-slate-200 text-xs z-50 divide-y divide-slate-800"
                onClick={closeMenus}
              >
                <div className="py-1">
                  <button
                    onClick={onNewCanvas}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>New Project...</span>
                    <span className="text-slate-500 text-[10px]">Ctrl+N</span>
                  </button>
                  <button
                    onClick={onImportImage}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Import Image...</span>
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={onOpenProject}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Open Project (.json)</span>
                    <FileUp className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={onSaveProject}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Save Project (.json)</span>
                    <FileDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={onExportImage}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between text-sky-400 font-medium"
                  >
                    <span>Export Image (PNG/JPG)</span>
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                  <button
                    onClick={onPrint}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Print Canvas...</span>
                    <Printer className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('edit')}
              className={`px-2.5 py-1 rounded hover:bg-slate-800 transition ${
                openMenu === 'edit' ? 'bg-slate-800 text-sky-400' : ''
              }`}
            >
              Edit
            </button>
            {openMenu === 'edit' && (
              <div
                className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-slate-750 rounded-lg shadow-xl py-1 text-slate-200 text-xs z-50"
                onClick={closeMenus}
              >
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-between"
                >
                  <span>Undo</span>
                  <span className="text-slate-500 text-[10px]">Ctrl+Z</span>
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-between"
                >
                  <span>Redo</span>
                  <span className="text-slate-500 text-[10px]">Ctrl+Y</span>
                </button>
                <hr className="my-1 border-slate-800" />
                <button
                  onClick={onClearLayer}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-950/40 text-red-400 flex items-center justify-between"
                >
                  <span>Clear Current Layer</span>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('view')}
              className={`px-2.5 py-1 rounded hover:bg-slate-800 transition ${
                openMenu === 'view' ? 'bg-slate-800 text-sky-400' : ''
              }`}
            >
              View
            </button>
            {openMenu === 'view' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-slate-900 border border-slate-750 rounded-lg shadow-xl py-1 text-slate-200 text-xs z-50"
                onClick={closeMenus}
              >
                <button
                  onClick={onZoomIn}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Zoom In</span>
                  <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={onZoomOut}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Zoom Out</span>
                  <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={onResetZoom}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Fit Screen (100%)</span>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <hr className="my-1 border-slate-800" />
                <button
                  onClick={onToggleGrid}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Grid: {gridType.toUpperCase()}</span>
                  <Grid className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => {
              setActiveTab('filters');
              onApplyFilterModal();
            }}
            className={`px-2.5 py-1 rounded hover:bg-slate-800 transition flex items-center space-x-1.5 ${
              activeTab === 'filters' ? 'bg-slate-800 text-sky-400' : ''
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </nav>
      </div>

      {/* Middle: Editable Project Title */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-slate-800/80 border border-transparent hover:border-slate-700 focus:border-sky-500 rounded px-2 py-0.5 text-xs text-center font-medium text-slate-100 focus:outline-none transition w-44"
          placeholder="Project Title"
        />
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center space-x-1.5 text-xs">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded hover:bg-slate-800 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span
          onClick={onResetZoom}
          className="cursor-pointer text-[11px] font-mono text-slate-300 w-12 text-center hover:text-sky-400"
          title="Click to Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-1.5 rounded hover:bg-slate-800 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onExportImage}
          className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-3 py-1 rounded-md shadow flex items-center space-x-1 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
