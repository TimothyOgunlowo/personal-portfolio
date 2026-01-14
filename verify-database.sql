-- ================================================
-- VERIFY DATABASE SETUP
-- ================================================
-- Run this in Supabase SQL Editor to check your setup
-- ================================================

-- Check if tables exist
SELECT 'Tables exist' as status, count(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('boards', 'items', 'files');

-- Check if Home board exists
SELECT 'Home board check' as status, count(*) as home_board_count
FROM boards
WHERE parent_id IS NULL;

-- Show all boards
SELECT 'All boards:' as info, id, name, icon_color
FROM boards;

-- Check RLS policies
SELECT 'RLS Policies' as status,
       tablename,
       policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Check if RLS is enabled
SELECT 'RLS Status' as info,
       tablename,
       rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('boards', 'items', 'files');
