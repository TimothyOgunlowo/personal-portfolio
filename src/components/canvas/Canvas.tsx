import { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '@/store/canvasStore';
import { useCanvas } from '@/hooks/useCanvas';
import { supabase } from '@/lib/supabase';
import GridLayer from './GridLayer';
import CanvasItem from './CanvasItem';
import Minimap from './Minimap';

const Canvas = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { stageRef, panX, panY, zoomLevel, handleWheel, handleDragEnd } = useCanvas();
  const { items, activeTool, currentBoard, addItem, setActiveTool } = useCanvasStore();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle canvas click to create items
  const handleStageClick = async (e: KonvaEventObject<MouseEvent>) => {
    // Only create items if we're not in select mode and clicked on the stage (not an item)
    if (activeTool === 'select' || e.target !== e.target.getStage()) {
      return;
    }

    if (!currentBoard) {
      console.error('No current board');
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Convert screen coordinates to canvas coordinates
    const x = (pointerPosition.x - panX) / zoomLevel;
    const y = (pointerPosition.y - panY) / zoomLevel;

    // Default dimensions for different item types
    let width = 200;
    let height = 150;
    let content: any = {};

    switch (activeTool) {
      case 'sticky':
        width = 200;
        height = 200;
        content = { text: 'New note', color: '#FEF08A' };
        break;
      case 'text_card':
        width = 300;
        height = 200;
        content = { title: 'New Card', body: 'Enter text here...' };
        break;
      case 'board':
        width = 180;
        height = 160;
        content = { title: 'New Board', color: '#6366F1', item_count: 0 };
        break;
      case 'document':
        width = 120;
        height = 120;
        content = { title: 'New Document', html: '' };
        break;
      case 'image':
        width = 300;
        height = 200;
        content = { image_url: '', alt_text: '' };
        break;
      case 'file':
        width = 140;
        height = 120;
        content = { file_id: '' };
        break;
      default:
        return;
    }

    try {
      // Create item in database
      const { data, error } = await supabase
        .from('items')
        .insert({
          board_id: currentBoard.id,
          type: activeTool === 'board' ? 'board_link' : activeTool,
          position_x: x,
          position_y: y,
          width,
          height,
          content,
          z_index: items.length,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      addItem(data);

      // Reset to select tool after creating item
      setActiveTool('select');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

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
        onClick={handleStageClick}
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
