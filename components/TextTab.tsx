import React, { useState, useEffect } from 'react';
import * as fabric from 'fabric';
import { useFabric } from '../contexts/FabricContext';
import { Button } from './ui/button';

const TextTab: React.FC = () => {
  const { canvas, activeObject } = useFabric();
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(40);
  const [color, setColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  useEffect(() => {
    if (activeObject && activeObject.type?.includes('text')) {
      const textObject = activeObject as fabric.Textbox;
      setText(textObject.text || '');
      setFontFamily(textObject.fontFamily || 'Arial');
      setFontSize(textObject.fontSize || 40);
      setColor(textObject.fill?.toString() || '#ffffff');
      setIsBold(textObject.fontWeight === 'bold');
      setIsItalic(textObject.fontStyle === 'italic');
      setIsUnderline(textObject.underline || false);
      setTextAlign(textObject.textAlign as 'left' | 'center' | 'right' || 'left');
    }
  }, [activeObject]);

  const updateProperty = <T,>(prop: keyof fabric.Textbox, value: T) => {
    if (activeObject && activeObject.type?.includes('text')) {
      activeObject.set(prop, value);
      canvas?.requestRenderAll();
    }
  };

  const handleAddText = () => {
    if (!canvas || !text.trim()) return;
    const textObj = new fabric.Textbox(text, {
      left: (canvas.width || 0) / 2,
      top: (canvas.height || 0) / 2,
      width: 250,
      fontSize: 40,
      fontFamily: 'Arial',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });
    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    setText('');
  };
  
  const ControlGroup: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
        {children}
    </div>
  );
  
  const StyleButton: React.FC<{onClick: () => void, isActive: boolean, children: React.ReactNode}> = ({onClick, isActive, children}) => (
     <button onClick={onClick} className={`px-3 py-1.5 border border-border rounded-md text-xs transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}>
        {children}
     </button>
  );

  const fonts = ['Arial', 'Roboto', 'Lato', 'Montserrat', 'Oswald', 'Lobster', 'Pacifico', 'Caveat'];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">Add Text</h4>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (activeObject?.type?.includes('text')) updateProperty('text', e.target.value);
          }}
          placeholder="Enter your text..."
          rows={2}
          className="w-full p-2 border border-input rounded-lg bg-background text-foreground text-sm focus:ring-1 focus:ring-ring focus:outline-none"
        />
        <Button onClick={handleAddText} className="w-full mt-2">
          Add Text
        </Button>
      </div>

      <div className="space-y-3">
        <ControlGroup label="Font Family">
          <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); updateProperty('fontFamily', e.target.value); }} className="w-full p-2 border border-input rounded-lg bg-background text-foreground text-sm focus:ring-1 focus:ring-ring focus:outline-none">
            {fonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
          </select>
        </ControlGroup>

        <ControlGroup label="Font Size">
          <div className="flex items-center gap-2">
            <input type="range" min="8" max="150" value={fontSize} onChange={(e) => { const val = parseInt(e.target.value); setFontSize(val); updateProperty('fontSize', val); }} className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
            <span className="text-xs text-foreground min-w-[35px] text-right">{fontSize}px</span>
          </div>
        </ControlGroup>

        <ControlGroup label="Text Color">
            <input type="color" value={color} onChange={(e) => { setColor(e.target.value); updateProperty('fill', e.target.value); }} className="w-9 h-9 p-0 border-none rounded-lg cursor-pointer bg-transparent appearance-none" style={{'--color': color} as any}/>
        </ControlGroup>

        <div className="flex gap-4">
            <ControlGroup label="Style">
                <div className="flex gap-1.5">
                    <StyleButton isActive={isBold} onClick={() => { const newBold = !isBold; setIsBold(newBold); updateProperty('fontWeight', newBold ? 'bold' : 'normal'); }}>B</StyleButton>
                    <StyleButton isActive={isItalic} onClick={() => { const newItalic = !isItalic; setIsItalic(newItalic); updateProperty('fontStyle', newItalic ? 'italic' : 'normal'); }}>I</StyleButton>
                    <StyleButton isActive={isUnderline} onClick={() => { const newUnderline = !isUnderline; setIsUnderline(newUnderline); updateProperty('underline', newUnderline); }}>U</StyleButton>
                </div>
            </ControlGroup>
            <ControlGroup label="Alignment">
                <div className="flex gap-1.5">
                    <StyleButton isActive={textAlign === 'left'} onClick={() => { setTextAlign('left'); updateProperty('textAlign', 'left'); }}>L</StyleButton>
                    <StyleButton isActive={textAlign === 'center'} onClick={() => { setTextAlign('center'); updateProperty('textAlign', 'center'); }}>C</StyleButton>
                    <StyleButton isActive={textAlign === 'right'} onClick={() => { setTextAlign('right'); updateProperty('textAlign', 'right'); }}>R</StyleButton>
                </div>
            </ControlGroup>
        </div>
      </div>
    </div>
  );
};

export default TextTab;