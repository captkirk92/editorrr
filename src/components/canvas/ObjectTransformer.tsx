import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useFabric } from '../../contexts/FabricContext';

interface ObjectTransformerProps {
  onTransform?: (object: fabric.Object) => void;
}

export const ObjectTransformer: React.FC<ObjectTransformerProps> = ({
  onTransform,
}) => {
  const { canvas, activeObject } = useFabric();

  useEffect(() => {
    if (!canvas) return;

    const handleModified = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;

      // Enforce minimum size
      const minSize = 20;
      if (target.scaleX! * target.width! < minSize) {
        target.scaleX = minSize / target.width!;
      }
      if (target.scaleY! * target.height! < minSize) {
        target.scaleY = minSize / target.height!;
      }

      canvas.renderAll();
      onTransform?.(target);
    };

    const handleScaling = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;

      // Maintain aspect ratio for images
      if (target instanceof fabric.Image && e.transform?.action === 'scale') {
        if (target.scaleX !== target.scaleY) {
          const maxScale = Math.max(target.scaleX!, target.scaleY!);
          target.scale(maxScale);
        }
      }
    };

    canvas.on({
      'object:modified': handleModified,
      'object:scaling': handleScaling,
    });

    return () => {
      canvas.off({
        'object:modified': handleModified,
        'object:scaling': handleScaling,
      });
    };
  }, [canvas, onTransform]);

  return null;
};
