import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';
import SearchResults from './SearchResults';

const SearchBar = () => {
  const { theme } = useCanvasStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentBoardOnly, setCurrentBoardOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search input */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isOpen ? 'w-96' : 'w-80'
        } ${
          theme === 'light'
            ? 'bg-white border border-gray-200'
            : 'bg-card-dark border border-gray-600'
        }`}
      >
        <Search size={18} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search boards, notes, and files..."
          className={`flex-1 bg-transparent outline-none text-sm ${
            theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
          }`}
        />

        {query && (
          <button
            onClick={handleClear}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <X size={14} />
          </button>
        )}

        <div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
          ⌘K
        </div>
      </div>

      {/* Filter checkbox */}
      {isOpen && (
        <div className={`mt-2 px-4 py-2 rounded-lg ${
          theme === 'light' ? 'bg-white border border-gray-200' : 'bg-card-dark border border-gray-600'
        }`}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentBoardOnly}
              onChange={(e) => setCurrentBoardOnly(e.target.checked)}
              className="rounded"
            />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Current board only
            </span>
          </label>
        </div>
      )}

      {/* Search results */}
      {isOpen && query && (
        <SearchResults
          query={query}
          currentBoardOnly={currentBoardOnly}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
