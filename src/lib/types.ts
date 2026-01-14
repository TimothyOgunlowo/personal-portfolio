// Database types
export interface Board {
  id: string;
  parent_id: string | null;
  name: string;
  icon_color: string;
  canvas_state: CanvasState;
  created_at: string;
  updated_at: string;
}

export interface CanvasState {
  pan_x: number;
  pan_y: number;
  zoom_level: number;
}

export type ItemType = 'sticky' | 'text_card' | 'document' | 'image' | 'file' | 'board_link';

export interface Item {
  id: string;
  board_id: string;
  type: ItemType;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  content: ItemContent;
  z_index: number;
  created_at: string;
  updated_at: string;
}

export interface ItemContent {
  // For sticky notes
  text?: string;
  color?: string;

  // For text cards
  title?: string;
  body?: string;

  // For documents
  html?: string;

  // For images
  image_url?: string;
  alt_text?: string;

  // For files
  file_id?: string;

  // For board links
  linked_board_id?: string;
  item_count?: number;
}

export interface FileRecord {
  id: string;
  item_id: string;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

// UI State types
export type ToolType = 'select' | 'board' | 'sticky' | 'text_card' | 'document' | 'image' | 'file';

export interface SearchResult {
  item: Item;
  board_path: string[];
  board_names: string[];
}

export interface BoardHierarchyNode {
  board: Board;
  children: BoardHierarchyNode[];
  item_count: number;
}

// V2 features (out of scope for V1)
// - AI/Gemini integration will use content.ai_metadata
// - Semantic search will use content.embeddings
// - Mind-node network will use content.connections
// - Real-time collaboration will use Supabase Realtime
// - Drawing/freehand will use content.drawing_data
