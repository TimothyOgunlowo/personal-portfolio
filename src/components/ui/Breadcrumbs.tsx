import { ChevronRight, Home } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';

const Breadcrumbs = () => {
  const { boardHistory, currentBoard, theme, popBoardFromHistory } = useCanvasStore();

  const handleBreadcrumbClick = (index: number) => {
    // TODO: Implement zoom-out transition to selected board
    const levelsToGoBack = boardHistory.length - index;
    for (let i = 0; i < levelsToGoBack; i++) {
      popBoardFromHistory();
    }
  };

  const allBoards = [...boardHistory, currentBoard].filter(Boolean);

  if (allBoards.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleBreadcrumbClick(-1)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          theme === 'light'
            ? 'hover:bg-gray-100 text-gray-700'
            : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        <Home size={16} />
      </button>

      {allBoards.map((board, index) => (
        <div key={board!.id} className="flex items-center gap-2">
          <ChevronRight size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />

          <button
            onClick={() => handleBreadcrumbClick(index)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              index === allBoards.length - 1
                ? theme === 'light'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'bg-gray-700 text-white font-medium'
                : theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-gray-700 text-gray-400'
            }`}
          >
            {board!.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
