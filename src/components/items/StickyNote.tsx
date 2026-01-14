import { useRef } from 'react';
import { Rect, Text, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface StickyNoteProps {
  item: Item;
}

const StickyNote = ({ item }: StickyNoteProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds } = useCanvasStore();
  // TODO: Implement inline editing functionality
  // const [isEditing, setIsEditing] = useState(false);

  const isSelected = selectedItemIds.includes(item.id);
  const color = item.content.color || '#FEF08A'; // Default yellow
  const text = item.content.text || '';

  // Debounced update to database
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
    // TODO: Open inline text editor
    console.log('Edit sticky note:', item.id);
  };

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
        fill={color}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={isSelected ? 15 : 8}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.3}
        stroke={isSelected ? '#6366F1' : 'transparent'}
        strokeWidth={3}
      />

      {/* Text */}
      <Text
        x={12}
        y={12}
        width={item.width - 24}
        height={item.height - 24}
        text={text}
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fill="#1a1a1a"
        wrap="word"
        align="left"
        verticalAlign="top"
      />
    </Group>
  );
};

export default StickyNote;
