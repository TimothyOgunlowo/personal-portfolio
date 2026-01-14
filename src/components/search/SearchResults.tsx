import { useEffect, useState } from 'react';
import { FileText, StickyNote as StickyNoteIcon, Folder, FileEdit, Image as ImageIcon, File } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';
import { supabase } from '@/lib/supabase';
import { SearchResult } from '@/lib/types';

interface SearchResultsProps {
  query: string;
  currentBoardOnly: boolean;
  onClose: () => void;
}

const SearchResults = ({ query, currentBoardOnly, onClose }: SearchResultsProps) => {
  const { theme, currentBoard } = useCanvasStore();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchItems = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        let queryBuilder = supabase
          .from('items')
          .select('*');

        if (currentBoardOnly && currentBoard) {
          queryBuilder = queryBuilder.eq('board_id', currentBoard.id);
        }

        // Search in content
        queryBuilder = queryBuilder.or(
          `content->text.ilike.%${query}%,content->title.ilike.%${query}%,content->body.ilike.%${query}%`
        );

        const { data, error } = await queryBuilder;

        if (error) throw error;

        // TODO: Fetch board paths for each result
        const searchResults: SearchResult[] = (data || []).map(item => ({
          item,
          board_path: [], // TODO: Implement breadcrumb path
          board_names: [], // TODO: Implement board names
        }));

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchItems, 300);
    return () => clearTimeout(debounce);
  }, [query, currentBoardOnly, currentBoard]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sticky':
        return <StickyNoteIcon size={16} />;
      case 'text_card':
        return <FileText size={16} />;
      case 'board_link':
        return <Folder size={16} />;
      case 'document':
        return <FileEdit size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
      case 'file':
        return <File size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to board and highlight item
    console.log('Navigate to:', result);
    onClose();
  };

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg max-h-96 overflow-y-auto custom-scrollbar ${
        theme === 'light'
          ? 'bg-white border border-gray-200'
          : 'bg-card-dark border border-gray-600'
      }`}
    >
      {loading && (
        <div className={`p-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          Searching...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className={`p-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          No results found
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="py-2">
          {results.map((result) => (
            <button
              key={result.item.id}
              onClick={() => handleResultClick(result)}
              className={`w-full px-4 py-3 flex items-start gap-3 transition-colors ${
                theme === 'light'
                  ? 'hover:bg-gray-50 text-gray-700'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <div className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'}>
                {getIcon(result.item.type)}
              </div>

              <div className="flex-1 text-left">
                <div className="font-medium text-sm">
                  {result.item.content.title || result.item.content.text || 'Untitled'}
                </div>
                {result.board_names.length > 0 && (
                  <div className={`text-xs mt-1 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {result.board_names.join(' / ')}
                  </div>
                )}
              </div>

              <div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                {result.item.type}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* V2 note */}
      {query && (
        <div className={`px-4 py-2 border-t text-xs ${
          theme === 'light'
            ? 'text-gray-400 border-gray-200'
            : 'text-gray-500 border-gray-700'
        }`}>
          {/* V2: AI-powered semantic search will be available here */}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
