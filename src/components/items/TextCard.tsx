import { useRef } from 'react';
import { Rect, Text, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface TextCardProps {
  item: Item;
}

const TextCard = ({ item }: TextCardProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds, theme } = useCanvasStore();

  const isSelected = selectedItemIds.includes(item.id);
  const title = item.content.title || 'Untitled';
  const body = item.content.body || '';

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

  const bgColor = theme === 'light' ? '#FFFFFF' : '#2D2D2D';
  const textColor = theme === 'light' ? '#1a1a1a' : '#E5E5E5';
  const titleColor = theme === 'light' ? '#000000' : '#FFFFFF';

  return (
    <Group
      ref={groupRef}
      x={item.position_x}
      y={item.position_y}
      draggable
      onDragEnd={handleDragEnd}
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

      {/* Title */}
      <Text
        x={16}
        y={16}
        width={item.width - 32}
        text={title}
        fontSize={18}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill={titleColor}
      />

      {/* Body */}
      <Text
        x={16}
        y={50}
        width={item.width - 32}
        height={item.height - 66}
        text={body}
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fill={textColor}
        wrap="word"
        align="left"
        verticalAlign="top"
      />
    </Group>
  );
};

export default TextCard;
