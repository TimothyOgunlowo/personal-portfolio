import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Folder,
  Home as HomeIcon,
  Plus
} from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, theme, setActiveTool } = useCanvasStore();
  const [expandedBoards, setExpandedBoards] = useState<Set<string>>(new Set(['home']));

  const toggleBoard = (boardId: string) => {
    setExpandedBoards(prev => {
      const next = new Set(prev);
      if (next.has(boardId)) {
        next.delete(boardId);
      } else {
        next.add(boardId);
      }
      return next;
    });
  };

  // TODO: Load actual board hierarchy from database
  const boardHierarchy = [
    {
      id: 'home',
      name: 'Home',
      children: [
        { id: 'project1', name: 'Project Board', children: [] },
        { id: 'ideas', name: 'Ideas', children: [] },
      ],
    },
  ];

  const handleQuickAdd = (tool: string) => {
    setActiveTool(tool as any);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`fixed left-0 top-20 z-50 p-2 rounded-r-lg transition-all ${
          theme === 'light'
            ? 'bg-white border border-l-0 border-gray-200 text-gray-700 hover:bg-gray-50'
            : 'bg-card-dark border border-l-0 border-gray-600 text-gray-300 hover:bg-gray-700'
        } ${isSidebarOpen ? 'translate-x-64' : 'translate-x-0'}`}
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'light'
            ? 'bg-white border-r border-gray-200'
            : 'bg-card-dark border-r border-gray-600'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Boards
            </h2>
          </div>

          {/* Board tree */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {boardHierarchy.map(board => (
              <BoardTreeNode
                key={board.id}
                board={board}
                expanded={expandedBoards.has(board.id)}
                onToggle={() => toggleBoard(board.id)}
                theme={theme}
                level={0}
              />
            ))}
          </div>

          {/* Quick add buttons */}
          <div className={`p-4 border-t ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <p className={`text-xs font-semibold mb-2 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              QUICK ADD
            </p>
            <div className="space-y-1">
              <QuickAddButton label="Board" onClick={() => handleQuickAdd('board')} theme={theme} />
              <QuickAddButton label="Sticky Note" onClick={() => handleQuickAdd('sticky')} theme={theme} />
              <QuickAddButton label="Text Card" onClick={() => handleQuickAdd('text_card')} theme={theme} />
              <QuickAddButton label="Document" onClick={() => handleQuickAdd('document')} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Board tree node component
const BoardTreeNode = ({ board, expanded, onToggle, theme, level }: any) => {
  const hasChildren = board.children && board.children.length > 0;

  return (
    <div style={{ marginLeft: `${level * 12}px` }}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
          theme === 'light'
            ? 'hover:bg-gray-100 text-gray-700'
            : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />
        ) : (
          <div className="w-3.5" />
        )}
        {level === 0 ? <HomeIcon size={14} /> : <Folder size={14} />}
        <span className="flex-1 text-left">{board.name}</span>
      </button>

      {hasChildren && expanded && (
        <div className="mt-1">
          {board.children.map((child: any) => (
            <BoardTreeNode
              key={child.id}
              board={child}
              expanded={false}
              onToggle={() => {}}
              theme={theme}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Quick add button component
const QuickAddButton = ({ label, onClick, theme }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
      theme === 'light'
        ? 'hover:bg-gray-100 text-gray-700'
        : 'hover:bg-gray-700 text-gray-300'
    }`}
  >
    <Plus size={14} />
    <span>{label}</span>
  </button>
);

export default Sidebar;
