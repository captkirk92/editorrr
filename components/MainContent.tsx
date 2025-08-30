import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import TopToolbar from './TopToolbar';
import ContextualToolbar from './ContextualToolbar';
import { useFabric } from '../contexts/FabricContext';
import { ProductType } from '../types';

interface MainContentProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  onLoading: (loading: boolean, message?: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onCanvasReady, onLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { setActiveObject, productType } = useFabric();
  const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<'select' | 'pan'>('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveState = useCallback((canvas: fabric.Canvas) => {
    // FIX: Cast to any to allow passing properties to toJSON, bypassing strict typings.
    const json = JSON.stringify((canvas as any).toJSON(['id', 'customLocked']));
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: undefined,
      preserveObjectStacking: true,
    });
    setCanvasInstance(canvas);
    onCanvasReady(canvas);
    saveState(canvas);

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
    };
  }, [onCanvasReady, saveState]);

  useEffect(() => {
    const canvas = canvasInstance;
    if (!canvas) return;
    
    // @ts-ignore
    const handleSelection = (e: fabric.IEvent) => setActiveObject(e.target || null);
    const handleSelectionCleared = () => setActiveObject(null);
    // @ts-ignore
    const handleModified = (e: fabric.IEvent) => {
        if (e.target && ((e.target as any).id === 'sticker-sheet-template' || (e.target as any).id === 'bumper-sticker-template')) {
          (canvas as any).sendToBack(e.target);
        }
        saveState(canvas);
    };
    
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleModified);
    
    return () => {
        canvas.off('selection:created', handleSelection);
        canvas.off('selection:updated', handleSelection);
        canvas.off('selection:cleared', handleSelectionCleared);
        canvas.off('object:modified', handleModified);
    }
  }, [canvasInstance, setActiveObject, saveState]);

  useEffect(() => {
    if (!canvasInstance) return;

    const templateIds = ['sticker-sheet-template', 'bumper-sticker-template'];
    canvasInstance.getObjects().forEach(obj => {
        if (templateIds.includes((obj as any).id || '')) {
            canvasInstance.remove(obj);
        }
    });

    let template: fabric.Rect | null = null;
    const canvasWidth = canvasInstance.width || 500;
    const canvasHeight = canvasInstance.height || 500;

    switch (productType) {
        case ProductType.StickerSheet:
            const sheetWidth = canvasWidth * 0.9;
            template = new fabric.Rect({
                width: sheetWidth, height: sheetWidth * (9/16),
                fill: 'rgba(255, 255, 255, 0.05)', stroke: 'rgba(255, 255, 255, 0.3)',
                strokeWidth: 1, strokeDashArray: [8, 4],
                selectable: false, evented: false, id: 'sticker-sheet-template',
                left: canvasWidth / 2, top: canvasHeight / 2,
                originX: 'center', originY: 'center',
            });
            break;
        case ProductType.Bumper:
            const bumperWidth = canvasWidth * 0.8;
            template = new fabric.Rect({
                width: bumperWidth, height: bumperWidth / 3.83, rx: 20, ry: 20,
                fill: 'rgba(255, 255, 255, 0.05)', stroke: 'rgba(255, 255, 255, 0.3)',
                strokeWidth: 1, strokeDashArray: [8, 4],
                selectable: false, evented: false, id: 'bumper-sticker-template',
                left: canvasWidth / 2, top: canvasHeight / 2,
                originX: 'center', originY: 'center',
            });
            break;
    }

    if (template) {
        canvasInstance.add(template);
        (canvasInstance as any).sendToBack(template);
    }
    canvasInstance.renderAll();

  }, [productType, canvasInstance]);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(!canvasInstance) return;
    const imageUrl = e.dataTransfer.getData('text/plain');
    if (imageUrl) {
      fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then(img => {
        if (!canvasInstance) return;
        const pointer = canvasInstance.getPointer(e.nativeEvent);
        img.set({
          left: pointer.x, top: pointer.y,
          originX: 'center', originY: 'center',
          scaleX: 0.2, scaleY: 0.2,
        });
        canvasInstance.add(img);
        canvasInstance.renderAll();
        saveState(canvasInstance);
      });
    }
  };

  return (
    <main
      className="flex-grow flex flex-col items-center relative"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <ContextualToolbar />
      <TopToolbar 
        tool={tool} 
        setTool={setTool}
        historyIndex={historyIndex}
        historyLength={history.length}
        history={history}
        setHistoryIndex={setHistoryIndex}
      />
      <div 
        ref={containerRef}
        className="flex-grow w-full h-full relative rounded-2xl overflow-hidden bg-transparent"
      >
        <canvas ref={canvasRef} />
      </div>
      <div className="absolute bottom-5 text-xs text-muted-foreground">
        <span>Ready</span> | Zoom: <span>{Math.round(zoomLevel * 100)}%</span>
      </div>
    </main>
  );
};

export default MainContent;