import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFabric } from '../contexts/FabricContext';
import { ProductType } from '../types';
import { ErrorBoundary } from './ErrorBoundary';

interface TemplateConfig {
    width: number;
    height: number;
    ratio: number;
}

const TEMPLATE_CONFIGS: Record<ProductType, TemplateConfig> = {
    [ProductType.DieCut]: {
        width: 0.9,
        height: 0.9,
        ratio: 1
    },
    [ProductType.Bumper]: {
        width: 0.8,
        height: 0.21,
        ratio: 3.83
    }
};

const MainContent: React.FC = () => {
    const { canvas: canvasInstance, setCanvas, setActiveObject, productType } = useFabric();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            const container = canvasRef.current?.parentElement;
            if (container) {
                const { width, height } = container.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !dimensions.width) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: '#f0f0f0'
        });

        setCanvas(canvas);

        const handleSelection = (e: fabric.IEvent) => {
            const target = e.target as fabric.Object | undefined;
            setActiveObject(target || null);
        };

        canvas.on({
            'selection:created': handleSelection,
            'selection:updated': handleSelection,
            'selection:cleared': () => setActiveObject(null),
            'object:modified': (e: fabric.IEvent) => {
                const target = e.target as fabric.Object;
                if (target?.id?.includes('template')) {
                    canvas.sendToBack(target);
                }
            }
        });

        return () => {
            canvas.dispose();
            setCanvas(null);
        };
    }, [dimensions.width, dimensions.height, setCanvas, setActiveObject]);

    useEffect(() => {
        if (!canvasInstance) return;

        const config = TEMPLATE_CONFIGS[productType];
        const templateWidth = dimensions.width * config.width;
        const templateHeight = templateWidth / config.ratio;

        const template = new fabric.Rect({
            width: templateWidth,
            height: templateHeight,
            rx: 20,
            ry: 20,
            fill: 'rgba(255, 255, 255, 0.05)',
            stroke: 'rgba(255, 255, 255, 0.3)',
            strokeWidth: 1,
            strokeDashArray: [8, 4],
            selectable: false,
            evented: false,
            id: `${productType.toLowerCase()}-template`,
            left: dimensions.width / 2,
            top: dimensions.height / 2,
            originX: 'center',
            originY: 'center',
        });

        canvasInstance.add(template);
        canvasInstance.sendToBack(template);
        canvasInstance.renderAll();

        return () => {
            const existingTemplate = canvasInstance.getObjects().find(obj => 
                (obj as fabric.Object & { id?: string }).id?.includes('template')
            );
            if (existingTemplate) {
                canvasInstance.remove(existingTemplate);
                canvasInstance.renderAll();
            }
        };
    }, [productType, canvasInstance, dimensions]);

    return (
        <ErrorBoundary>
            <main className="flex-grow flex flex-col items-center relative">
                <canvas ref={canvasRef} />
            </main>
        </ErrorBoundary>
    );
};

export default MainContent;
