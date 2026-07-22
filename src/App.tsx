import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CanvasEngine } from './lib/canvasEngine';
import { applyImageFilters } from './lib/imageFilters';
import {
  ToolType,
  BrushSettings,
  ShapeSettings,
  TextSettings,
  FilterSettings,
  Point,
  SymmetryMode,
  GridType,
} from './types';

// Components
import { TopMenuBar } from './components/TopMenuBar';
import { ToolSidebar } from './components/ToolSidebar';
import { ToolPropertiesBar } from './components/ToolPropertiesBar';
import { RightSidebar } from './components/RightSidebar';
import { CanvasArea } from './components/CanvasArea';
import { StatusBar } from './components/StatusBar';
import {
  NewCanvasModal,
  ExportModal,
  TextModal,
} from './components/Modals';

export default function App() {
  // Engine Instance
  const engineRef = useRef<CanvasEngine>(new CanvasEngine(1920, 1080));
  const engine = engineRef.current;

  // App & Project State
  const [projectName, setProjectName] = useState('Untitled Masterpiece');
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [activeTab, setActiveTab] = useState<string>('layers');

  // Color Swatches
  const [primaryColor, setPrimaryColor] = useState('#3B82F6'); // Default Sky Blue
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [customPalette, setCustomPalette] = useState<string[]>([
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
  ]);

  // Tool Settings
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    type: 'standard',
    size: 16,
    opacity: 1,
    hardness: 0.8,
    spacing: 0.1,
    usePressure: true,
    pressureSensitivity: 1,
  });

  const [shapeSettings, setShapeSettings] = useState<ShapeSettings>({
    type: 'rectangle',
    drawMode: 'stroke',
    strokeWidth: 4,
    sides: 5,
    starInnerRadiusRatio: 0.4,
    cornerRadius: 8,
  });

  const [textSettings, setTextSettings] = useState<TextSettings>({
    text: '',
    fontFamily: 'Inter',
    fontSize: 32,
    bold: false,
    italic: false,
    align: 'left',
    fillColor: '#3B82F6',
  });

  const [bucketTolerance, setBucketTolerance] = useState(25);
  const [symmetryMode, setSymmetryMode] = useState<SymmetryMode>('none');
  const [symmetryAxes, setSymmetryAxes] = useState(6);
  const [gridType, setGridType] = useState<GridType>('none');
  const [gridSize, setGridSize] = useState(20);

  // Filters State
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
  });

  // Cursor & Modals
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, pressure: 0.5 });
  const [textPromptPos, setTextPromptPos] = useState<Point | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Force re-render state hook for Canvas state changes
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    engine.onStateChange = forceUpdate;
  }, [engine, forceUpdate]);

  // Swap Primary and Secondary Colors
  const handleSwapColors = () => {
    setPrimaryColor(secondaryColor);
    setSecondaryColor(primaryColor);
  };

  // Add Custom Color to Palette
  const handleAddCustomColor = (color: string) => {
    if (!customPalette.includes(color)) {
      setCustomPalette([...customPalette, color]);
    }
  };

  // 1. New Canvas Setup
  const handleCreateNewCanvas = (w: number, h: number, bg: string) => {
    engine.width = w;
    engine.height = h;
    engine.layers = [];
    const defaultLayer = engine.createLayer('Background');
    defaultLayer.ctx.fillStyle = bg;
    defaultLayer.ctx.fillRect(0, 0, w, h);
    engine.layers = [defaultLayer];
    engine.activeLayerId = defaultLayer.id;
    engine.transform = { zoom: 1, panX: 0, panY: 0 };
    engine.historyStack = [];
    engine.historyIndex = -1;
    engine.saveHistory('New Canvas');
    engine.notifyChange();
  };

  // 2. Open Project JSON
  const handleOpenProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.canvas';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const text = await file.text();
        await engine.importProjectJSON(text);
        setProjectName(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    input.click();
  };

  // 3. Save Project JSON
  const handleSaveProject = () => {
    const jsonStr = engine.exportProjectJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.canvas`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4. Import Image onto active layer
  const handleImportImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            let active = engine.getActiveLayer();
            if (!active) {
              active = engine.addLayer();
            }
            active.ctx.drawImage(img, 0, 0, engine.width, engine.height);
            engine.saveHistory('Import Image');
            engine.notifyChange();
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 5. Apply Image Filters to Active Layer
  const handleApplyFilters = () => {
    const active = engine.getActiveLayer();
    if (!active || active.locked) return;

    const originalData = active.ctx.getImageData(0, 0, engine.width, engine.height);
    const filteredData = applyImageFilters(originalData, filterSettings);
    active.ctx.putImageData(filteredData, 0, 0);

    engine.saveHistory('Apply Filters');
    engine.notifyChange();
  };

  const handleResetFilters = () => {
    setFilterSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
    });
  };

  // 6. Direct Print
  const handlePrint = () => {
    const dataUrl = engine.exportImage('png', 1, true);
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(
        `<html><head><title>Print ${projectName}</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;"><img src="${dataUrl}" style="max-width:100%;height:auto;"/></body></html>`
      );
      printWin.document.close();
      printWin.print();
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) engine.redo();
        else engine.undo();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        engine.redo();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        handleSaveProject();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        setShowNewModal(true);
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'b') {
        setActiveTool('brush');
      } else if (e.key.toLowerCase() === 'e') {
        setActiveTool('eraser');
      } else if (e.key.toLowerCase() === 'g') {
        setActiveTool('bucket');
      } else if (e.key.toLowerCase() === 'i') {
        setActiveTool('eyedropper');
      } else if (e.key.toLowerCase() === 't') {
        setActiveTool('text');
      } else if (e.key.toLowerCase() === 'u') {
        setActiveTool('shape');
      } else if (e.key.toLowerCase() === 'h') {
        setActiveTool('hand');
      } else if (e.key.toLowerCase() === 'x') {
        handleSwapColors();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  // Sync Symmetry & Grid Settings to Engine
  useEffect(() => {
    engine.symmetryMode = symmetryMode;
    engine.symmetryAxes = symmetryAxes;
    engine.gridType = gridType;
    engine.gridSize = gridSize;
    engine.notifyChange();
  }, [engine, symmetryMode, symmetryAxes, gridType, gridSize]);

  const activeLayer = engine.getActiveLayer();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* 1. Top Navigation & Action Bar */}
      <TopMenuBar
        projectName={projectName}
        setProjectName={setProjectName}
        onNewCanvas={() => setShowNewModal(true)}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onExportImage={() => setShowExportModal(true)}
        onImportImage={handleImportImage}
        onUndo={() => engine.undo()}
        onRedo={() => engine.redo()}
        canUndo={engine.historyIndex > 0}
        canRedo={engine.historyIndex < engine.historyStack.length - 1}
        zoom={engine.transform.zoom}
        onZoomIn={() => {
          engine.transform.zoom = Math.min(10, engine.transform.zoom * 1.25);
          engine.notifyChange();
        }}
        onZoomOut={() => {
          engine.transform.zoom = Math.max(0.1, engine.transform.zoom * 0.8);
          engine.notifyChange();
        }}
        onResetZoom={() => {
          engine.transform = { zoom: 1, panX: 0, panY: 0 };
          engine.notifyChange();
        }}
        gridType={gridType}
        onToggleGrid={() => {
          setGridType(gridType === 'none' ? 'square' : gridType === 'square' ? 'isometric' : 'none');
        }}
        onClearLayer={() => engine.clearActiveLayer()}
        onPrint={handlePrint}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApplyFilterModal={() => setActiveTab('filters')}
      />

      {/* 2. Tool Contextual Settings Sub-Bar */}
      <ToolPropertiesBar
        activeTool={activeTool}
        brushSettings={brushSettings}
        setBrushSettings={setBrushSettings}
        shapeSettings={shapeSettings}
        setShapeSettings={setShapeSettings}
        textSettings={textSettings}
        setTextSettings={setTextSettings}
        bucketTolerance={bucketTolerance}
        setBucketTolerance={setBucketTolerance}
        symmetryMode={symmetryMode}
        setSymmetryMode={setSymmetryMode}
        symmetryAxes={symmetryAxes}
        setSymmetryAxes={setSymmetryAxes}
        gridType={gridType}
        setGridType={setGridType}
        gridSize={gridSize}
        setGridSize={setGridSize}
      />

      {/* 3. Main Workspace Grid Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <ToolSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          activeBrushType={brushSettings.type}
          setActiveBrushType={(type) => setBrushSettings((s) => ({ ...s, type }))}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          onSwapColors={handleSwapColors}
        />

        {/* Main Canvas Viewport */}
        <CanvasArea
          engine={engine}
          activeTool={activeTool}
          brushSettings={brushSettings}
          shapeSettings={shapeSettings}
          textSettings={{ ...textSettings, fillColor: primaryColor }}
          bucketTolerance={bucketTolerance}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          setPrimaryColor={setPrimaryColor}
          onTextPromptReq={(pos) => setTextPromptPos(pos)}
          setCursorPos={setCursorPos}
        />

        {/* Right Sidebar Docks */}
        <RightSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          layers={engine.layers}
          activeLayerId={engine.activeLayerId}
          setActiveLayerId={(id) => {
            engine.activeLayerId = id;
            engine.notifyChange();
          }}
          onAddLayer={() => engine.addLayer()}
          onDeleteLayer={(id) => engine.deleteLayer(id)}
          onDuplicateLayer={(id) => engine.duplicateLayer(id)}
          onReorderLayer={(from, to) => engine.reorderLayers(from, to)}
          onToggleLayerVisibility={(id) => {
            const l = engine.layers.find((layer) => layer.id === id);
            if (l) {
              l.visible = !l.visible;
              engine.notifyChange();
            }
          }}
          onToggleLayerLock={(id) => {
            const l = engine.layers.find((layer) => layer.id === id);
            if (l) {
              l.locked = !l.locked;
              engine.notifyChange();
            }
          }}
          onUpdateLayerOpacity={(id, opacity) => {
            const l = engine.layers.find((layer) => layer.id === id);
            if (l) {
              l.opacity = opacity;
              engine.notifyChange();
            }
          }}
          onUpdateLayerBlendMode={(id, mode) => {
            const l = engine.layers.find((layer) => layer.id === id);
            if (l) {
              l.blendMode = mode;
              engine.notifyChange();
            }
          }}
          onRenameLayer={(id, newName) => {
            const l = engine.layers.find((layer) => layer.id === id);
            if (l) {
              l.name = newName;
              engine.notifyChange();
            }
          }}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
          customPalette={customPalette}
          onAddCustomColor={handleAddCustomColor}
          filterSettings={filterSettings}
          setFilterSettings={setFilterSettings}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          historyStack={engine.historyStack}
          historyIndex={engine.historyIndex}
          onJumpToHistory={(idx) => engine.jumpToHistoryStep(idx)}
        />
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar
        width={engine.width}
        height={engine.height}
        zoom={engine.transform.zoom}
        cursorPos={cursorPos}
        activeLayerName={activeLayer?.name || ''}
        activeTool={activeTool}
      />

      {/* 5. Floating Modals */}
      <NewCanvasModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={handleCreateNewCanvas}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(format, quality, includeBg) => {
          const dataUrl = engine.exportImage(format, quality, includeBg);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.${format}`;
          a.click();
        }}
      />

      <TextModal
        isOpen={textPromptPos !== null}
        onClose={() => setTextPromptPos(null)}
        onSubmit={(txt) => {
          if (textPromptPos) {
            engine.drawText(textPromptPos, {
              ...textSettings,
              text: txt,
              fillColor: primaryColor,
            });
            setTextPromptPos(null);
          }
        }}
      />
    </div>
  );
}
