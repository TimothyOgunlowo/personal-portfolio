import { useState, useRef, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import EditorToolbar from './EditorToolbar';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';

interface DocumentEditorProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentEditor = ({ item, isOpen, onClose }: DocumentEditorProps) => {
  const { theme, updateItem } = useCanvasStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.content.title || '');
      setContent(item.content.html || '');
    }
  }, [item]);

  useEffect(() => {
    // Update word count
    const text = contentRef.current?.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleSave = async () => {
    if (!item) return;

    const updates = {
      content: {
        ...item.content,
        title,
        html: contentRef.current?.innerHTML || '',
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

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Editor" width="max-w-5xl">
      <div className="flex h-[80vh]">
        {/* Toolbar */}
        <EditorToolbar onCommand={execCommand} theme={theme} />

        {/* Editor area */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <div className="px-8 pt-6 pb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title..."
              className={`w-full text-3xl font-bold bg-transparent border-none outline-none ${
                theme === 'light'
                  ? 'text-gray-900 placeholder-gray-400'
                  : 'text-white placeholder-gray-500'
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 px-8 overflow-y-auto custom-scrollbar">
            <div
              ref={contentRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
              className={`min-h-full outline-none prose max-w-none ${
                theme === 'light'
                  ? 'prose-gray text-gray-700'
                  : 'prose-invert text-gray-300'
              }`}
              style={{
                fontSize: '16px',
                lineHeight: '1.75',
              }}
            />
          </div>

          {/* Footer */}
          <div className={`px-8 py-4 border-t flex items-center justify-between ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <div className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </div>

            <div className="flex gap-2">
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
        </div>
      </div>
    </Modal>
  );
};

export default DocumentEditor;
