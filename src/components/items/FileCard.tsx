import { useRef } from 'react';
import { Rect, Text, Group, Path } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Item } from '@/lib/types';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';

interface FileCardProps {
  item: Item;
}

const FileCard = ({ item }: FileCardProps) => {
  const groupRef = useRef<any>(null);
  const { updateItem, selectedItemIds, theme } = useCanvasStore();

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

  const handleClick = async () => {
    // TODO: Download file
    console.log('Download file:', item.content.file_id);
  };

  const bgColor = theme === 'light' ? '#FFFFFF' : '#2D2D2D';
  const textColor = theme === 'light' ? '#1a1a1a' : '#E5E5E5';

  // TODO: Helper to format file size when fetching actual file metadata
  // const formatFileSize = (bytes: number) => {
  //   if (bytes < 1024) return bytes + ' B';
  //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  //   return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  // };

  return (
    <Group
      ref={groupRef}
      x={item.position_x}
      y={item.position_y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleClick}
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

      {/* File icon */}
      <Path
        x={item.width / 2 - 20}
        y={20}
        data="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        fill={theme === 'light' ? '#6366F1' : '#818CF8'}
        scaleX={1.5}
        scaleY={1.5}
      />

      {/* Filename */}
      <Text
        x={12}
        y={75}
        width={item.width - 24}
        text="File.pdf" // TODO: Get actual filename
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fontStyle="600"
        fill={textColor}
        align="center"
        wrap="word"
      />

      {/* File size */}
      <Text
        x={12}
        y={95}
        width={item.width - 24}
        text="1.2 MB" // TODO: Get actual file size
        fontSize={12}
        fontFamily="Inter, sans-serif"
        fill={textColor}
        opacity={0.6}
        align="center"
      />
    </Group>
  );
};

export default FileCard;
