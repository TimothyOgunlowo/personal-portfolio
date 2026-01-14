import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useSupabase } from '@/hooks/useSupabase';
import Canvas from '@/components/canvas/Canvas';
import BottomToolbar from '@/components/toolbar/BottomToolbar';
import Sidebar from '@/components/toolbar/Sidebar';
import SearchBar from '@/components/search/SearchBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ThemeToggle from '@/components/ui/ThemeToggle';
import DocumentEditor from '@/components/editor/DocumentEditor';
import StickyNoteEditor from '@/components/editor/StickyNoteEditor';

console.log('🚀 App.tsx module loaded!');

function App() {
  console.log('🏗️ App component is rendering...');

  const theme = useCanvasStore((state) => state.theme);
  const editingItemId = useCanvasStore((state) => state.editingItemId);
  const editorType = useCanvasStore((state) => state.editorType);
  const items = useCanvasStore((state) => state.items);
  const closeEditor = useCanvasStore((state) => state.closeEditor);
  const { loading } = useSupabase(); // Initialize Supabase and load home board

  console.log('📊 App state:', { theme, loading, itemCount: items.length });

  const editingItem = items.find((item) => item.id === editingItemId) || null;

  // Apply theme to document
  useEffect(() => {
    console.log('🎨 Theme effect running:', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Show loading screen while initializing
  if (loading) {
    console.log('⏳ Showing loading screen...');
    return (
      <div className={`w-screen h-screen flex items-center justify-center ${theme === 'light' ? 'bg-canvas-light' : 'bg-canvas-dark'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading workspace...</p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering main app UI...');

  return (
    <div className={`w-screen h-screen overflow-hidden ${theme === 'light' ? 'bg-canvas-light' : 'bg-canvas-dark'}`}>
      {/* Top bar with breadcrumbs, search, and theme toggle */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <Breadcrumbs />
        <SearchBar />
        <ThemeToggle />
      </div>

      {/* Left sidebar */}
      <Sidebar />

      {/* Main canvas */}
      <Canvas />

      {/* Bottom toolbar */}
      <BottomToolbar />

      {/* Editors */}
      <DocumentEditor
        item={editingItem}
        isOpen={editorType === 'document'}
        onClose={closeEditor}
      />
      <StickyNoteEditor
        item={editingItem}
        isOpen={editorType === 'sticky'}
        onClose={closeEditor}
      />
    </div>
  );
}

export default App;
