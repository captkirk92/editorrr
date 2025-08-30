import React, { useRef, useState } from 'react';
import { UploadIcon } from './Icons';
import { useFabric } from '../contexts/FabricContext';

const UploadTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { canvas } = useFabric();
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0 || !canvas) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        setLibraryImages(prev => [...prev, imageUrl]);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, imageUrl: string) => {
    e.dataTransfer.setData('text/plain', imageUrl);
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">Upload Image</h4>
        <div 
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-primary bg-background/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="mx-auto text-primary mb-2" />
          <p className="text-sm font-semibold text-foreground mb-1">Drag & drop or click to upload</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 10MB</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">Your Image Library</h4>
        <div className="grid grid-cols-2 gap-2 min-h-[100px]">
          {libraryImages.map((src, index) => (
            <div 
              key={index} 
              className="p-2 border border-border rounded-lg cursor-grab transition-all bg-background/50 hover:border-primary hover:bg-accent"
              draggable
              onDragStart={(e) => handleDragStart(e, src)}
            >
              <img src={src} alt={`User upload ${index + 1}`} className="w-full h-20 rounded-md object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadTab;