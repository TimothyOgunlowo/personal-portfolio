import { Layer, Line } from 'react-konva';
import { useCanvasStore } from '@/store/canvasStore';

const GRID_SIZE = 20;
const GRID_OPACITY_THRESHOLD = 0.5; // Show grid when zoom > this value

interface GridLayerProps {
  width: number;
  height: number;
}

const GridLayer = ({ width, height }: GridLayerProps) => {
  const { zoomLevel, theme } = useCanvasStore();

  // Only show grid at higher zoom levels
  if (zoomLevel < GRID_OPACITY_THRESHOLD) {
    return null;
  }

  const gridColor = theme === 'light' ? '#d1d5db' : '#404040';
  const opacity = Math.min(1, (zoomLevel - GRID_OPACITY_THRESHOLD) / 0.5);

  const lines: JSX.Element[] = [];

  // Vertical lines
  for (let i = 0; i < width / GRID_SIZE + 1; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * GRID_SIZE, 0, i * GRID_SIZE, height]}
        stroke={gridColor}
        strokeWidth={1}
        opacity={opacity * 0.3}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i < height / GRID_SIZE + 1; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * GRID_SIZE, width, i * GRID_SIZE]}
        stroke={gridColor}
        strokeWidth={1}
        opacity={opacity * 0.3}
      />
    );
  }

  return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
