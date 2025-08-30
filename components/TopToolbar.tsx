import React, { useCallback } from 'react';
import { useFabric } from '../contexts/FabricContext';
import { SelectIcon, PanIcon, UndoIcon, RedoIcon, DeleteIcon, ZoomInIcon, ZoomOutIcon } from './Icons';

interface TopToolbarProps {
  tool: 'select' | 'pan';
  setTool: (tool: 'select' | 'pan') => void;
  history: string[];
  historyIndex: number;
  historyLength: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ tool, setTool, history, historyIndex, historyLength, setHistoryIndex }) => {
  const { canvas } = useFabric();

  const handleToolChange = (newTool: 'select' | 'pan') => {
    setTool(newTool);
    if (!canvas) return;

    if (newTool === 'select') {
      canvas.selection = true;
      canvas.forEachObject(o => o.selectable = o.evented = true);
      canvas.defaultCursor = "default";
    } else if (newTool === 'pan') {
      canvas.selection = false;
      canvas.forEachObject(o => o.selectable = o.evented = false);
      canvas.defaultCursor = "grab";
    }
    canvas.renderAll();
  };

  const zoom = (factor: number) => {
    if (!canvas) return;
    const newZoom = canvas.getZoom() * factor;
    if (newZoom >= 0.1 && newZoom <= 10) {
      canvas.setZoom(newZoom);
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const undo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      (canvas as any).loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
    }
  }, [canvas, history, historyIndex, setHistoryIndex]);

  const redo = useCallback(() => {
    if (historyIndex < historyLength - 1 && canvas) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      (canvas as any).loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
    }
  }, [canvas, history, historyIndex, historyLength, setHistoryIndex]);

  const ToolButton = ({
    title,
    onClick,
    Icon,
    isActive = false,
    isDisabled = false,
  }: {
    title: string;
    onClick: () => void;
    Icon: React.FC<{ className?: string }>;
    isActive?: boolean;
    isDisabled?: boolean;
  }) => (
    <button
      title={title}
      onClick={onClick}
      disabled={isDisabled}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="absolute top-5 bg-muted/50 p-2 rounded-xl flex items-center gap-2 shadow-lg border border-border z-10">
      <ToolButton title="Select" onClick={() => handleToolChange('select')} Icon={SelectIcon} isActive={tool === 'select'} />
      <ToolButton title="Pan" onClick={() => handleToolChange('pan')} Icon={PanIcon} isActive={tool === 'pan'} />
      <div className="w-px h-5 bg-border mx-1"></div>
      <ToolButton title="Undo" onClick={undo} Icon={UndoIcon} isDisabled={historyIndex <= 0} />
      <ToolButton title="Redo" onClick={redo} Icon={RedoIcon} isDisabled={historyIndex >= historyLength - 1} />
      <ToolButton title="Delete" onClick={deleteSelected} Icon={DeleteIcon} />
      <div className="w-px h-5 bg-border mx-1"></div>
      <ToolButton title="Zoom In" onClick={() => zoom(1.2)} Icon={ZoomInIcon} />
      <ToolButton title="Zoom Out" onClick={() => zoom(0.8)} Icon={ZoomOutIcon} />
    </div>
  );
};

export default TopToolbar;
