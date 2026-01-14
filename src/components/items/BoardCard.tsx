import { useRef } from 'react';
import { Rect, Text, Group, Path } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface BoardCardProps {
  item: Item;
}

const BoardCard = ({ item }: BoardCardProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds, theme } = useCanvasStore();

  const isSelected = selectedItemIds.includes(item.id);
  const title = item.content.title || 'Untitled Board';
  const itemCount = item.content.item_count || 0;
  const iconColor = item.content.color || '#6366F1';

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
    // TODO: Implement board navigation with zoom transition
    console.log('Navigate to board:', item.content.linked_board_id);
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
        cornerRadius={12}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={isSelected ? 15 : 10}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.3}
        stroke={isSelected ? '#6366F1' : iconColor}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Folder icon (simplified) */}
      <Rect
        x={20}
        y={30}
        width={60}
        height={50}
        fill={iconColor}
        cornerRadius={8}
        opacity={0.2}
      />

      <Path
        x={30}
        y={40}
        data="M4 4h6l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
        fill={iconColor}
        scaleX={2}
        scaleY={2}
      />

      {/* Title */}
      <Text
        x={20}
        y={100}
        width={item.width - 40}
        text={title}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontStyle="600"
        fill={textColor}
        align="left"
      />

      {/* Item count */}
      <Text
        x={20}
        y={125}
        width={item.width - 40}
        text={`${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        fontSize={13}
        fontFamily="Inter, sans-serif"
        fill={textColor}
        opacity={0.6}
        align="left"
      />
    </Group>
  );
};

export default BoardCard;
