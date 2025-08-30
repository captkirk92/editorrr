import React from 'react';
import { fabric } from 'fabric';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { useFabric } from '../../contexts/FabricContext';

interface CanvasControlsProps {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoomLevel,
  setZoomLevel,
  canvasRef,
}) => {
  const { canvas } = useFabric();

  const handleZoom = (delta: number) => {
    if (!canvas) return;
    
    const newZoom = Math.min(Math.max(zoomLevel + delta, 0.1), 5);
    setZoomLevel(newZoom);

    canvas.setZoom(newZoom);
    canvas.setDimensions({
      width: canvasRef.current?.parentElement?.clientWidth || 800,
      height: canvasRef.current?.parentElement?.clientHeight || 600,
    });
    canvas.renderAll();
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleZoom(-0.1)}
        className="w-8 h-8 p-0"
      >
        -
      </Button>
      
      <div className="flex items-center gap-2 min-w-[200px]">
        <Slider
          value={[zoomLevel]}
          min={0.1}
          max={5}
          step={0.1}
          onValueChange={([value]) => setZoomLevel(value)}
        />
        <span className="text-xs text-muted-foreground w-12">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleZoom(0.1)}
        className="w-8 h-8 p-0"
      >
        +
      </Button>
    </div>
  );
};
