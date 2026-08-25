import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Flame,
  ShieldCheck,
  Lock,
  PhoneCall,
  Check,
  Move,
  RotateCcw,
  Maximize2,
  Minus,
  Plus,
  Type,
  Sliders,
  ChevronDown,
  Layers,
  Palette,
} from "lucide-react";
import { ButtonCustomStyle, CardRadius, ElementOffset, AccentColor } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { InlineEditableText, WORD_FONT_SIZES } from "./InlineEditableText";

interface VisualEditableButtonProps {
  buttonId: string;
  text: string;
  subtext?: string;
  onTextChange: (newText: string) => void;
  onSubtextChange?: (newSubtext: string) => void;
  buttonStyle?: ButtonCustomStyle;
  onStyleChange?: (newStyle: ButtonCustomStyle) => void;
  isEditorPreview?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "whatsapp" | "outline";
  defaultIcon?: string;
  themeGlow?: string;
  accentColor?: AccentColor;
  className?: string;
  nicheContext?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
}

const AVAILABLE_ICONS = [
  { id: "arrow", label: "Seta", icon: ArrowRight },
  { id: "whatsapp", label: "WhatsApp", icon: PhoneCall },
  { id: "zap", label: "Raio", icon: Zap },
  { id: "flame", label: "Fogo", icon: Flame },
  { id: "shield", label: "Escudo", icon: ShieldCheck },
  { id: "lock", label: "Cadeado", icon: Lock },
  { id: "check", label: "Check", icon: Check },
  { id: "sparkles", label: "Brilho", icon: Sparkles },
  { id: "none", label: "Nenhum", icon: null },
];

export const BUTTON_PRESET_GRADIENTS = [
  { id: "theme", label: "Padrão Tema (Degradê do Tema)", gradient: "", colorHex: "" },
  { id: "orange", label: "Laranja Degradê (Sunset)", gradient: "bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-white shadow-orange-500/30", colorHex: "#f97316" },
  { id: "purple", label: "Roxo Cyber", gradient: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-purple-500/30", colorHex: "#a855f7" },
  { id: "emerald", label: "Verde Esmeralda", gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-emerald-500/30", colorHex: "#10b981" },
  { id: "cyan", label: "Azul Elétrico", gradient: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30", colorHex: "#06b6d4" },
  { id: "rose", label: "Vermelho Fogo", gradient: "bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white shadow-rose-500/30", colorHex: "#f43f5e" },
  { id: "gold", label: "Dourado Premium", gradient: "bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-zinc-950 font-black shadow-amber-500/40", colorHex: "#eab308" },
  { id: "dark", label: "Midnight Dark", gradient: "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-xl", colorHex: "#18181b" },
  { id: "white", label: "Branco Clean", gradient: "bg-white hover:bg-zinc-100 text-zinc-950 font-black shadow-2xl", colorHex: "#ffffff" },
];

export const VisualEditableButton: React.FC<VisualEditableButtonProps> = ({
  buttonId,
  text,
  subtext,
  onTextChange,
  onSubtextChange,
  buttonStyle = {} as ButtonCustomStyle,
  onStyleChange,
  isEditorPreview = false,
  onClick,
  variant = "primary",
  defaultIcon = "arrow",
  themeGlow,
  accentColor = "purple",
  className = "",
  nicheContext,
  type = "button",
  disabled = false,
  loading = false,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingWidth, setIsResizingWidth] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startDragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const widthMode = buttonStyle.widthMode || "full";
  const customWidthPx = buttonStyle.customWidthPx;
  const heightMode = buttonStyle.heightMode || "normal";
  const customPaddingYPx = buttonStyle.customPaddingYPx;
  const fontSizePx = buttonStyle.fontSizePx;
  const borderRadius = buttonStyle.borderRadius || "2xl";
  const iconName = buttonStyle.iconName !== undefined ? buttonStyle.iconName : defaultIcon;
  const offsetX = buttonStyle.offsetX || 0;
  const offsetY = buttonStyle.offsetY || 0;

  const updateStyle = (patch: Partial<ButtonCustomStyle>) => {
    if (onStyleChange) {
      onStyleChange({
        ...buttonStyle,
        ...patch,
      });
    }
  };

  // 2D Drag-to-Move
  const handleStartDrag = (e: React.MouseEvent) => {
    if (!isEditorPreview) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    startDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: offsetX,
      initY: offsetY,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startDragRef.current.startX;
      const deltaY = e.clientY - startDragRef.current.startY;
      const newX = Math.max(-400, Math.min(400, Math.round(startDragRef.current.initX + deltaX)));
      const newY = Math.max(-400, Math.min(400, Math.round(startDragRef.current.initY + deltaY)));

      updateStyle({ offsetX: newX, offsetY: newY });
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
  }, [isDragging, offsetX, offsetY]);

  // Radius helper
  const getRadiusClass = (r: CardRadius) => {
    switch (r) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "xl":
        return "rounded-xl";
      case "2xl":
        return "rounded-2xl";
      case "3xl":
        return "rounded-3xl";
      case "full":
        return "rounded-full";
      default:
        return "rounded-2xl";
    }
  };

  // Height / Padding helper
  const getPaddingClass = () => {
    if (customPaddingYPx !== undefined) return "";
    switch (heightMode) {
      case "compact":
        return "py-2.5 px-5";
      case "large":
        return "py-5 px-8";
      case "xlarge":
        return "py-6 px-10";
      case "normal":
      default:
        return "py-4 px-6";
    }
  };

  // Selected Icon Component
  const SelectedIcon = AVAILABLE_ICONS.find((i) => i.id === iconName)?.icon;

  // Background and border styling based on variant & custom overrides
  const getVariantStyles = () => {
    if (buttonStyle.customGradient) {
      return `${buttonStyle.customGradient} hover:opacity-95 shadow-lg`;
    }
    if (buttonStyle.customBgColorHex) {
      return `hover:opacity-95 text-white shadow-lg`;
    }

    const themeCfg = THEME_CONFIGS[accentColor] || THEME_CONFIGS.purple;

    switch (variant) {
      case "whatsapp":
        return "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-500/25";
      case "secondary":
        return "bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-lg";
      case "outline":
        return "bg-transparent hover:bg-white/10 text-white border border-white/30";
      case "primary":
      default:
        // Uses Theme CTA gradient (e.g. orange gradient if accentColor is orange/amber)
        return `${themeCfg.ctaBg} ${themeCfg.ctaHover} text-white ${themeCfg.ctaGlow}`;
    }
  };

  const handleResetOriginal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStyleChange) {
      onStyleChange({
        widthMode: "full",
        customWidthPx: undefined,
        heightMode: "normal",
        customPaddingYPx: undefined,
        fontSizePx: undefined,
        borderRadius: "2xl",
        iconName: defaultIcon,
        offsetX: 0,
        offsetY: 0,
        customGradient: undefined,
        customBgColorHex: undefined,
        customTextColorHex: undefined,
      });
    }
  };

  // Width wrapper class
  const getWidthContainerClass = () => {
    if (customWidthPx) return "";
    switch (widthMode) {
      case "auto":
        return "w-auto inline-flex";
      case "compact":
        return "w-full max-w-xs";
      case "wide":
        return "w-full max-w-xl";
      case "full":
      default:
        return "w-full";
    }
  };

  const hasModifications =
    widthMode !== "full" ||
    customWidthPx !== undefined ||
    heightMode !== "normal" ||
    customPaddingYPx !== undefined ||
    fontSizePx !== undefined ||
    borderRadius !== "2xl" ||
    offsetX !== 0 ||
    offsetY !== 0 ||
    buttonStyle.customGradient !== undefined ||
    buttonStyle.customBgColorHex !== undefined ||
    iconName !== defaultIcon;

  return (
    <div
      ref={containerRef}
      className={`relative group/button-container ${getWidthContainerClass()} ${className}`}
      style={{
        width: customWidthPx ? `${customWidthPx}px` : undefined,
        transform: offsetX !== 0 || offsetY !== 0 ? `translate(${offsetX}px, ${offsetY}px)` : undefined,
        transition: isDragging ? "none" : "transform 0.15s ease-out",
      }}
      onMouseEnter={() => isEditorPreview && setShowToolbar(true)}
      onMouseLeave={() => isEditorPreview && !isDragging && !isResizingWidth && !isColorMenuOpen && setShowToolbar(false)}
    >
      {/* BUTTON ELEMENT */}
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`w-full font-bold shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 group/btn cursor-pointer ${getVariantStyles()} ${getRadiusClass(
          borderRadius
        )} ${getPaddingClass()} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}`}
        style={{
          paddingTop: customPaddingYPx ? `${customPaddingYPx}px` : undefined,
          paddingBottom: customPaddingYPx ? `${customPaddingYPx}px` : undefined,
          fontSize: fontSizePx ? `${fontSizePx}px` : undefined,
          backgroundColor: buttonStyle.customBgColorHex && !buttonStyle.customGradient ? buttonStyle.customBgColorHex : undefined,
          color: buttonStyle.customTextColorHex ? buttonStyle.customTextColorHex : undefined,
        }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin my-1" />
        ) : (
          <>
            <div className="flex items-center justify-center gap-2.5 w-full">
              {/* Main Button Text (Inline Editable) */}
              <div className="flex-1 text-center font-bold tracking-tight">
                {isEditorPreview ? (
                  <InlineEditableText
                    value={text}
                    onChange={onTextChange}
                    isEditorPreview={true}
                    placeholder="Texto do botão..."
                    className="font-bold cursor-text inline-block"
                    fieldLabel="Botão CTA"
                    nicheContext={nicheContext}
                  />
                ) : (
                  <span>{text}</span>
                )}
              </div>

              {/* Selected Icon */}
              {SelectedIcon && (
                <SelectedIcon className="w-5 h-5 shrink-0 transition-transform group-hover/btn:translate-x-1" />
              )}
            </div>

            {/* Subtext (if explicitly provided and non-empty) */}
            {Boolean(subtext && subtext.trim().length > 0) && (
              <div className="text-[11px] opacity-80 font-normal">
                {isEditorPreview && onSubtextChange ? (
                  <InlineEditableText
                    value={subtext || ""}
                    onChange={onSubtextChange}
                    isEditorPreview={true}
                    placeholder="Subtexto do botão..."
                    className="text-[11px] cursor-text inline-block"
                    fieldLabel="Subtexto do Botão"
                    nicheContext={nicheContext}
                  />
                ) : (
                  <span>{subtext}</span>
                )}
              </div>
            )}
          </>
        )}
      </button>

      {/* Visual Button Editor Floating Toolbar - Positioned BELOW the button */}
      {isEditorPreview && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/98 border border-purple-500/80 shadow-2xl backdrop-blur-xl text-xs font-semibold text-white transition-all whitespace-nowrap ${
            showToolbar || isDragging || isResizingWidth || isColorMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div
            onMouseDown={handleStartDrag}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-move select-none shadow-md transition-colors text-[11px]"
            title="Clique e arraste o botão para qualquer posição (cima, baixo, lados)"
          >
            <Move className="w-3 h-3 text-cyan-300" />
            <span>Mover</span>
            {(offsetX !== 0 || offsetY !== 0) && (
              <span className="text-[9px] text-cyan-200 font-mono">
                ({offsetX > 0 ? `+${offsetX}` : offsetX},{offsetY > 0 ? `+${offsetY}` : offsetY})
              </span>
            )}
          </div>

          {/* Color & Gradient Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
              className={`px-2 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                buttonStyle.customGradient || buttonStyle.customBgColorHex
                  ? "bg-purple-900/80 border-purple-400 text-purple-200"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
              }`}
              title="Trocar Cor ou Degradê do Botão"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Cor</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Color Menu Popover */}
            {isColorMenuOpen && (
              <div className="absolute top-full mt-1 left-0 z-50 w-64 p-2.5 rounded-2xl bg-zinc-950 border border-purple-500/80 shadow-2xl space-y-2 text-[11px]">
                <div className="font-bold text-xs text-purple-300 border-b border-zinc-800 pb-1 flex items-center justify-between">
                  <span>Escolher Degradê / Cor do Botão</span>
                  <button
                    type="button"
                    onClick={() => setIsColorMenuOpen(false)}
                    className="text-zinc-500 hover:text-white font-mono text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {BUTTON_PRESET_GRADIENTS.map((p) => {
                    const isSelected =
                      (p.id === "theme" && !buttonStyle.customGradient && !buttonStyle.customBgColorHex) ||
                      buttonStyle.customGradient === p.gradient;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          updateStyle({
                            customGradient: p.gradient || undefined,
                            customBgColorHex: undefined,
                          });
                          setIsColorMenuOpen(false);
                        }}
                        className={`p-1.5 rounded-xl border text-[10px] font-bold text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected ? "border-purple-400 ring-2 ring-purple-500/50" : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                          style={{
                            backgroundColor: p.colorHex || THEME_CONFIGS[accentColor]?.primaryHex || "#ea580c",
                          }}
                        />
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Color Input */}
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-400 text-[10px] font-semibold shrink-0">Hex Personalizado:</span>
                  <input
                    type="color"
                    value={buttonStyle.customBgColorHex || "#ea580c"}
                    onChange={(e) => {
                      updateStyle({
                        customBgColorHex: e.target.value,
                        customGradient: undefined,
                      });
                    }}
                    className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={buttonStyle.customBgColorHex || ""}
                    placeholder="#ea580c"
                    onChange={(e) => {
                      updateStyle({
                        customBgColorHex: e.target.value,
                        customGradient: undefined,
                      });
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Width Controls */}
          <div className="flex items-center gap-0.5 bg-zinc-900 rounded-xl p-0.5 border border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => updateStyle({ widthMode: "auto", customWidthPx: undefined })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                widthMode === "auto" && !customWidthPx ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Largura Automática (adapta ao texto)"
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ widthMode: "compact", customWidthPx: 280 })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                customWidthPx === 280 ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Largura Média (280px)"
            >
              Médio
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ widthMode: "full", customWidthPx: undefined })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                widthMode === "full" && !customWidthPx ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Largura Total (100%)"
            >
              100%
            </button>
          </div>

          {/* Height / Padding Controls */}
          <div className="flex items-center gap-0.5 bg-zinc-900 rounded-xl p-0.5 border border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => updateStyle({ heightMode: "compact", customPaddingYPx: 10 })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                heightMode === "compact" || customPaddingYPx === 10 ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Altura Compacta"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ heightMode: "normal", customPaddingYPx: undefined })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                heightMode === "normal" && customPaddingYPx === undefined ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Altura Padrão"
            >
              M
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ heightMode: "large", customPaddingYPx: 20 })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                heightMode === "large" || customPaddingYPx === 20 ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Altura Grande"
            >
              G
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ heightMode: "xlarge", customPaddingYPx: 26 })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                heightMode === "xlarge" || customPaddingYPx === 26 ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Altura Extra Grande"
            >
              GG
            </button>
          </div>

          {/* Font Size Step (Word Style) */}
          <div className="flex items-center gap-1 bg-zinc-900 rounded-xl px-1.5 py-0.5 border border-zinc-800 text-[11px]">
            <Type className="w-3 h-3 text-purple-400" />
            <button
              type="button"
              onClick={() => {
                const current = fontSizePx || 18;
                updateStyle({ fontSizePx: Math.max(10, current - 2) });
              }}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-600 text-zinc-300 hover:text-white font-bold transition-colors cursor-pointer"
              title="Diminuir Tamanho da Fonte do Botão"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>

            <span className="font-mono text-purple-300 font-bold px-1 text-[11px]">
              {fontSizePx || 18}px
            </span>

            <button
              type="button"
              onClick={() => {
                const current = fontSizePx || 18;
                updateStyle({ fontSizePx: Math.min(36, current + 2) });
              }}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-600 text-zinc-300 hover:text-white font-bold transition-colors cursor-pointer"
              title="Aumentar Tamanho da Fonte do Botão"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Border Radius Pill */}
          <div className="flex items-center gap-0.5 bg-zinc-900 rounded-xl p-0.5 border border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => updateStyle({ borderRadius: "lg" })}
              className={`px-1.5 py-1 rounded-md transition-colors cursor-pointer ${
                borderRadius === "lg" ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Bordas Leves"
            >
              Suave
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ borderRadius: "2xl" })}
              className={`px-1.5 py-1 rounded-md transition-colors cursor-pointer ${
                borderRadius === "2xl" ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Bordas Arredondadas (Padrão)"
            >
              2XL
            </button>
            <button
              type="button"
              onClick={() => updateStyle({ borderRadius: "full" })}
              className={`px-1.5 py-1 rounded-md transition-colors cursor-pointer ${
                borderRadius === "full" ? "bg-purple-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
              title="Formato Pílula / 100% Redondo"
            >
              Pílula
            </button>
          </div>

          {/* Reset Button */}
          {hasModifications && (
            <button
              type="button"
              onClick={handleResetOriginal}
              className="px-2 py-1 rounded-xl bg-amber-950/80 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/50 flex items-center gap-1 cursor-pointer text-[10px]"
              title="Restaurar tamanho, cor e posição original do botão"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Restaurar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
