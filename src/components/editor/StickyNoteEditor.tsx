import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';

interface StickyNoteEditorProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const STICKY_COLORS = [
  { name: 'Yellow', value: '#FEF08A' },
  { name: 'Pink', value: '#FBCFE8' },
  { name: 'Blue', value: '#BFDBFE' },
  { name: 'Green', value: '#BBF7D0' },
  { name: 'Purple', value: '#DDD6FE' },
  { name: 'Orange', value: '#FED7AA' },
];

const StickyNoteEditor = ({ item, isOpen, onClose }: StickyNoteEditorProps) => {
  const { theme, updateItem } = useCanvasStore();
  const [text, setText] = useState('');
  const [color, setColor] = useState('#FEF08A');

  useEffect(() => {
    if (item) {
      setText(item.content.text || '');
      setColor(item.content.color || '#FEF08A');
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    const updates = {
      content: {
        ...item.content,
        text,
        color,
      },
    };

    updateItem(item.id, updates);

    await supabase
      .from('items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sticky Note" width="max-w-md">
      <div className="p-6">
        {/* Color picker */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {STICKY_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  color === c.value
                    ? 'border-indigo-500 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Text area */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Note Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note here..."
            rows={8}
            className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                : 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
            }`}
            style={{ backgroundColor: color, color: '#1a1a1a' }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-700'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StickyNoteEditor;
