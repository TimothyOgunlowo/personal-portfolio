import { useCanvasStore } from '@/store/canvasStore';

const Minimap = () => {
  const { panX, panY, zoomLevel, theme } = useCanvasStore();

  // Calculate viewport indicator position
  // This is a simplified representation
  const viewportWidth = 100 / zoomLevel;
  const viewportHeight = 60 / zoomLevel;
  const viewportX = 50 - (panX / (window.innerWidth * zoomLevel)) * 50;
  const viewportY = 30 - (panY / (window.innerHeight * zoomLevel)) * 30;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div
        className={`w-40 h-24 rounded-lg border-2 relative ${
          theme === 'light'
            ? 'bg-white border-gray-300'
            : 'bg-card-dark border-gray-600'
        }`}
      >
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-indigo-500 bg-indigo-500/20 rounded"
          style={{
            width: `${Math.min(viewportWidth, 100)}%`,
            height: `${Math.min(viewportHeight, 100)}%`,
            left: `${Math.max(0, Math.min(viewportX, 100 - viewportWidth))}%`,
            top: `${Math.max(0, Math.min(viewportY, 100 - viewportHeight))}%`,
          }}
        />

        {/* Zoom level indicator */}
        <div
          className={`absolute bottom-1 right-1 text-xs font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Minimap;
