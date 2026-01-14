import { useRef } from 'react';
import { Rect, Image, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface ImageCardProps {
  item: Item;
}

const ImageCard = ({ item }: ImageCardProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds } = useCanvasStore();
  const [image] = useImage(item.content.image_url || '', 'anonymous');

  const isSelected = selectedItemIds.includes(item.id);

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
    // TODO: Open image in lightbox
    console.log('Open image lightbox:', item.content.image_url);
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
      {/* Background/border */}
      <Rect
        width={item.width}
        height={item.height}
        fill="#FFFFFF"
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={isSelected ? 15 : 8}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.3}
        stroke={isSelected ? '#6366F1' : '#E5E5E5'}
        strokeWidth={isSelected ? 3 : 1}
      />

      {/* Image */}
      {image && (
        <Image
          image={image}
          x={0}
          y={0}
          width={item.width}
          height={item.height}
          cornerRadius={8}
        />
      )}

      {/* Placeholder if image not loaded */}
      {!image && (
        <Rect
          width={item.width}
          height={item.height}
          fill="#F3F4F6"
          cornerRadius={8}
        />
      )}
    </Group>
  );
};

export default ImageCard;
