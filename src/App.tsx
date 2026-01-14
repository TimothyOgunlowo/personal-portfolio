import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useSupabase } from '@/hooks/useSupabase';
import Canvas from '@/components/canvas/Canvas';
import BottomToolbar from '@/components/toolbar/BottomToolbar';
import Sidebar from '@/components/toolbar/Sidebar';
import SearchBar from '@/components/search/SearchBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ThemeToggle from '@/components/ui/ThemeToggle';

function App() {
  const theme = useCanvasStore((state) => state.theme);
  const { loading } = useSupabase(); // Initialize Supabase and load home board

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Show loading screen while initializing
  if (loading) {
    return (
      <div className={`w-screen h-screen flex items-center justify-center ${theme === 'light' ? 'bg-canvas-light' : 'bg-canvas-dark'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading workspace...</p>
        </div>
      </div>
    );
  }

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
    </div>
  );
}

export default App;
