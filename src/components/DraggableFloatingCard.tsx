import React, { useState, useRef, useEffect } from "react";
import { Move, X, Minimize2, Maximize2, GripVertical, Sparkles } from "lucide-react";

interface DraggableFloatingCardProps {
  title: string;
  icon?: React.ElementType;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  widthClass?: string;
  badge?: string;
  zIndex?: number;
  onBringToFront?: () => void;
}

export const DraggableFloatingCard: React.FC<DraggableFloatingCardProps> = ({
  title,
  icon: Icon = Sparkles,
  isOpen,
  onClose,
  children,
  initialX = 40,
  initialY = 100,
  widthClass = "w-88 sm:w-96",
  badge,
  zIndex = 60,
  onBringToFront,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: initialX,
    initY: initialY,
  });

  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBringToFront) onBringToFront();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;
      // Clamp within viewport
      const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.initX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, dragStartRef.current.initY + deltaY));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      data-floating-card="true"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onBringToFront) onBringToFront();
      }}
      className={`fixed ${widthClass} rounded-2xl bg-zinc-950/98 border border-purple-500/70 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-zinc-100 transition-shadow ${
        isDragging ? "shadow-purple-500/30 ring-2 ring-purple-500" : ""
      } select-none animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* Header Handle bar (Click & Drag) */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="px-3.5 py-2.5 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-purple-950/40 rounded-t-2xl border-b border-zinc-800/80 flex items-center justify-between cursor-move"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <GripVertical className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs truncate text-white">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded-md bg-purple-950 text-purple-300 font-mono text-[9px] border border-purple-800 shrink-0 font-semibold">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={isMinimized ? "Expandir Painel" : "Minimizar Painel"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-red-950 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
            title="Fechar Painel de Edição"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      {!isMinimized && (
        <div className="p-4 max-h-[75vh] overflow-y-auto space-y-4 select-text">
          {children}
        </div>
      )}
    </div>
  );
};
