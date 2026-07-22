import React, { useState } from 'react';
import { Download, Sparkles, X, Image as ImageIcon, Check } from 'lucide-react';

interface NewCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (width: number, height: number, bg: string) => void;
}

export const NewCanvasModal: React.FC<NewCanvasModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [bgColor, setBgColor] = useState('#FFFFFF');

  if (!isOpen) return null;

  const presets = [
    { name: '1080p Full HD', w: 1920, h: 1080 },
    { name: '4K Ultra HD', w: 3840, h: 2160 },
    { name: 'Square Art (1:1)', w: 1080, h: 1080 },
    { name: 'Portrait Story (9:16)', w: 1080, h: 1920 },
    { name: 'Classic (800x600)', w: 800, h: 600 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <Sparkles className="w-5 h-5" />
            <span>Create New Canvas</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Dimension Presets:</span>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setWidth(p.w);
                  setHeight(p.h);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition ${
                  width === p.w && height === p.h
                    ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-semibold'
                    : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {p.w} × {p.h} px
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Width & Height */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Width (px)</label>
            <input
              type="number"
              min="100"
              max="8000"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Height (px)</label>
            <input
              type="number"
              min="100"
              max="8000"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
            />
          </div>
        </div>

        {/* Background Fill Color */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 block">Canvas Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200 flex-1"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate(width, height, bgColor);
              onClose();
            }}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white shadow-lg transition"
          >
            Create Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'jpeg' | 'svg', quality: number, bg: boolean) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [quality, setQuality] = useState(0.95);
  const [includeBg, setIncludeBg] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <Download className="w-5 h-5" />
            <span>Export Artwork</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium block">File Format:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'png', label: 'PNG' },
              { id: 'jpeg', label: 'JPEG' },
              { id: 'svg', label: 'SVG' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`py-2 rounded-lg border text-xs font-bold transition ${
                  format === f.id
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* JPEG Quality Slider */}
        {format === 'jpeg' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">JPEG Quality:</span>
              <span className="font-mono text-sky-400">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-sky-500 h-1"
            />
          </div>
        )}

        {/* Include Background */}
        <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={includeBg}
            onChange={(e) => setIncludeBg(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
          />
          <span>Include Canvas Background</span>
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onExport(format, quality, includeBg);
              onClose();
            }}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white shadow-lg flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const TextModal: React.FC<TextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-sm font-bold text-sky-400">Add Text to Layer</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type canvas text here..."
          autoFocus
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (text.trim()) {
                onSubmit(text);
                setText('');
                onClose();
              }
            }}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white shadow"
          >
            Insert Text
          </button>
        </div>
      </div>
    </div>
  );
};
