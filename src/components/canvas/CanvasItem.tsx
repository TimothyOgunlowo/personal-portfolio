import { Item } from '@/lib/types';
import StickyNote from '@/components/items/StickyNote';
import TextCard from '@/components/items/TextCard';
import BoardCard from '@/components/items/BoardCard';
import DocumentCard from '@/components/items/DocumentCard';
import ImageCard from '@/components/items/ImageCard';
import FileCard from '@/components/items/FileCard';

interface CanvasItemProps {
  item: Item;
}

const CanvasItem = ({ item }: CanvasItemProps) => {
  switch (item.type) {
    case 'sticky':
      return <StickyNote item={item} />;
    case 'text_card':
      return <TextCard item={item} />;
    case 'board_link':
      return <BoardCard item={item} />;
    case 'document':
      return <DocumentCard item={item} />;
    case 'image':
      return <ImageCard item={item} />;
    case 'file':
      return <FileCard item={item} />;
    default:
      return null;
  }
};

export default CanvasItem;
