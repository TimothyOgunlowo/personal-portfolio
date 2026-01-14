import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import Canvas from '@/components/canvas/Canvas';
import BottomToolbar from '@/components/toolbar/BottomToolbar';
import Sidebar from '@/components/toolbar/Sidebar';
import SearchBar from '@/components/search/SearchBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ThemeToggle from '@/components/ui/ThemeToggle';

function App() {
  const theme = useCanvasStore((state) => state.theme);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
