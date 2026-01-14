-- ================================================
-- FIX DATABASE SETUP (for existing tables)
-- ================================================
-- Run this if tables already exist but app still doesn't work
-- ================================================

-- 1. Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Add triggers (drop first to avoid conflicts)
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

-- 3. Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Enable all operations for boards" ON boards;
CREATE POLICY "Enable all operations for boards" ON boards
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for items" ON items;
CREATE POLICY "Enable all operations for items" ON items
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for files" ON files;
CREATE POLICY "Enable all operations for files" ON files
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Create Home board if it doesn't exist
INSERT INTO boards (name, icon_color, canvas_state)
SELECT 'Home', '#6366F1', '{"pan_x": 0, "pan_y": 0, "zoom_level": 1}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM boards WHERE parent_id IS NULL
);

-- 6. Show confirmation
SELECT 'Setup complete!' as status,
       (SELECT count(*) FROM boards WHERE parent_id IS NULL) as home_boards,
       (SELECT count(*) FROM boards) as total_boards,
       (SELECT count(*) FROM items) as total_items;
