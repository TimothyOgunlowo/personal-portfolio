import { Sun, Moon } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useCanvasStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'light'
          ? 'hover:bg-gray-100 text-gray-700'
          : 'hover:bg-gray-700 text-gray-300'
      }`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
