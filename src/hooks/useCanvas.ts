import { useCallback, useRef } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { useCanvasStore } from '@/store/canvasStore';

const GRID_SNAP_THRESHOLD = 12;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_SPEED = 0.001;

export const useCanvas = () => {
  const stageRef = useRef<Stage | null>(null);
  const { panX, panY, zoomLevel, setPan, setZoom } = useCanvasStore();

  // Snap to grid helper
  const snapToGrid = useCallback((value: number, gridSize: number = 20): number => {
    const snapped = Math.round(value / gridSize) * gridSize;
    return Math.abs(value - snapped) < GRID_SNAP_THRESHOLD ? snapped : value;
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const delta = e.evt.deltaY;
    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldScale - delta * ZOOM_SPEED));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setZoom(newScale);
    setPan(newPos.x, newPos.y);
  }, [setPan, setZoom]);

  // Handle stage drag (panning)
  const handleDragEnd = useCallback((e: KonvaEventObject<DragEvent>) => {
    const stage = e.target as Stage;
    setPan(stage.x(), stage.y());
  }, [setPan]);

  return {
    stageRef,
    panX,
    panY,
    zoomLevel,
    handleWheel,
    handleDragEnd,
    snapToGrid,
  };
};
