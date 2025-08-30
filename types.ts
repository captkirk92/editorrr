import type React from 'react';
import * as fabric from 'fabric';

export enum ProductType {
  DieCut = 'die-cut',
  StickerSheet = 'sticker-sheet',
  Bumper = 'bumper',
  Decal = 'decal'
}

export type FabricCanvasContextType = {
  canvas: fabric.Canvas | null;
  activeObject: fabric.Object | null;
  setActiveObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>;
  productType: ProductType;
  setProductType: React.Dispatch<React.SetStateAction<ProductType>>;
};

export interface IconProps {
  className?: string;
}