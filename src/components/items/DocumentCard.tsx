import { useRef } from 'react';
import { Rect, Text, Group, Path } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface DocumentCardProps {
  item: Item;
}

const DocumentCard = ({ item }: DocumentCardProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds, theme, openEditor } = useCanvasStore();

  const isSelected = selectedItemIds.includes(item.id);
  const title = item.content.title || 'Untitled Document';

  const updateDatabase = async (updates: Partial<Item>) => {
    await supabase
      .from('items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const updates = {
      position_x: node.x(),
      position_y: node.y(),
    };
    updateItem(item.id, updates);
    updateDatabase(updates);
  };

  const handleDblClick = () => {
    openEditor(item.id, 'document');
  };

  const bgColor = theme === 'light' ? '#FFFFFF' : '#2D2D2D';
  const textColor = theme === 'light' ? '#1a1a1a' : '#E5E5E5';

  return (
    <Group
      ref={groupRef}
      x={item.position_x}
      y={item.position_y}
      draggable
      onDragEnd={handleDragEnd}
      onDblClick={handleDblClick}
    >
      {/* Background */}
      <Rect
        width={item.width}
        height={item.height}
        fill={bgColor}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={isSelected ? 15 : 8}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.3}
        stroke={isSelected ? '#6366F1' : theme === 'light' ? '#E5E5E5' : '#404040'}
        strokeWidth={isSelected ? 3 : 1}
      />

      {/* Document icon */}
      <Path
        x={20}
        y={20}
        data="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        stroke={theme === 'light' ? '#6366F1' : '#818CF8'}
        strokeWidth={2}
        scaleX={1.5}
        scaleY={1.5}
      />

      {/* Title */}
      <Text
        x={16}
        y={70}
        width={item.width - 32}
        text={title}
        fontSize={15}
        fontFamily="Inter, sans-serif"
        fontStyle="600"
        fill={textColor}
        wrap="word"
      />
    </Group>
  );
};

export default DocumentCard;
