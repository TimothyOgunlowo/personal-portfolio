import { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '@/store/canvasStore';
import { useCanvas } from '@/hooks/useCanvas';
import GridLayer from './GridLayer';
import CanvasItem from './CanvasItem';
import Minimap from './Minimap';

const Canvas = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { stageRef, panX, panY, zoomLevel, handleWheel, handleDragEnd } = useCanvas();
  const { items, activeTool } = useCanvasStore();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Stage
        ref={(node) => {
          if (node) {
            stageRef.current = node;
          }
        }}
        width={dimensions.width}
        height={dimensions.height}
        draggable={activeTool === 'select'}
        x={panX}
        y={panY}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
      >
        {/* Grid layer */}
        <GridLayer width={dimensions.width * 4} height={dimensions.height * 4} />

        {/* Items layer */}
        <Layer>
          {items.map((item) => (
            <CanvasItem key={item.id} item={item} />
          ))}
        </Layer>
      </Stage>

      {/* Minimap */}
      <Minimap />
    </>
  );
};

export default Canvas;
