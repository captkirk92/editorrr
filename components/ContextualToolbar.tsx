import React, { useEffect, useState, useCallback } from 'react';
import { useFabric } from '../contexts/FabricContext';
import { LockIcon, UnlockIcon } from './Icons';

const ContextualToolbar: React.FC = () => {
    const { canvas, activeObject } = useFabric();
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    const updatePosition = useCallback(() => {
        if (activeObject && canvas) {
            const boundingRect = activeObject.getBoundingRect();
            const absoluteTop = boundingRect.top + (canvas.viewportTransform?.[5] || 0);
            const absoluteLeft = boundingRect.left + boundingRect.width * canvas.getZoom() + (canvas.viewportTransform?.[4] || 0);

            setPosition({ top: absoluteTop, left: absoluteLeft + 10 });
        } else {
            setPosition(null);
        }
    }, [activeObject, canvas]);

    useEffect(() => {
        if (!canvas) return;

        canvas.on('object:moving', updatePosition);
        canvas.on('object:scaling', updatePosition);
        canvas.on('object:rotating', updatePosition);
        canvas.on('mouse:wheel', updatePosition);

        return () => {
            canvas.off('object:moving', updatePosition);
            canvas.off('object:scaling', updatePosition);
            canvas.off('object:rotating', updatePosition);
            canvas.off('mouse:wheel', updatePosition);
        };
    }, [canvas, updatePosition]);

    useEffect(() => {
        updatePosition();
        if (activeObject) {
            setIsLocked(!!(activeObject as any).customLocked);
        }
    }, [activeObject, updatePosition]);

    const toggleLock = () => {
        if (!activeObject) return;

        const currentlyLocked = !(activeObject as any).customLocked;
        (activeObject as any).customLocked = currentlyLocked;

        activeObject.set({
            lockMovementX: currentlyLocked,
            lockMovementY: currentlyLocked,
            lockScalingX: currentlyLocked,
            lockScalingY: currentlyLocked,
            lockRotation: currentlyLocked,
            hasControls: !currentlyLocked,
            hasBorders: !currentlyLocked,
        });

        setIsLocked(currentlyLocked);
        canvas?.renderAll();
    };

    if (!activeObject || !position) {
        return null;
    }

    return (
        <div
            className="absolute bg-muted/50 border border-border rounded-lg shadow-lg p-1 flex flex-col gap-1 z-50"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <button
                onClick={toggleLock}
                title={isLocked ? 'Unlock' : 'Lock'}
                className={`p-1.5 rounded-md transition-colors ${
                    isLocked 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                {isLocked ? <LockIcon className="w-4 h-4" /> : <UnlockIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default ContextualToolbar;
