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
  Sliders,
  Layers as LayersIcon,
  Maximize2,
  Menu,
  X,
  Palette,
  Wrench,
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

  // Mobile Drawer Toggle Handlers
  isMobileRightSidebarOpen?: boolean;
  onToggleMobileRightSidebar?: () => void;
  isMobileToolsOpen?: boolean;
  onToggleMobileTools?: () => void;
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
  isMobileRightSidebarOpen = false,
  onToggleMobileRightSidebar,
  isMobileToolsOpen = false,
  onToggleMobileTools,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenus = () => setOpenMenu(null);

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 sm:px-3 text-slate-200 select-none z-30 relative">
      {/* Left: Branding & Desktop Nav */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 sm:space-x-2 mr-1 sm:mr-3 font-semibold text-sky-400 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 animate-pulse shrink-0" />
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent font-bold truncate max-w-[120px] sm:max-w-none">
            Draw In
          </span>
        </div>

        {/* Desktop Menus */}
        <nav className="hidden md:flex items-center text-xs space-x-1">
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
                className="absolute top-full left-0 mt-1 w-48 bg-slate-900 border border-slate-750 rounded-lg shadow-xl py-1 text-slate-200 text-xs z-50 divide-y divide-slate-800"
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

      {/* Middle: Project Title Input */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-slate-800/80 border border-transparent hover:border-slate-700 focus:border-sky-500 rounded px-1.5 sm:px-2 py-0.5 text-xs text-center font-medium text-slate-100 focus:outline-none transition w-28 sm:w-44 truncate"
          placeholder="Project Title"
        />
      </div>

      {/* Right: Actions / Mobile Quick Controls */}
      <div className="flex items-center space-x-1 text-xs">
        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition"
        >
          <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Zoom Controls (Desktop only) */}
        <div className="hidden lg:flex items-center space-x-1">
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button onClick={onZoomOut} className="p-1 rounded hover:bg-slate-800">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span
            onClick={onResetZoom}
            className="cursor-pointer text-[11px] font-mono text-slate-300 w-10 text-center hover:text-sky-400"
          >
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={onZoomIn} className="p-1 rounded hover:bg-slate-800">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Tools Drawer Toggle */}
        {onToggleMobileTools && (
          <button
            onClick={onToggleMobileTools}
            className={`md:hidden p-1.5 rounded transition flex items-center ${
              isMobileToolsOpen ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Toggle Tools"
          >
            <Wrench className="w-4 h-4" />
          </button>
        )}

        {/* Mobile Layers / Right Panel Toggle */}
        {onToggleMobileRightSidebar && (
          <button
            onClick={onToggleMobileRightSidebar}
            className={`md:hidden p-1.5 rounded transition flex items-center ${
              isMobileRightSidebarOpen ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Toggle Layers & Panels"
          >
            <LayersIcon className="w-4 h-4" />
          </button>
        )}

        {/* Quick Export Button */}
        <button
          onClick={onExportImage}
          className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-2 sm:px-3 py-1 rounded-md shadow flex items-center space-x-1 transition text-xs ml-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded hover:bg-slate-800 text-slate-300 transition"
          title="Menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-3 shadow-2xl z-50 space-y-2 animate-in slide-in-from-top-2 text-xs">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => {
                onNewCanvas();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-slate-200"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>New Project</span>
            </button>
            <button
              onClick={() => {
                onImportImage();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-slate-200"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Import Image</span>
            </button>
            <button
              onClick={() => {
                onOpenProject();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-slate-200"
            >
              <FileUp className="w-4 h-4 text-amber-400" />
              <span>Open Project</span>
            </button>
            <button
              onClick={() => {
                onSaveProject();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-slate-200"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span>Save Project</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onToggleGrid();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-slate-200"
            >
              <Grid className="w-4 h-4 text-sky-400" />
              <span>Grid: {gridType.toUpperCase()}</span>
            </button>
            <button
              onClick={() => {
                onClearLayer();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-750 flex items-center space-x-2 text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Layer</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

