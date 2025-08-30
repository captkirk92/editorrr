import React, { useState } from 'react';
import * as fabric from 'fabric';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import MainContent from './components/MainContent';
import LoadingOverlay from './components/LoadingOverlay';
import { FabricContext } from './contexts/FabricContext';
import { ProductType } from './types';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>(ProductType.DieCut);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');

  const handleLoading = (loading: boolean, message: string = 'Processing...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  return (
    <FabricContext.Provider value={{ canvas, activeObject, setActiveObject, productType, setProductType }}>
      <main className={cn(
				'relative min-h-screen w-full overflow-hidden',
				'flex items-center justify-center p-4',
			)}>
        {/* Subtle dotted grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.08) 0.8px, transparent 0.8px)',
            backgroundSize: '14px 14px',
            maskImage:
              'radial-gradient( circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70% )',
          }}
        />
        <div className="w-full max-w-[1600px] bg-card/50 border border-border/80 rounded-3xl shadow-2xl flex flex-col font-['Inter'] text-foreground backdrop-blur-xl">
          <div className="flex gap-3 w-full h-[80vh] max-h-[800px] p-4">
            <SidebarLeft />
            <MainContent onCanvasReady={setCanvas} onLoading={handleLoading} />
            <SidebarRight onLoading={handleLoading} />
          </div>
        </div>
        {isLoading && <LoadingOverlay message={loadingMessage} />}
      </main>
    </FabricContext.Provider>
  );
};

export default App;
