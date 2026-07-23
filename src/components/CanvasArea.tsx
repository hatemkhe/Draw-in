import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasEngine } from '../lib/canvasEngine';
import { BrushEngine } from '../lib/brushEngine';
import { floodFill } from '../lib/floodFill';
import {
  ToolType,
  BrushSettings,
  ShapeSettings,
  TextSettings,
  Point,
  SelectionArea,
} from '../types';

interface CanvasAreaProps {
  engine: CanvasEngine;
  activeTool: ToolType;
  brushSettings: BrushSettings;
  shapeSettings: ShapeSettings;
  textSettings: TextSettings;
  bucketTolerance: number;
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  onTextPromptReq: (pos: Point) => void;
  setCursorPos: (pos: { x: number; y: number; pressure: number }) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  engine,
  activeTool,
  brushSettings,
  shapeSettings,
  textSettings,
  bucketTolerance,
  primaryColor,
  secondaryColor,
  setPrimaryColor,
  onTextPromptReq,
  setCursorPos,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [shapeStartPoint, setShapeStartPoint] = useState<Point | null>(null);
  const [shapeCurrentPoint, setShapeCurrentPoint] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Multi-touch tracking for smartphone pinch zoom and panning
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchDistRef = useRef<number | null>(null);
  const isPinchingRef = useRef<boolean>(false);

  // Redraw main viewport canvas whenever engine signals change or state updates
  const redrawViewport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render engine composite image
    engine.renderComposite(ctx);

    // Draw active shape preview outline if dragging shape tool
    if (
      activeTool === 'shape' &&
      isDrawing &&
      shapeStartPoint &&
      shapeCurrentPoint
    ) {
      ctx.save();
      ctx.translate(engine.transform.panX, engine.transform.panY);
      ctx.scale(engine.transform.zoom, engine.transform.zoom);
      engine.drawShape(
        ctx,
        shapeStartPoint,
        shapeCurrentPoint,
        shapeSettings,
        primaryColor,
        secondaryColor
      );
      ctx.restore();
    }
  }, [
    engine,
    activeTool,
    isDrawing,
    shapeStartPoint,
    shapeCurrentPoint,
    shapeSettings,
    primaryColor,
    secondaryColor,
  ]);

  // Sync viewport size to container element with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawViewport();
    });

    resizeObserver.observe(container);
    engine.onStateChange = redrawViewport;

    return () => {
      resizeObserver.disconnect();
    };
  }, [engine, redrawViewport]);

  // Convert client mouse screen space to canvas logical coordinate space
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: e.pressure || 0.5 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = Math.round((clientX - engine.transform.panX) / engine.transform.zoom);
    const y = Math.round((clientY - engine.transform.panY) / engine.transform.zoom);
    const pressure = e.pressure !== undefined && e.pressure > 0 ? e.pressure : 0.5;

    return { x, y, pressure };
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch pinch zoom setup
    if (activePointersRef.current.size >= 2) {
      isPinchingRef.current = true;
      const pts = Array.from(activePointersRef.current.values()) as { x: number; y: number }[];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchDistRef.current = dist;
      setIsDrawing(false);
      return;
    }

    const pt = getCanvasPoint(e);
    setIsDrawing(true);
    setLastPoint(pt);

    const activeLayer = engine.getActiveLayer();

    // 1. Hand / Pan Canvas Tool
    if (activeTool === 'hand') {
      return;
    }

    // Check layer lock / visibility safety
    if (!activeLayer || !activeLayer.visible || activeLayer.locked) {
      return;
    }

    // 2. Bucket Tool
    if (activeTool === 'bucket') {
      floodFill(
        activeLayer.ctx,
        pt.x,
        pt.y,
        primaryColor,
        bucketTolerance
      );
      engine.saveHistory('Paint Bucket');
      engine.notifyChange();
      setIsDrawing(false);
      return;
    }

    // 3. Eyedropper Tool
    if (activeTool === 'eyedropper') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;
          const pixel = ctx.getImageData(clientX, clientY, 1, 1).data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
            .toString(16)
            .slice(1)}`;
          setPrimaryColor(hex);
        }
      }
      setIsDrawing(false);
      return;
    }

    // 4. Text Tool
    if (activeTool === 'text') {
      onTextPromptReq(pt);
      setIsDrawing(false);
      return;
    }

    // 5. Shape Tool Start
    if (activeTool === 'shape') {
      setShapeStartPoint(pt);
      setShapeCurrentPoint(pt);
      return;
    }

    // 6. Brush / Eraser Drawing Start
    if (
      [
        'brush',
        'pencil',
        'calligraphy',
        'marker',
        'highlighter',
        'watercolor',
        'airbrush',
        'pixel',
        'neon',
        'eraser',
      ].includes(activeTool)
    ) {
      const drawColor = activeTool === 'eraser' ? '#000000' : primaryColor;
      const effectiveSettings =
        activeTool === 'eraser'
          ? { ...brushSettings, type: 'standard' as const }
          : brushSettings;

      if (activeTool === 'eraser') {
        activeLayer.ctx.save();
        activeLayer.ctx.globalCompositeOperation = 'destination-out';
      }

      BrushEngine.drawStroke(
        activeLayer.ctx,
        pt,
        pt,
        drawColor,
        effectiveSettings,
        engine.symmetryMode,
        engine.symmetryAxes,
        engine.width,
        engine.height
      );

      if (activeTool === 'eraser') {
        activeLayer.ctx.restore();
      }

      redrawViewport();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Handle Multi-Touch Pinch Zoom and Pan
    if (activePointersRef.current.size >= 2) {
      const pts = Array.from(activePointersRef.current.values()) as { x: number; y: number }[];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);

      if (pinchDistRef.current !== null && pinchDistRef.current > 0) {
        const factor = dist / pinchDistRef.current;
        const newZoom = Math.min(10, Math.max(0.1, engine.transform.zoom * factor));
        
        // Midpoint of the 2 touch points
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
          const midY = (pts[0].y + pts[1].y) / 2 - rect.top;

          engine.transform.panX = midX - (midX - engine.transform.panX) * (newZoom / engine.transform.zoom);
          engine.transform.panY = midY - (midY - engine.transform.panY) * (newZoom / engine.transform.zoom);
          engine.transform.zoom = newZoom;
        }
      }
      pinchDistRef.current = dist;
      redrawViewport();
      return;
    }

    const pt = getCanvasPoint(e);
    setMousePos(pt);
    setCursorPos({ x: pt.x, y: pt.y, pressure: pt.pressure || 0.5 });

    if (!isDrawing || isPinchingRef.current) return;

    // 1. Hand / Pan Canvas
    if (activeTool === 'hand') {
      engine.transform.panX += e.movementX;
      engine.transform.panY += e.movementY;
      redrawViewport();
      return;
    }

    // 2. Shape Tool Dragging
    if (activeTool === 'shape') {
      setShapeCurrentPoint(pt);
      redrawViewport();
      return;
    }

    // 3. Brush Drawing
    const activeLayer = engine.getActiveLayer();
    if (
      lastPoint &&
      activeLayer &&
      activeLayer.visible &&
      !activeLayer.locked &&
      [
        'brush',
        'pencil',
        'calligraphy',
        'marker',
        'highlighter',
        'watercolor',
        'airbrush',
        'pixel',
        'neon',
        'eraser',
      ].includes(activeTool)
    ) {
      const drawColor = activeTool === 'eraser' ? '#000000' : primaryColor;
      const effectiveSettings =
        activeTool === 'eraser'
          ? { ...brushSettings, type: 'standard' as const }
          : brushSettings;

      if (activeTool === 'eraser') {
        activeLayer.ctx.save();
        activeLayer.ctx.globalCompositeOperation = 'destination-out';
      }

      BrushEngine.drawStroke(
        activeLayer.ctx,
        lastPoint,
        pt,
        drawColor,
        effectiveSettings,
        engine.symmetryMode,
        engine.symmetryAxes,
        engine.width,
        engine.height
      );

      if (activeTool === 'eraser') {
        activeLayer.ctx.restore();
      }

      setLastPoint(pt);
      redrawViewport();
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size < 2) {
      pinchDistRef.current = null;
    }

    if (isPinchingRef.current) {
      if (activePointersRef.current.size === 0) {
        isPinchingRef.current = false;
      }
      setIsDrawing(false);
      setShapeStartPoint(null);
      setShapeCurrentPoint(null);
      setLastPoint(null);
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    const activeLayer = engine.getActiveLayer();

    // Finalize Shape Drawing on Layer Context
    if (
      activeTool === 'shape' &&
      shapeStartPoint &&
      shapeCurrentPoint &&
      activeLayer &&
      !activeLayer.locked
    ) {
      engine.drawShape(
        activeLayer.ctx,
        shapeStartPoint,
        shapeCurrentPoint,
        shapeSettings,
        primaryColor,
        secondaryColor,
        e.shiftKey
      );
      engine.saveHistory(`Draw ${shapeSettings.type}`);
      engine.notifyChange();
    } else if (
      [
        'brush',
        'pencil',
        'calligraphy',
        'marker',
        'highlighter',
        'watercolor',
        'airbrush',
        'pixel',
        'neon',
        'eraser',
      ].includes(activeTool)
    ) {
      engine.saveHistory(
        activeTool === 'eraser' ? 'Eraser' : `${activeTool} stroke`
      );
    }

    setShapeStartPoint(null);
    setShapeCurrentPoint(null);
    setLastPoint(null);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(10, Math.max(0.1, engine.transform.zoom * zoomFactor));

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      engine.transform.panX =
        mouseX - (mouseX - engine.transform.panX) * (newZoom / engine.transform.zoom);
      engine.transform.panY =
        mouseY - (mouseY - engine.transform.panY) * (newZoom / engine.transform.zoom);
      engine.transform.zoom = newZoom;

      redrawViewport();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-crosshair select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsDrawing(false);
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="touch-none block"
      />

      {/* Dynamic Cursor Circle Overlay */}
      {isHovering &&
        [
          'brush',
          'pencil',
          'calligraphy',
          'marker',
          'highlighter',
          'watercolor',
          'airbrush',
          'pixel',
          'neon',
          'eraser',
        ].includes(activeTool) && (
          <div
            className="pointer-events-none fixed rounded-full border border-sky-400/80 bg-sky-400/10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: mousePos.x * engine.transform.zoom + engine.transform.panX,
              top: mousePos.y * engine.transform.zoom + engine.transform.panY,
              width: brushSettings.size * engine.transform.zoom,
              height: brushSettings.size * engine.transform.zoom,
            }}
          />
        )}
    </div>
  );
};
