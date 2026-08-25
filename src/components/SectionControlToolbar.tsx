import React, { useState } from "react";
import {
  TextAlign,
  FontSize,
  ContainerWidth,
  CardPadding,
  CardRadius,
} from "../types/landingPage";
import {
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Minimize2,
  Columns2,
  Columns3,
  Columns4,
  Type,
  EyeOff,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SectionControlToolbarProps {
  sectionId: string;
  sectionTitle: string;
  icon?: React.ReactNode;
  sectionIndex: number;
  totalSections: number;
  onMoveSection: (direction: "up" | "down") => void;
  // Size & Width
  containerWidth?: ContainerWidth;
  onChangeContainerWidth?: (width: ContainerWidth) => void;
  // Font Size
  headlineSize?: FontSize;
  onChangeHeadlineSize?: (size: FontSize) => void;
  // Alignment
  align?: TextAlign;
  onChangeAlign?: (align: TextAlign) => void;
  // Columns
  columns?: 2 | 3 | 4;
  onChangeColumns?: (cols: 2 | 3 | 4) => void;
  // Padding & Radius
  cardPadding?: CardPadding;
  onChangeCardPadding?: (padding: CardPadding) => void;
  cardRadius?: CardRadius;
  onChangeCardRadius?: (radius: CardRadius) => void;
  // Hide section
  onHideSection?: () => void;
  // Extra controls
  customActions?: React.ReactNode;
}

const FONT_SIZES: { id: FontSize; label: string; short: string }[] = [
  { id: "sm", label: "Pequeno (SM)", short: "P" },
  { id: "base", label: "Médio (BASE)", short: "M" },
  { id: "lg", label: "Grande (LG)", short: "G" },
  { id: "xl", label: "Extra Grande (XL)", short: "GG" },
  { id: "2xl", label: "Gigante (2XL)", short: "2XG" },
  { id: "3xl", label: "Impacto Máximo (3XL)", short: "3XG" },
];

const CONTAINER_WIDTHS: { id: ContainerWidth; label: string; short: string }[] = [
  { id: "narrow", label: "Estreito (896px)", short: "Estreito" },
  { id: "normal", label: "Padrão (1152px)", short: "Padrão" },
  { id: "wide", label: "Largo (1280px)", short: "Largo" },
  { id: "full", label: "100% Tela Cheia", short: "100%" },
];

export const SectionControlToolbar: React.FC<SectionControlToolbarProps> = ({
  sectionTitle,
  icon,
  sectionIndex,
  totalSections,
  onMoveSection,
  containerWidth = "normal",
  onChangeContainerWidth,
  headlineSize = "lg",
  onChangeHeadlineSize,
  align = "center",
  onChangeAlign,
  columns = 3,
  onChangeColumns,
  cardPadding = "normal",
  onChangeCardPadding,
  cardRadius = "xl",
  onChangeCardRadius,
  onHideSection,
  customActions,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Stepper helper for font size
  const handleStepFontSize = (delta: number) => {
    if (!onChangeHeadlineSize) return;
    const currentIdx = FONT_SIZES.findIndex((s) => s.id === headlineSize);
    const safeIdx = currentIdx === -1 ? 2 : currentIdx;
    const targetIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, safeIdx + delta));
    onChangeHeadlineSize(FONT_SIZES[targetIdx].id);
  };

  // Stepper helper for width
  const handleStepWidth = (delta: number) => {
    if (!onChangeContainerWidth) return;
    const currentIdx = CONTAINER_WIDTHS.findIndex((w) => w.id === containerWidth);
    const safeIdx = currentIdx === -1 ? 1 : currentIdx;
    const targetIdx = Math.max(0, Math.min(CONTAINER_WIDTHS.length - 1, safeIdx + delta));
    onChangeContainerWidth(CONTAINER_WIDTHS[targetIdx].id);
  };

  const currentSizeObj = FONT_SIZES.find((s) => s.id === headlineSize) || FONT_SIZES[2];
  const currentWidthObj = CONTAINER_WIDTHS.find((w) => w.id === containerWidth) || CONTAINER_WIDTHS[1];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mb-6 rounded-2xl bg-zinc-950/95 border border-purple-500/40 p-2.5 sm:p-3 text-xs text-zinc-300 shadow-2xl backdrop-blur-xl z-30 transition-all ring-1 ring-purple-500/20"
    >
      {/* Top Bar: Section Name & Position Reorder Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
        {/* Left: Section Identity & Order */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold">
            {icon || <Sparkles className="w-3.5 h-3.5" />}
          </div>
          <span className="font-bold text-white tracking-tight text-xs sm:text-sm">
            {sectionTitle}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono font-semibold">
            {sectionIndex + 1} de {totalSections}
          </span>
        </div>

        {/* Center / Right: Position Move Buttons & Sizing Quick Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Position Reorder: ⬆ Subir & ⬇ Descer */}
          <div className="flex items-center bg-zinc-900/90 rounded-xl p-0.5 border border-zinc-800">
            <button
              type="button"
              disabled={sectionIndex === 0}
              onClick={() => onMoveSection("up")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                sectionIndex === 0
                  ? "opacity-30 cursor-not-allowed text-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-purple-600"
              }`}
              title="Mover Seção para Cima"
            >
              <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Subir</span>
            </button>

            <button
              type="button"
              disabled={sectionIndex >= totalSections - 1}
              onClick={() => onMoveSection("down")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                sectionIndex >= totalSections - 1
                  ? "opacity-30 cursor-not-allowed text-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-purple-600"
              }`}
              title="Mover Seção para Baixo"
            >
              <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Descer</span>
            </button>
          </div>

          {/* Toggle Advanced Controls */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              showAdvanced
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
            }`}
            title="Ajustar Tamanhos, Alinhamentos e Colunas"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tamanho & Posição</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Custom actions if passed */}
          {customActions}

          {/* Hide Section Button */}
          {onHideSection && (
            <button
              type="button"
              onClick={onHideSection}
              className="p-1 rounded-xl bg-zinc-900/80 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
              title="Ocultar Seção da Página"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Controls Bar (Always Visible or Collapsible) */}
      <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        {/* 1. Typography / Headline Size Stepper */}
        {onChangeHeadlineSize && (
          <div className="flex items-center gap-1 bg-zinc-900/90 rounded-xl p-1 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 pl-1 mr-1 flex items-center gap-1">
              <Type className="w-3 h-3 text-purple-400" />
              Texto:
            </span>
            <button
              type="button"
              onClick={() => handleStepFontSize(-1)}
              className="px-1.5 py-0.5 rounded-lg bg-zinc-800 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer"
              title="Diminuir Tamanho da Fonte (A-)"
            >
              A-
            </button>
            <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-[11px] min-w-[34px] text-center">
              {currentSizeObj.short}
            </span>
            <button
              type="button"
              onClick={() => handleStepFontSize(1)}
              className="px-1.5 py-0.5 rounded-lg bg-zinc-800 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer"
              title="Aumentar Tamanho da Fonte (A+)"
            >
              A+
            </button>
          </div>
        )}

        {/* 2. Container Width / Largura da Seção */}
        {onChangeContainerWidth && (
          <div className="flex items-center gap-1 bg-zinc-900/90 rounded-xl p-1 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 pl-1 mr-1 flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-purple-400" />
              Largura:
            </span>
            {CONTAINER_WIDTHS.map((w) => {
              const isSelected = containerWidth === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onChangeContainerWidth(w.id)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                  title={w.label}
                >
                  {w.short}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Text Alignment / Posicionamento */}
        {onChangeAlign && (
          <div className="flex items-center gap-0.5 bg-zinc-900/90 rounded-xl p-1 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 pl-1 mr-1">Alinhar:</span>
            {[
              { id: "left", label: "Esquerda", icon: AlignLeft },
              { id: "center", label: "Centro", icon: AlignCenter },
              { id: "right", label: "Direita", icon: AlignRight },
              { id: "justify", label: "Justificado", icon: AlignJustify },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = align === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeAlign(item.id as TextAlign)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                  title={`Alinhar: ${item.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        )}

        {/* 4. Grid Columns (For Bento & Testimonials) */}
        {onChangeColumns && (
          <div className="flex items-center gap-1 bg-zinc-900/90 rounded-xl p-1 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 pl-1 mr-1">Colunas:</span>
            {[
              { count: 2 as const, icon: Columns2, label: "2 Colunas" },
              { count: 3 as const, icon: Columns3, label: "3 Colunas" },
              { count: 4 as const, icon: Columns4, label: "4 Colunas" },
            ].map((colItem) => {
              const Icon = colItem.icon;
              const isSelected = columns === colItem.count;
              return (
                <button
                  key={colItem.count}
                  type="button"
                  onClick={() => onChangeColumns(colItem.count)}
                  className={`px-1.5 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                  title={colItem.label}
                >
                  <Icon className="w-3 h-3" />
                  <span>{colItem.count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Extended Controls Drawer */}
      {showAdvanced && (
        <div className="mt-2 pt-2 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-900/40 p-2.5 rounded-xl">
          {/* Card Padding Stepper */}
          {onChangeCardPadding && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-zinc-400">Espaçamento Interno:</span>
              <div className="flex items-center gap-1">
                {(["compact", "normal", "spacious"] as CardPadding[]).map((pad) => {
                  const labels = { compact: "Compacto", normal: "Médio", spacious: "Espaçoso" };
                  const isSelected = cardPadding === pad;
                  return (
                    <button
                      key={pad}
                      type="button"
                      onClick={() => onChangeCardPadding(pad)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {labels[pad]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card Border Radius */}
          {onChangeCardRadius && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-zinc-400">Arredondamento Bordas:</span>
              <div className="flex items-center gap-1">
                {(["none", "sm", "lg", "2xl", "full"] as CardRadius[]).map((rad) => {
                  const labels = {
                    none: "Reto",
                    sm: "Suave",
                    lg: "Arredondado",
                    "2xl": "Super",
                    full: "Pílula",
                  };
                  const isSelected = cardRadius === rad;
                  return (
                    <button
                      key={rad}
                      type="button"
                      onClick={() => onChangeCardRadius(rad)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {labels[rad as keyof typeof labels] || rad}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
