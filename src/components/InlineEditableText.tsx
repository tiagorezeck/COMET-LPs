import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Check,
  Edit2,
  Zap,
  Flame,
  Target,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Minus,
  Plus,
} from "lucide-react";
import { TextAlign, FontSize } from "../types/landingPage";

export const WORD_FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 72, 80, 96, 110, 128
];

// Map FontSize keyword to an approximate pixel size if not explicitly in px
export const FONT_SIZE_TO_PX: Record<FontSize, number> = {
  "4xs": 8,
  "3xs": 10,
  "2xs": 12,
  xs: 14,
  sm: 18,
  base: 24,
  md: 28,
  lg: 36,
  xl: 44,
  "2xl": 54,
  "3xl": 64,
  "4xl": 80,
  "5xl": 96,
};

interface InlineEditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  isEditorPreview?: boolean;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  enableAiRefine?: boolean;
  fieldLabel?: string;
  nicheContext?: string;
  // Dynamic alignment & font controls
  align?: TextAlign;
  onAlignChange?: (newAlign: TextAlign) => void;
  fontSize?: FontSize;
  onFontSizeChange?: (newSize: FontSize) => void;
  fontSizePx?: number;
  onFontSizePxChange?: (newSizePx: number) => void;
  onDecreaseFontSize?: () => void;
  onIncreaseFontSize?: () => void;
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  isEditorPreview = false,
  tag: Tag = "div",
  className = "",
  placeholder = "Clique para editar...",
  multiline = false,
  style,
  enableAiRefine = true,
  fieldLabel,
  nicheContext,
  align,
  onAlignChange,
  fontSize,
  onFontSizeChange,
  fontSizePx,
  onFontSizePxChange,
  onDecreaseFontSize,
  onIncreaseFontSize,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  if (!isEditorPreview) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  const handleCommit = () => {
    setIsEditing(false);
    if (currentVal.trim() !== value) {
      onChange(currentVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === "Escape") {
      setCurrentVal(value);
      setIsEditing(false);
    }
  };

  const handleAiAction = async (action: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/refine-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          currentText: currentVal || value,
          context: nicheContext || "Landing Page de Alta Conversão",
          tone: "Persuasivo, agressivo e focado em benefícios de alto ticket",
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setCurrentVal(data.result);
        onChange(data.result);
      }
    } catch (err) {
      console.error("AI Refine Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Determine current active numeric font size
  const activeNumericSize =
    fontSizePx || (fontSize ? FONT_SIZE_TO_PX[fontSize] || 24 : 24);

  const handleStepNumericFontSize = (dir: "down" | "up") => {
    const current = activeNumericSize;
    // Find closest index in WORD_FONT_SIZES
    let closestIdx = 0;
    let minDiff = Infinity;
    WORD_FONT_SIZES.forEach((sz, idx) => {
      const diff = Math.abs(sz - current);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetIdx =
      dir === "up"
        ? Math.min(WORD_FONT_SIZES.length - 1, closestIdx + 1)
        : Math.max(0, closestIdx - 1);
    const newPx = WORD_FONT_SIZES[targetIdx];

    if (onFontSizePxChange) {
      onFontSizePxChange(newPx);
    } else if (dir === "up" && onIncreaseFontSize) {
      onIncreaseFontSize();
    } else if (dir === "down" && onDecreaseFontSize) {
      onDecreaseFontSize();
    }
  };

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="relative group/edit z-30 inline-block w-full my-1"
      >
        {/* Floating Formatting & AI Toolbar */}
        <div
          onMouseDown={(e) => {
            // CRITICAL: Prevent input/textarea from blurring when clicking toolbar buttons!
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute -top-13 left-0 z-50 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/98 border border-purple-500/80 shadow-2xl backdrop-blur-xl text-xs font-semibold text-white animate-in fade-in zoom-in-95 duration-150 max-w-[98vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {fieldLabel && (
            <span className="px-2 py-0.5 rounded-lg bg-purple-950 text-[10px] text-purple-300 font-bold border border-purple-500/30 whitespace-nowrap">
              {fieldLabel}
            </span>
          )}

          {/* Alignment Controls (Left, Center, Right, Justify) */}
          {onAlignChange && (
            <div className="flex items-center gap-0.5 bg-zinc-900/90 rounded-xl p-0.5 border border-zinc-800">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => onAlignChange("left")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  align === "left"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Alinhar à Esquerda"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => onAlignChange("center")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  align === "center"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Centralizar"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => onAlignChange("right")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  align === "right"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Alinhar à Direita"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => onAlignChange("justify")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  align === "justify"
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Justificado"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Microsoft Word Style Font Size Selector (8, 9, 10 ... 96) */}
          {(onFontSizePxChange || onFontSizeChange || onDecreaseFontSize || onIncreaseFontSize) && (
            <div className="flex items-center gap-1 bg-zinc-900/90 rounded-xl px-1.5 py-0.5 border border-zinc-800 text-[11px]">
              <Type className="w-3 h-3 text-purple-400 shrink-0" />
              
              {/* Decrease Step (A-) */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleStepNumericFontSize("down")}
                className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-600 text-zinc-300 hover:text-white font-bold transition-colors cursor-pointer"
                title="Diminuir Tamanho da Fonte (A-)"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>

              {/* Number Select Dropdown (Word style) */}
              <select
                value={activeNumericSize}
                onMouseDown={(e) => {
                  // Allow native dropdown interaction
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (onFontSizePxChange) {
                    onFontSizePxChange(val);
                  }
                }}
                className="bg-zinc-950 text-purple-300 font-bold font-mono text-[11px] px-1 py-0.5 rounded border border-zinc-800 cursor-pointer focus:outline-none focus:border-purple-500"
                title="Escolher numeração da fonte (como no Word)"
              >
                {WORD_FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz} className="bg-zinc-900 text-white">
                    {sz} px
                  </option>
                ))}
              </select>

              {/* Increase Step (A+) */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleStepNumericFontSize("up")}
                className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-600 text-zinc-300 hover:text-white font-bold transition-colors cursor-pointer"
                title="Aumentar Tamanho da Fonte (A+)"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          {/* AI Copywriting Quick Tools */}
          {enableAiRefine && (
            <div className="flex items-center gap-1 border-l border-r border-zinc-800 px-1.5">
              <button
                type="button"
                disabled={isAiLoading}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleAiAction("make_punchy")}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-purple-600 hover:text-white text-zinc-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Tornar mais persuasivo e direto"
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>+ Persuasivo</span>
              </button>

              <button
                type="button"
                disabled={isAiLoading}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleAiAction("shorten")}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-purple-600 hover:text-white text-zinc-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Tornar mais conciso"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Curto</span>
              </button>

              <button
                type="button"
                disabled={isAiLoading}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleAiAction("break_objections")}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-purple-600 hover:text-white text-zinc-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Quebrar objeções"
              >
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Objeções</span>
              </button>
            </div>
          )}

          {/* Confirm & Save button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={handleCommit}
            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md"
            title="Concluir e Salvar Edição"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar</span>
          </button>
        </div>

        {multiline ? (
          <textarea
            ref={textareaRef}
            value={currentVal}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              onChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={(e) => {
              // If focus moved to something inside container, don't dismiss
              if (containerRef.current?.contains(e.relatedTarget as Node)) {
                return;
              }
              handleCommit();
            }}
            onKeyDown={handleKeyDown}
            className={`w-full bg-zinc-950/95 text-white rounded-xl border-2 border-purple-500 p-2.5 outline-none resize-none shadow-2xl ${className}`}
            style={{ minHeight: "60px", ...style }}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={currentVal}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={(e) => {
              if (containerRef.current?.contains(e.relatedTarget as Node)) {
                return;
              }
              handleCommit();
            }}
            onKeyDown={handleKeyDown}
            className={`w-full bg-zinc-950/95 text-white rounded-xl border-2 border-purple-500 px-3 py-1.5 outline-none shadow-2xl ${className}`}
            style={style}
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="relative group/item inline-block w-full cursor-text transition-all rounded-lg p-0.5 hover:ring-2 hover:ring-purple-500/70 hover:bg-purple-950/20"
      title="Clique diretamente aqui para editar este texto, mudar tamanho e alinhamento"
    >
      {/* Floating Hover Pen Badge */}
      <span className="opacity-0 group-hover/item:opacity-100 transition-opacity absolute -top-3.5 right-2 z-20 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg pointer-events-none">
        <Edit2 className="w-2.5 h-2.5" />
        <span>Editar</span>
      </span>

      <Tag className={className} style={style}>
        {value || <span className="italic opacity-40">{placeholder}</span>}
      </Tag>
    </div>
  );
};
