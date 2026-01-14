import { create } from 'zustand';
import { Board, Item, ToolType } from '@/lib/types';

interface CanvasStore {
  // Current board state
  currentBoard: Board | null;
  items: Item[];

  // Canvas interaction state
  panX: number;
  panY: number;
  zoomLevel: number;

  // UI state
  activeTool: ToolType;
  selectedItemIds: string[];
  isDragging: boolean;

  // Theme
  theme: 'light' | 'dark';

  // Board navigation history for breadcrumbs
  boardHistory: Board[];

  // Sidebar state
  isSidebarOpen: boolean;

  // Actions
  setCurrentBoard: (board: Board | null) => void;
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;

  setPan: (x: number, y: number) => void;
  setZoom: (level: number) => void;

  setActiveTool: (tool: ToolType) => void;
  setSelectedItemIds: (ids: string[]) => void;
  toggleItemSelection: (id: string) => void;
  clearSelection: () => void;

  setIsDragging: (dragging: boolean) => void;

  toggleTheme: () => void;

  pushBoardToHistory: (board: Board) => void;
  popBoardFromHistory: () => void;
  clearBoardHistory: () => void;

  toggleSidebar: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  // Initial state
  currentBoard: null,
  items: [],

  panX: 0,
  panY: 0,
  zoomLevel: 1,

  activeTool: 'select',
  selectedItemIds: [],
  isDragging: false,

  theme: 'light',

  boardHistory: [],

  isSidebarOpen: true,

  // Actions
  setCurrentBoard: (board) => set({ currentBoard: board }),

  setItems: (items) => set({ items }),

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
    selectedItemIds: state.selectedItemIds.filter((selectedId) => selectedId !== id),
  })),

  setPan: (x, y) => set({ panX: x, panY: y }),

  setZoom: (level) => set({ zoomLevel: level }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

  toggleItemSelection: (id) => set((state) => ({
    selectedItemIds: state.selectedItemIds.includes(id)
      ? state.selectedItemIds.filter((selectedId) => selectedId !== id)
      : [...state.selectedItemIds, id],
  })),

  clearSelection: () => set({ selectedItemIds: [] }),

  setIsDragging: (dragging) => set({ isDragging: dragging }),

  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),

  pushBoardToHistory: (board) => set((state) => ({
    boardHistory: [...state.boardHistory, board],
  })),

  popBoardFromHistory: () => set((state) => ({
    boardHistory: state.boardHistory.slice(0, -1),
  })),

  clearBoardHistory: () => set({ boardHistory: [] }),

  toggleSidebar: () => set((state) => ({
    isSidebarOpen: !state.isSidebarOpen,
  })),
}));
