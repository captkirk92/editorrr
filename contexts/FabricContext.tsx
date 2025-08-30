import { createContext, useContext } from 'react';
import type { FabricCanvasContextType } from '../types';
import { ProductType } from '../types';

export const FabricContext = createContext<FabricCanvasContextType>({
  canvas: null,
  activeObject: null,
  setActiveObject: () => {},
  productType: ProductType.DieCut,
  setProductType: () => {},
});

export const useFabric = (): FabricCanvasContextType => useContext(FabricContext);
