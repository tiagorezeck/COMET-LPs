import React, { useState, useRef, useEffect } from "react";
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, GripHorizontal } from "lucide-react";
import { ElementOffset } from "../types/landingPage";

interface DraggableElementProps {
  elementId: string;
  children: React.ReactNode;
  offset?: ElementOffset;
  onOffsetChange?: (offset: ElementOffset) => void;
  isEditorPreview?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  showHandleOnHover?: boolean;
  inline?: boolean;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  elementId,
  children,
  offset = { x: 0, y: 0 },
  onOffsetChange,
  isEditorPreview = false,
  className = "",
  style,
  label,
  showHandleOnHover = true,
  inline = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startDragRef = useRef<{ startX: number; startY: number; initialOffsetX: number; initialOffsetY: number }>({
    startX: 0,
    startY: 0,
    initialOffsetX: 0,
    initialOffsetY: 0,
  });

  const currentX = offset?.x ?? 0;
  const currentY = offset?.y ?? 0;

  const handleStartDrag = (e: React.MouseEvent) => {
    if (!isEditorPreview) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    startDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialOffsetX: currentX,
      initialOffsetY: currentY,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startDragRef.current.startX;
      const deltaY = e.clientY - startDragRef.current.startY;

      const newX = Math.round(startDragRef.current.initialOffsetX + deltaX);
      const newY = Math.round(startDragRef.current.initialOffsetY + deltaY);

      // Clamp movement within sane bounds (-500px to +500px)
      const clampedX = Math.max(-500, Math.min(500, newX));
      const clampedY = Math.max(-500, Math.min(500, newY));

      if (onOffsetChange) {
        onOffsetChange({ x: clampedX, y: clampedY });
      }
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
  }, [isDragging, onOffsetChange]);

  const handleNudge = (dx: number, dy: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOffsetChange) {
      onOffsetChange({
        x: Math.max(-500, Math.min(500, currentX + dx)),
        y: Math.max(-500, Math.min(500, currentY + dy)),
      });
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOffsetChange) {
      onOffsetChange({ x: 0, y: 0 });
    }
  };

  if (!isEditorPreview) {
    const hasOffset = currentX !== 0 || currentY !== 0;
    return (
      <div
        className={`${inline ? "inline-block" : "w-full"} ${className}`}
        style={{
          ...style,
          transform: hasOffset ? `translate(${currentX}px, ${currentY}px)` : style?.transform,
        }}
      >
        {children}
      </div>
    );
  }

  const hasOffset = currentX !== 0 || currentY !== 0;

  return (
    <div
      className={`relative group/movable transition-transform ${inline ? "inline-block" : "w-full"} ${className} ${
        isHovered ? "outline-1 outline-dashed outline-indigo-500/40 rounded-xl" : ""
      }`}
      style={{
        ...style,
        transform: hasOffset ? `translate(${currentX}px, ${currentY}px)` : style?.transform,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isDragging && setIsHovered(false)}
    >
      {children}

      {/* Drag & Alignment Toolbar on Hover or while dragging - Positioned at the BOTTOM to avoid covering edit cards */}
      {(isHovered || isDragging) && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1 rounded-xl bg-zinc-950/98 border border-indigo-500/80 shadow-2xl backdrop-blur-xl text-xs font-semibold text-white pointer-events-auto animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle Button */}
          <div
            onMouseDown={handleStartDrag}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-move select-none shadow-md transition-colors"
            title="Clique e arraste em qualquer direção (cima, baixo, lados) para mover e alinhar este elemento"
          >
            <Move className="w-3 h-3 text-cyan-300" />
            <span className="text-[10px]">{label || "Mover"}</span>
          </div>

          {/* Coordinate Badge */}
          {hasOffset && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 font-mono text-[9px] text-cyan-300 border border-zinc-800">
              X:{currentX > 0 ? `+${currentX}` : currentX} Y:{currentY > 0 ? `+${currentY}` : currentY}
            </span>
          )}

          {/* Precision Nudge Buttons (⬅ ⬆ ⬇ ➡) */}
          <div className="flex items-center gap-0.5 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
            <button
              type="button"
              onClick={(e) => handleNudge(-10, 0, e)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title="Mover 10px para a Esquerda"
            >
              <ArrowLeft className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(0, -10, e)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title="Mover 10px para Cima"
            >
              <ArrowUp className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(0, 10, e)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title="Mover 10px para Baixo"
            >
              <ArrowDown className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(10, 0, e)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title="Mover 10px para a Direita"
            >
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Reset Position Button */}
          {hasOffset && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-lg bg-amber-950/80 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/50 cursor-pointer"
              title="Restaurar posição original padrão (0, 0)"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}

      {/* Floating Dragging Tooltip */}
      {isDragging && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-xl bg-indigo-950/95 border border-cyan-400 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-1.5 pointer-events-none whitespace-nowrap">
          <Move className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>
            X: {currentX > 0 ? `+${currentX}px` : `${currentX}px`} | Y:{" "}
            {currentY > 0 ? `+${currentY}px` : `${currentY}px`}
          </span>
        </div>
      )}
    </div>
  );
};
