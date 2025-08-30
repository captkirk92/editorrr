import React from 'react';
import * as fabric from 'fabric';
import { useFabric } from '../contexts/FabricContext';
import { removeBackground, createPortrait } from '../services/geminiService';
import { Button } from './ui/button';

interface EditTabProps {
  onLoading: (loading: boolean, message?: string) => void;
}

const EditTab: React.FC<EditTabProps> = ({ onLoading }) => {
  const { canvas, activeObject } = useFabric();
  const originalStateRef = React.useRef<{ [id: string]: string }>({});

  const handleAIAction = async (action: 'removeBg' | 'portrait') => {
    if (!activeObject || activeObject.type !== 'image' || !(activeObject as any)._element) {
      alert('Please select an image first.');
      return;
    }

    const imageObject = activeObject as fabric.Image;
    const objectId = (imageObject as any).id || `image-${Date.now()}`;
    if (!(imageObject as any).id) {
        (imageObject as any).id = objectId;
    }
    
    const response = await fetch(imageObject.getSrc());
    const blob = await response.blob();
    const file = new File([blob], "image.png", { type: blob.type });


    if (!originalStateRef.current[objectId]) {
        originalStateRef.current[objectId] = imageObject.toDataURL({ format: 'png' });
    }

    onLoading(true, action === 'removeBg' ? 'Removing background...' : 'Creating portrait...');

    try {
      const resultDataUrl = action === 'removeBg'
        ? await removeBackground(file)
        : await createPortrait(file);
        
      const newImg = await fabric.Image.fromURL(resultDataUrl, { crossOrigin: 'anonymous' });
      newImg.set({
        left: imageObject.left, top: imageObject.top, angle: imageObject.angle,
        scaleX: imageObject.scaleX, scaleY: imageObject.scaleY,
        originX: 'center', originY: 'center',
        id: objectId
      });
      canvas?.remove(imageObject);
      canvas?.add(newImg);
      canvas?.setActiveObject(newImg);
      canvas?.renderAll();
    } catch (e) {
      console.error("AI model processing failed:", e);
      alert(`An error occurred: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      onLoading(false);
    }
  };

  const handleReset = () => {
    if (!activeObject || !(activeObject as any).id) return;
    const objectId = (activeObject as any).id as string;
    const originalDataUrl = originalStateRef.current[objectId];
    if (originalDataUrl && canvas) {
      fabric.Image.fromURL(originalDataUrl, { crossOrigin: 'anonymous' }).then((originalImg) => {
        if (!activeObject || !canvas) return;
        originalImg.set({
          left: activeObject.left, top: activeObject.top, angle: activeObject.angle,
          scaleX: activeObject.scaleX, scaleY: activeObject.scaleY,
          originX: 'center', originY: 'center',
          id: objectId
        });
        canvas.remove(activeObject);
        canvas.add(originalImg);
        canvas.setActiveObject(originalImg);
        canvas.renderAll();
      });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">AI Tools</h4>
        <div className="space-y-2">
            <Button onClick={() => handleAIAction('removeBg')} className="w-full">Remove Background</Button>
            <Button onClick={() => handleAIAction('portrait')} className="w-full">Create Portrait</Button>
            <Button onClick={handleReset} variant="secondary" className="w-full">Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default EditTab;