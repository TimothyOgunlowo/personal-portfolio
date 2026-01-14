import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCanvasStore } from '@/store/canvasStore';
import { Board, Item } from '@/lib/types';

export const useSupabase = () => {
  const { setCurrentBoard, setItems, currentBoard } = useCanvasStore();
  const [loading, setLoading] = useState(true);

  // Initialize: Load home board
  useEffect(() => {
    loadHomeBoard();
  }, []);

  // Load items when current board changes
  useEffect(() => {
    if (currentBoard) {
      loadBoardItems(currentBoard.id);
    }
  }, [currentBoard?.id]);

  const loadHomeBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .is('parent_id', null)
        .single();

      if (error) {
        // If no home board exists, create one
        if (error.code === 'PGRST116') {
          await createHomeBoard();
          return;
        }
        throw error;
      }

      setCurrentBoard(data);
    } catch (error) {
      console.error('Error loading home board:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHomeBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          name: 'Home',
          icon_color: '#6366F1',
          canvas_state: { pan_x: 0, pan_y: 0, zoom_level: 1 },
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentBoard(data);
    } catch (error) {
      console.error('Error creating home board:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoardItems = async (boardId: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('board_id', boardId)
        .order('z_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading board items:', error);
      setItems([]);
    }
  };

  const createBoard = async (name: string, parentId: string | null, iconColor: string = '#6366F1'): Promise<Board | null> => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          name,
          parent_id: parentId,
          icon_color: iconColor,
          canvas_state: { pan_x: 0, pan_y: 0, zoom_level: 1 },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating board:', error);
      return null;
    }
  };

  const createItem = async (item: Partial<Item>): Promise<Item | null> => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  };

  const navigateToBoard = async (boardId: string) => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (error) throw error;
      setCurrentBoard(data);
    } catch (error) {
      console.error('Error navigating to board:', error);
    }
  };

  return {
    loading,
    createBoard,
    createItem,
    navigateToBoard,
    loadBoardItems,
  };
};
