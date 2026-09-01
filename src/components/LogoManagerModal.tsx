import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Palette,
  Layers,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Sliders,
  Type,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { LogoColorMode, LogoItem } from "../types/landingPage";

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logos: string[];
  logoItems?: LogoItem[];
  colorMode: LogoColorMode;
  logoSize?: "xs" | "sm" | "md" | "lg" | "xl";
  onUpdateLogos: (
    logos: string[],
    colorMode: LogoColorMode,
    logoItems?: LogoItem[],
    logoSize?: "xs" | "sm" | "md" | "lg" | "xl"
  ) => void;
  accentColorName?: string;
}

export interface BrandLogoPreset {
  name: string;
  category: "Imprensa & Finanças" | "Tech & Plataformas" | "Certificações & Vendas";
  originalColorHex: string;
  originalBgHex: string;
  badgeTag: string;
  imageUrl?: string;
}

export const POPULAR_LOGO_PRESETS: BrandLogoPreset[] = [
  {
    name: "Forbes Brasil",
    category: "Imprensa & Finanças",
    originalColorHex: "#ef4444",
    originalBgHex: "#450a0a",
    badgeTag: "Imprensa VIP",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Exame",
    category: "Imprensa & Finanças",
    originalColorHex: "#38bdf8",
    originalBgHex: "#082f49",
    badgeTag: "Negócios",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Valor Econômico",
    category: "Imprensa & Finanças",
    originalColorHex: "#2dd4bf",
    originalBgHex: "#042f2e",
    badgeTag: "Economia",
  },
  {
    name: "InfoMoney",
    category: "Imprensa & Finanças",
    originalColorHex: "#3b82f6",
    originalBgHex: "#172554",
    badgeTag: "Investimentos",
  },
  {
    name: "G1 Negócios",
    category: "Imprensa & Finanças",
    originalColorHex: "#f43f5e",
    originalBgHex: "#4c0519",
    badgeTag: "Portal Líder",
  },
  {
    name: "Bloomberg Línea",
    category: "Imprensa & Finanças",
    originalColorHex: "#c084fc",
    originalBgHex: "#3b0764",
    badgeTag: "Mercado Global",
  },
  {
    name: "Google Partner",
    category: "Tech & Plataformas",
    originalColorHex: "#facc15",
    originalBgHex: "#422006",
    badgeTag: "Google Certified",
  },
  {
    name: "Meta Business Partner",
    category: "Tech & Plataformas",
    originalColorHex: "#60a5fa",
    originalBgHex: "#1e3a8a",
    badgeTag: "Meta Ads",
  },
  {
    name: "Shopify Plus",
    category: "Tech & Plataformas",
    originalColorHex: "#4ade80",
    originalBgHex: "#052e16",
    badgeTag: "E-commerce",
  },
  {
    name: "Hotmart Black",
    category: "Certificações & Vendas",
    originalColorHex: "#fb923c",
    originalBgHex: "#431407",
    badgeTag: "Infoprodutos",
  },
  {
    name: "Stripe Verified",
    category: "Tech & Plataformas",
    originalColorHex: "#a78bfa",
    originalBgHex: "#2e1065",
    badgeTag: "Pagamentos Seguros",
  },
  {
    name: "RD Station Partner",
    category: "Certificações & Vendas",
    originalColorHex: "#34d399",
    originalBgHex: "#064e3b",
    badgeTag: "Automação",
  },
  {
    name: "HubSpot Certified",
    category: "Certificações & Vendas",
    originalColorHex: "#f97316",
    originalBgHex: "#431407",
    badgeTag: "Inbound Marketing",
  },
];

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  logos: initialLogos,
  logoItems: initialLogoItems,
  colorMode: initialColorMode = "accent",
  logoSize: initialLogoSize = "sm",
  onUpdateLogos,
}) => {
  const [items, setItems] = useState<LogoItem[]>(() => {
    if (initialLogoItems && initialLogoItems.length > 0) return initialLogoItems;
    return (initialLogos || []).map((name, idx) => ({
      id: `logo_${idx}_${Date.now()}`,
      type: "text",
      text: name,
      colorMode: "default",
    }));
  });

  const [colorMode, setColorMode] = useState<LogoColorMode>(initialColorMode || "accent");
  const [logoSize, setLogoSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">(initialLogoSize || "sm");
  const [newLogoText, setNewLogoText] = useState("");
  const [newLogoType, setNewLogoType] = useState<"text" | "image">("text");
  const [newLogoImageUrl, setNewLogoImageUrl] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddLogo = () => {
    if (newLogoType === "text" && !newLogoText.trim()) return;
    if (newLogoType === "image" && !newLogoImageUrl.trim() && !newLogoText.trim()) return;

    const newItem: LogoItem = {
      id: `logo_${Date.now()}`,
      type: newLogoType,
      text: newLogoText.trim() || "Logo Marca",
      imageUrl: newLogoImageUrl.trim() || undefined,
      colorMode: "default",
    };

    setItems([...items, newItem]);
    setNewLogoText("");
    setNewLogoImageUrl("");
  };

  const handleRemoveLogo = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= items.length) return;
    const reordered = [...items];
    const item = reordered.splice(idx, 1)[0];
    reordered.splice(newIdx, 0, item);
    setItems(reordered);
  };

  const handleUpdateItem = (id: string, updates: Partial<LogoItem>) => {
    setItems(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const handleSave = () => {
    const textLogos = items.map((it) => it.text || "Logo");
    onUpdateLogos(textLogos, colorMode, items, logoSize);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Personalizar Logos (Texto ou Imagem) & Prova Social
                </h3>
                <p className="text-xs text-zinc-400">
                  Escolha se cada logo será em texto ou imagem e defina as cores (padrão do sistema vs original).
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Color Mode Selector (Global Default) */}
            <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Estilo Global de Cor das Logos
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Accent Color */}
                <button
                  type="button"
                  onClick={() => setColorMode("accent")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    colorMode === "accent"
                      ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Cor Padrão do Sistema</span>
                    {colorMode === "accent" && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Harmonia total com a cor do tema da sua landing page.
                  </p>
                </button>

                {/* 2. Original Colors */}
                <button
                  type="button"
                  onClick={() => setColorMode("original")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    colorMode === "original"
                      ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Cores Originais</span>
                    {colorMode === "original" && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Logos e marcas com suas cores e tonalidades oficiais sem filtro.
                  </p>
                </button>

                {/* 3. Monochrome Clean */}
                <button
                  type="button"
                  onClick={() => setColorMode("monochrome")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    colorMode === "monochrome"
                      ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Monocromático Clean</span>
                    {colorMode === "monochrome" && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Minimalismo em branco/cinza acetinado para máxima elegância.
                  </p>
                </button>
              </div>
            </div>

            {/* Logo Size Selector (1 Smaller, 3 Larger) */}
            <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Tamanho das Logos no Letreiro
                  </label>
                </div>
                <span className="text-[11px] font-semibold text-purple-400">
                  1 Menor + Padrão + 3 Maiores
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "xs", name: "Pequeno (XS)", badge: "1 Menor", desc: "Altura 20-24px" },
                  { id: "sm", name: "Padrão (SM)", badge: "Padrão", desc: "Altura 28-32px" },
                  { id: "md", name: "Médio (MD)", badge: "Maior 1", desc: "Altura 40-48px" },
                  { id: "lg", name: "Grande (LG)", badge: "Maior 2", desc: "Altura 56-64px" },
                  { id: "xl", name: "Extra (XL)", badge: "Maior 3", desc: "Altura 80-96px" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLogoSize(s.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      logoSize === s.id
                        ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{s.name}</span>
                      {logoSize === s.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded w-fit mb-1">
                      {s.badge}
                    </span>
                    <span className="text-[10px] text-zinc-500">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Logos List (Drag, Reorder, Change Type & Color) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Logos Ativas no Letreiro ({items.length})
                </label>
                <span className="text-[11px] text-zinc-500">Configure Texto ou Imagem para cada marca</span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 group hover:border-purple-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Drag & Number */}
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-zinc-600" />
                          <span className="text-xs font-mono text-zinc-500 w-4">{idx + 1}</span>

                          {/* Type Pill Toggle */}
                          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                            <button
                              type="button"
                              onClick={() => handleUpdateItem(item.id, { type: "text" })}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                item.type === "text"
                                  ? "bg-purple-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              <Type className="w-3 h-3" />
                              <span>Texto</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateItem(item.id, { type: "image" })}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                item.type === "image"
                                  ? "bg-purple-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>Imagem</span>
                            </button>
                          </div>

                          {/* Color Mode Per Logo */}
                          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                            <button
                              type="button"
                              onClick={() => handleUpdateItem(item.id, { colorMode: "default" })}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                (item.colorMode || "default") === "default"
                                  ? "bg-indigo-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                              title="Usar cor padrão do sistema"
                            >
                              Cor Padrão
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateItem(item.id, { colorMode: "original" })}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                item.colorMode === "original"
                                  ? "bg-amber-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                              title="Usar cor original da logo"
                            >
                              Cor Original
                            </button>
                          </div>
                        </div>

                        {/* Move & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, "up")}
                            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === items.length - 1}
                            onClick={() => handleMove(idx, "down")}
                            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveLogo(item.id)}
                            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Fields for Item */}
                      {item.type === "text" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                            placeholder="Nome da Marca..."
                            className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                              placeholder="Nome da Marca (Alt / Nome)..."
                              className="w-1/3 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                            <input
                              type="url"
                              value={item.imageUrl || ""}
                              onChange={(e) => handleUpdateItem(item.id, { imageUrl: e.target.value })}
                              placeholder="URL da Imagem da Logo (https://...)"
                              className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          {/* Image Preview */}
                          {item.imageUrl && (
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                              <div className="h-10 w-24 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center p-1">
                                <img
                                  src={item.imageUrl}
                                  alt={item.text}
                                  className={`h-full w-auto object-contain ${
                                    item.colorMode === "original" ? "" : "filter brightness-200"
                                  }`}
                                />
                              </div>
                              <span className="text-[11px] text-zinc-400">
                                Prévia: {item.colorMode === "original" ? "Cor Original" : "Cor do Sistema"}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Logo Bar */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Adicionar Nova Marca no Letreiro
              </label>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setNewLogoType("text")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      newLogoType === "text" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Texto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLogoType("image")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      newLogoType === "image" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Imagem</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={newLogoText}
                  onChange={(e) => setNewLogoText(e.target.value)}
                  placeholder={newLogoType === "text" ? "Ex: Forbes, CNN, Google..." : "Nome da Marca..."}
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                />

                {newLogoType === "image" && (
                  <input
                    type="url"
                    value={newLogoImageUrl}
                    onChange={(e) => setNewLogoImageUrl(e.target.value)}
                    placeholder="URL da Imagem..."
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddLogo}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>

            {/* Popular Catalog Suggestions */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Catálogo de Marcas Recomendadas (1 Clique para Adicionar)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_LOGO_PRESETS.map((preset, idx) => {
                  const isAdded = items.some((l) => l.text.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAdded}
                      onClick={() => {
                        const newItem: LogoItem = {
                          id: `logo_${Date.now()}_${idx}`,
                          type: preset.imageUrl ? "image" : "text",
                          text: preset.name,
                          imageUrl: preset.imageUrl,
                          colorMode: "default",
                        };
                        setItems([...items, newItem]);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isAdded
                          ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white"
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-xs truncate">{preset.name}</div>
                        <div className="text-[10px] text-zinc-500">{preset.badgeTag}</div>
                      </div>
                      {isAdded ? (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Preferências das Logos</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
