-- ================================================
-- INFINITE CANVAS WORKSPACE - DATABASE SETUP
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- (Supabase Dashboard > SQL Editor > New Query)
-- ================================================

-- 1. Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon_color TEXT NOT NULL DEFAULT '#6366F1',
  canvas_state JSONB NOT NULL DEFAULT '{"pan_x": 0, "pan_y": 0, "zoom_level": 1}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create items table
CREATE TABLE IF NOT EXISTS items (
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

-- 3. Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_boards_parent_id ON boards(parent_id);
CREATE INDEX IF NOT EXISTS idx_items_board_id ON items(board_id);
CREATE INDEX IF NOT EXISTS idx_files_item_id ON files(item_id);

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Add triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_boards_updated_at ON boards;
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies (single-user V1 - allow all operations)
DROP POLICY IF EXISTS "Enable all operations for boards" ON boards;
CREATE POLICY "Enable all operations for boards" ON boards
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all operations for items" ON items;
CREATE POLICY "Enable all operations for items" ON items
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all operations for files" ON files;
CREATE POLICY "Enable all operations for files" ON files
  FOR ALL USING (true);

-- 9. Create initial Home board
INSERT INTO boards (name, icon_color, canvas_state)
VALUES ('Home', '#6366F1', '{"pan_x": 0, "pan_y": 0, "zoom_level": 1}')
ON CONFLICT DO NOTHING;

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next steps:
-- 1. Go to Storage > Create a new bucket called "uploads"
-- 2. Set the bucket to public if you want images visible without auth
-- 3. Refresh your application
-- ================================================
