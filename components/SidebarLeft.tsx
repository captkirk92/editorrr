import React, { useState } from 'react';
import { useFabric } from '../contexts/FabricContext';
import { ProductType } from '../types';

type Shape = 'contour-cut' | 'square' | 'circle' | 'rounded-corners';
type Material = 'vinyl' | 'holographic' | 'transparent' | 'glitter' | 'mirror' | 'pixie';

const SidebarLeft: React.FC = () => {
  const { productType, setProductType } = useFabric();
  const [selectedShape, setSelectedShape] = useState<Shape>('contour-cut');
  const [selectedMaterial, setSelectedMaterial] = useState<Material>('vinyl');
  const [selectedSize, setSelectedSize] = useState('3x3');
  const [selectedQuantity, setSelectedQuantity] = useState('100');

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductType(e.target.value as ProductType);
  };
  
  const CustomizerSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h3>
        {children}
    </div>
  );

  return (
    <aside className="w-[240px] bg-muted/50 rounded-2xl p-3 flex flex-col z-10 border border-border">
      <header className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-[22px] h-[22px] bg-foreground rounded-md" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
          <h1 className="text-sm font-semibold">Sticker Editor</h1>
        </div>
        <p className="text-xs text-muted-foreground">Create Your Own Stickers</p>
      </header>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <CustomizerSection title="Product">
            <select
              value={productType}
              onChange={handleProductChange}
              className="w-full p-2.5 rounded-lg text-foreground bg-background border border-border outline-none transition text-sm cursor-pointer focus:ring-2 focus:ring-ring"
            >
              <option value={ProductType.DieCut}>Die Cut Stickers</option>
              <option value={ProductType.StickerSheet}>Sticker Sheets</option>
              <option value={ProductType.Bumper}>Bumper Stickers</option>
              <option value={ProductType.Decal}>Text Decals</option>
            </select>
        </CustomizerSection>

        {[ProductType.DieCut, ProductType.Bumper, ProductType.Decal].includes(productType) && (
            <>
                <CustomizerSection title="Shape">
                    <div className="flex flex-col gap-2">
                        {(['contour-cut', 'square', 'circle', 'rounded-corners'] as Shape[]).map(shape => (
                            <button key={shape} onClick={() => setSelectedShape(shape)} className={`flex items-center p-2.5 border border-border rounded-lg cursor-pointer transition-all text-left ${selectedShape === shape ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}>
                                <span className="text-sm capitalize">{shape.replace('-', ' ')}</span>
                            </button>
                        ))}
                    </div>
                </CustomizerSection>

                <CustomizerSection title="Material">
                     <div className="grid grid-cols-3 gap-2.5">
                        {(['vinyl', 'holographic', 'transparent', 'glitter', 'mirror', 'pixie'] as Material[]).map(material => {
                            const materialClasses: {[key: string]: string} = {
                                vinyl: 'bg-gradient-to-br from-gray-200 to-gray-400',
                                holographic: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500',
                                transparent: "bg-[linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)] bg-[length:8px_8px] bg-[#111]",
                                glitter: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400',
                                mirror: 'bg-gradient-to-br from-gray-300 to-gray-500',
                                pixie: 'bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-300',
                            };
                            return (
                                <button key={material} onClick={() => setSelectedMaterial(material)} className={`flex flex-col items-center p-3 border border-border rounded-lg cursor-pointer transition-all text-center ${selectedMaterial === material ? 'bg-primary' : 'bg-secondary hover:bg-accent'}`}>
                                    <div className={`w-9 h-9 rounded-full mb-2 border border-white/10 ${materialClasses[material]}`}></div>
                                    <span className={`text-xs font-medium capitalize ${selectedMaterial === material ? 'text-primary-foreground' : 'text-foreground'}`}>{material === 'pixie' ? 'Pixie Dust' : material}</span>
                                </button>
                            )
                        })}
                    </div>
                    <h4 className="text-sm font-semibold text-muted-foreground mt-4 mb-2">Finish</h4>
                    <select className="w-full p-2.5 rounded-lg text-foreground bg-background border border-border outline-none transition text-sm cursor-pointer focus:ring-2 focus:ring-ring">
                        <option>Glossy</option>
                        <option>Matte</option>
                        <option>Satin</option>
                    </select>
                </CustomizerSection>
                
                <CustomizerSection title="Size, inch (W×H)">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            {(['2x2', '3x3', '4x4', '5x5']).map(size => (
                                <tr key={size} onClick={() => setSelectedSize(size)} className={`cursor-pointer ${selectedSize === size ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-accent'}`}>
                                    <td className="p-2.5 border-b border-border">{size.replace('x', '" × ')}"</td>
                                </tr>
                            ))}
                             <tr className="text-muted-foreground italic"><td className="p-2.5 border-b border-border">Custom size</td></tr>
                        </tbody>
                    </table>
                </CustomizerSection>

                <CustomizerSection title="Quantity">
                     <table className="w-full border-collapse text-sm">
                        <tbody>
                            {([ {q:'55', p:'26', d:''}, {q:'100', p:'47', d:''}, {q:'200', p:'64', d:'-32%'}, {q:'500', p:'114', d:'-52%'} ]).map(item => (
                                <tr key={item.q} onClick={() => setSelectedQuantity(item.q)} className={`cursor-pointer ${selectedQuantity === item.q ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                                    <td className="p-2.5 border-b border-border">{item.q} pcs</td>
                                    <td className={`p-2.5 border-b border-border font-semibold ${selectedQuantity === item.q ? 'text-primary-foreground' : 'text-foreground'}`}>${item.p}</td>
                                    <td className={`p-2.5 border-b border-border font-semibold ${selectedQuantity === item.q ? 'text-primary-foreground' : 'text-green-400'}`}>{item.d}</td>
                                </tr>
                            ))}
                            <tr className="text-muted-foreground italic"><td colSpan={3} className="p-2.5 border-b border-border">Custom quantity</td></tr>
                        </tbody>
                    </table>
                </CustomizerSection>
            </>
        )}
      </div>
    </aside>
  );
};

export default SidebarLeft;
