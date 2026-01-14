import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { SearchResult } from '@/lib/types';

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, currentBoardOnly: boolean, currentBoardId?: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      let queryBuilder = supabase.from('items').select('*');

      if (currentBoardOnly && currentBoardId) {
        queryBuilder = queryBuilder.eq('board_id', currentBoardId);
      }

      // Search in content fields
      queryBuilder = queryBuilder.or(
        `content->text.ilike.%${query}%,content->title.ilike.%${query}%,content->body.ilike.%${query}%`
      );

      const { data, error } = await queryBuilder;

      if (error) throw error;

      // TODO: Implement board path fetching for breadcrumbs
      const searchResults: SearchResult[] = (data || []).map(item => ({
        item,
        board_path: [],
        board_names: [],
      }));

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    loading,
    search,
    clearResults,
  };
};

// V2: This will be enhanced with AI-powered semantic search
// using embeddings stored in the content JSONB field
