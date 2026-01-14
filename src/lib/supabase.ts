import { createClient } from '@supabase/supabase-js';

// These should be environment variables in production
// For now, using placeholders - user will need to configure
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema SQL for reference:
/*
-- Create boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon_color TEXT NOT NULL DEFAULT '#6366F1',
  canvas_state JSONB NOT NULL DEFAULT '{"pan_x": 0, "pan_y": 0, "zoom_level": 1}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sticky', 'text_card', 'document', 'image', 'file', 'board_link')),
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  z_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_boards_parent_id ON boards(parent_id);
CREATE INDEX idx_items_board_id ON items(board_id);
CREATE INDEX idx_files_item_id ON files(item_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket
-- Run in Supabase Storage dashboard:
-- Bucket name: uploads
-- Public: true (or false if you want authenticated access only)

-- Create RLS policies (enable Row Level Security in Supabase dashboard)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- For single-user V1, allow all operations
CREATE POLICY "Enable all operations for boards" ON boards FOR ALL USING (true);
CREATE POLICY "Enable all operations for items" ON items FOR ALL USING (true);
CREATE POLICY "Enable all operations for files" ON files FOR ALL USING (true);

-- Create home board (run once after setup)
INSERT INTO boards (name, icon_color, canvas_state)
VALUES ('Home', '#6366F1', '{"pan_x": 0, "pan_y": 0, "zoom_level": 1}');
*/
