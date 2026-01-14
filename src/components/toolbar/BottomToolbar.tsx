import { useEffect } from 'react';
import {
  MousePointer2,
  FolderPlus,
  StickyNote as StickyNoteIcon,
  FileText,
  FileEdit,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';
import { ToolType } from '@/lib/types';

const BottomToolbar = () => {
  const { activeTool, setActiveTool, theme } = useCanvasStore();

  const tools: { type: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
    { type: 'select', icon: <MousePointer2 size={20} />, label: 'Select', shortcut: 'V' },
    { type: 'board', icon: <FolderPlus size={20} />, label: 'Board', shortcut: 'B' },
    { type: 'sticky', icon: <StickyNoteIcon size={20} />, label: 'Sticky', shortcut: 'S' },
    { type: 'text_card', icon: <FileText size={20} />, label: 'Text Card', shortcut: 'T' },
    { type: 'document', icon: <FileEdit size={20} />, label: 'Document', shortcut: 'D' },
    { type: 'image', icon: <ImageIcon size={20} />, label: 'Image', shortcut: 'I' },
    { type: 'file', icon: <Upload size={20} />, label: 'File', shortcut: 'F' },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      const toolMap: Record<string, ToolType> = {
        'v': 'select',
        'b': 'board',
        's': 'sticky',
        't': 'text_card',
        'd': 'document',
        'i': 'image',
        'f': 'file',
      };

      if (toolMap[key]) {
        console.log('🎹 Keyboard shortcut:', key, '→', toolMap[key]);
        setActiveTool(toolMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setActiveTool]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div
        className={`flex items-center gap-1 px-4 py-3 rounded-full shadow-lg backdrop-blur-custom ${
          theme === 'light'
            ? 'bg-white/80 border border-gray-200'
            : 'bg-card-dark/80 border border-gray-600'
        }`}
      >
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => {
              console.log('🎯 Toolbar button clicked:', tool.type);
              setActiveTool(tool.type);
            }}
            className={`relative group px-3 py-2 rounded-lg transition-all duration-150 ${
              activeTool === tool.type
                ? 'bg-indigo-500 text-white'
                : theme === 'light'
                ? 'hover:bg-gray-100 text-gray-700'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                theme === 'light' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-200'
              }`}>
                {tool.label}
                <span className="ml-1 opacity-60">{tool.shortcut}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Add useEffect import
import { useEffect } from 'react';

export default BottomToolbar;
