import React from 'react';
import { Activity, Move, Layers, Maximize, ExternalLink } from 'lucide-react';

interface StatusBarProps {
  width: number;
  height: number;
  zoom: number;
  cursorPos: { x: number; y: number; pressure: number };
  activeLayerName: string;
  activeTool: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  width,
  height,
  zoom,
  cursorPos,
  activeLayerName,
  activeTool,
}) => {
  return (
    <footer className="h-7 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-2 sm:px-3 text-[10px] sm:text-[11px] text-slate-400 select-none z-30 shrink-0">
      {/* Left: Canvas Dimensions & Zoom */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-1" title="Canvas Dimensions">
          <Maximize className="w-3 h-3 text-slate-500" />
          <span className="font-mono text-slate-300">
            {width}×{height}
          </span>
        </div>

        <div className="flex items-center space-x-1" title="Zoom Level">
          <span className="text-slate-500 font-medium">Zoom:</span>
          <span className="font-mono text-sky-400 font-semibold">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Middle: Active Layer & Active Tool */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-1.5" title="Active Layer">
          <Layers className="w-3 h-3 text-sky-400" />
          <span className="text-slate-300 font-medium truncate max-w-[100px]">
            {activeLayerName || 'No Layer'}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-slate-500">Tool:</span>
          <span className="text-slate-200 capitalize font-medium">{activeTool}</span>
        </div>
      </div>

      {/* Right: Khemamssa Hatem Link & Cursor Coordinates */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Khemamssa Hatem Link Button */}
        <a
          href="https://hatemkhe.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium px-2 py-0.5 rounded text-[10px] sm:text-xs shadow-xs transition transform hover:scale-105 active:scale-95"
          title="Visit Khemamssa Hatem Portfolio"
        >
          <span>Khemamssa Hatem</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>

        <div className="flex items-center space-x-1 font-mono" title="Cursor Coordinates">
          <Move className="w-3 h-3 text-slate-500 hidden sm:inline" />
          <span>
            {cursorPos.x}, {cursorPos.y}
          </span>
        </div>
      </div>
    </footer>
  );
};
