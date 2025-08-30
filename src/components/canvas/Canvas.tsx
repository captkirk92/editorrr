import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFabric } from '../../contexts/FabricContext';
import { CanvasControls } from './CanvasControls';
import { ObjectTransformer } from './ObjectTransformer';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas } = useFabric();
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      if (!containerRef.current) return;
      fabricCanvas.setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
    };
  }, [setCanvas]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-background overflow-hidden"
    >
      <canvas ref={canvasRef} />
      <ObjectTransformer />
      <CanvasControls
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        canvasRef={canvasRef}
      />
    </div>
  );
};