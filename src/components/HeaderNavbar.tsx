import React, { useState, useRef } from "react";
import { HeaderNavConfig, HeaderNavLink, AccentColor, DEFAULT_HEADER_NAV } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import {
  Sparkles,
  Menu,
  X,
  Plus,
  Trash2,
  ChevronRight,
  Edit3,
  Upload,
  Image as ImageIcon,
  Type,
  Sliders,
  Palette,
  Pin,
  Check,
} from "lucide-react";
import { InlineEditableText } from "./InlineEditableText";

interface HeaderNavbarProps {
  config?: HeaderNavConfig;
  pageTitle?: string;
  accentColor: AccentColor;
  customAccentHex?: string;
  theme?: "light" | "dark" | "hybrid" | "midnight";
  isEditorPreview?: boolean;
  onUpdateConfig?: (newConfig: HeaderNavConfig) => void;
  onSelectSection?: (sectionId: string) => void;
  onOpenImagePicker?: (target: {
    type: "hero" | "bento" | "testimonial" | "avatar";
    currentUrl: string;
    itemId?: string;
    title: string;
  }) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  config: incomingConfig,
  accentColor = "purple",
  customAccentHex,
  theme = "dark",
  isEditorPreview = false,
  onUpdateConfig,
  onSelectSection,
  onOpenImagePicker,
}) => {
  const config = incomingConfig || DEFAULT_HEADER_NAV;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!config.enabled && !isEditorPreview) return null;

  const themeCfg = THEME_CONFIGS[accentColor] || THEME_CONFIGS.purple;
  const isLight = theme === "light";

  const handleScrollTo = (targetId: string) => {
    if (isEditorPreview && onSelectSection) {
      onSelectSection(targetId);
    }
    const el = document.getElementById(targetId) || document.getElementById(`${targetId}-section`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const updateConfig = (patch: Partial<HeaderNavConfig>) => {
    if (onUpdateConfig) {
      onUpdateConfig({ ...config, ...patch });
    }
  };

  const handleAddLink = () => {
    const newLink: HeaderNavLink = {
      id: `link_${Date.now()}`,
      label: "Nova Seção",
      targetSectionId: "bentoGrid",
    };
    updateConfig({
      links: [...(config.links || []), newLink],
    });
  };

  const handleRemoveLink = (id: string) => {
    updateConfig({
      links: (config.links || []).filter((l) => l.id !== id),
    });
  };

  const handleUpdateLink = (id: string, patch: Partial<HeaderNavLink>) => {
    updateConfig({
      links: (config.links || []).map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (up to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem selecionada deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateConfig({
          logoImageUrl: dataUrl,
          logoType: config.logoType === "text" ? "image" : config.logoType,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return "";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16) || 0;
      const g = parseInt(cleanHex[1] + cleanHex[1], 16) || 0;
      const b = parseInt(cleanHex[2] + cleanHex[2], 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const opacityValue = config.bgOpacity !== undefined ? config.bgOpacity / 100 : 0.92;

  const headerStyle: React.CSSProperties = {};
  if (config.bgColorHex) {
    headerStyle.backgroundColor = hexToRgba(config.bgColorHex, opacityValue);
  } else {
    const defaultBgHex = isLight ? "#ffffff" : "#09090b";
    headerStyle.backgroundColor = hexToRgba(defaultBgHex, opacityValue);
  }

  if (config.textColorHex) {
    headerStyle.color = config.textColorHex;
  }

  const ctaBtnStyle: React.CSSProperties = {};
  if (config.ctaBgColorHex) {
    ctaBtnStyle.backgroundColor = config.ctaBgColorHex;
    ctaBtnStyle.borderColor = config.ctaBgColorHex;
  } else if (customAccentHex || themeCfg.primaryHex) {
    ctaBtnStyle.backgroundColor = customAccentHex || themeCfg.primaryHex;
    ctaBtnStyle.borderColor = customAccentHex || themeCfg.primaryHex;
  }
  if (config.ctaTextColorHex) {
    ctaBtnStyle.color = config.ctaTextColorHex;
  }

  const pyClass =
    config.height === "small"
      ? "py-2 sm:py-2.5"
      : config.height === "large"
      ? "py-5 sm:py-6"
      : "py-3 sm:py-4"; // medium

  // Fixed vs Sticky vs Relative
  const isFixed = config.fixed;
  const isSticky = config.sticky !== false;
  
  // When fixed or sticky is enabled, anchor to top with sticky top-0 left-0 right-0 z-40 so page content scrolls underneath without jumping behind editor top bars
  const positioningClass = (isFixed || isSticky)
    ? "sticky top-0 left-0 right-0 z-40"
    : "relative z-10";

  const logoHeight = config.logoImageHeightPx || 36;
  const logoType = config.logoType || "text";

  return (
    <>
      <header
        style={headerStyle}
        className={`w-full transition-all backdrop-blur-xl border-b ${
          isLight
            ? "border-zinc-200/80 bg-white/95 shadow-sm shadow-zinc-200/50"
            : "border-zinc-800/80 bg-zinc-950/95 shadow-xl shadow-black/40"
        } ${positioningClass} ${
          !config.enabled && isEditorPreview ? "opacity-40 hover:opacity-100 transition-opacity" : ""
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all ${pyClass}`}>
          {/* LOGO AREA */}
          <div
            className="flex items-center gap-3 cursor-pointer group/logo"
            onClick={() => {
              if (isEditorPreview) setIsEditModalOpen(true);
            }}
            title={isEditorPreview ? "Clique para configurar a Logo do Cabeçalho" : undefined}
          >
            {/* 1. Image only */}
            {logoType === "image" && (
              config.logoImageUrl ? (
                <img
                  src={config.logoImageUrl}
                  alt={config.logoText || "Logo"}
                  style={{ height: `${logoHeight}px`, maxHeight: "64px" }}
                  className="w-auto object-contain transition-transform group-hover/logo:scale-105"
                />
              ) : (
                <div
                  style={{ height: `${logoHeight}px` }}
                  className="px-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center gap-1.5 text-xs font-bold"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{config.logoText || "Upload Logo PNG"}</span>
                </div>
              )
            )}

            {/* 2. Both: Image + Text */}
            {logoType === "both" && (
              <div className="flex items-center gap-2.5">
                {config.logoImageUrl ? (
                  <img
                    src={config.logoImageUrl}
                    alt={config.logoText || "Logo"}
                    style={{ height: `${logoHeight}px`, maxHeight: "64px" }}
                    className="w-auto object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                {isEditorPreview ? (
                  <InlineEditableText
                    value={config.logoText || "COMET.LP"}
                    onChange={(newVal) => updateConfig({ logoText: newVal })}
                    isEditorPreview={true}
                    tag="span"
                    className="font-extrabold text-base sm:text-lg tracking-tight"
                    style={{ color: config.textColorHex || undefined }}
                    placeholder="Nome da Marca/Logo..."
                    fieldLabel="Logo do Cabeçalho"
                  />
                ) : (
                  <span className="font-extrabold text-base sm:text-lg tracking-tight" style={{ color: config.textColorHex || undefined }}>
                    {config.logoText || "COMET.LP"}
                  </span>
                )}
              </div>
            )}

            {/* 3. Text only */}
            {logoType === "text" && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" style={{ backgroundColor: config.ctaBgColorHex || undefined }} />
                {isEditorPreview ? (
                  <InlineEditableText
                    value={config.logoText || "COMET.LP"}
                    onChange={(newVal) => updateConfig({ logoText: newVal })}
                    isEditorPreview={true}
                    tag="span"
                    className="font-extrabold text-lg sm:text-xl tracking-tight"
                    style={{ color: config.textColorHex || undefined }}
                    placeholder="Nome da Marca/Logo..."
                    fieldLabel="Logo do Cabeçalho"
                  />
                ) : (
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight" style={{ color: config.textColorHex || undefined }}>
                    {config.logoText || "COMET.LP"}
                  </span>
                )}
              </div>
            )}

            {isEditorPreview && (
              <span className="opacity-0 group-hover/logo:opacity-100 transition-opacity p-1 rounded bg-zinc-800/80 text-zinc-300 text-[10px]">
                <Edit3 className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {(config.links || []).map((link) => (
              <div key={link.id} className="relative group/link flex items-center gap-1">
                {isEditorPreview ? (
                  <InlineEditableText
                    value={link.label}
                    onChange={(newVal) => handleUpdateLink(link.id, { label: newVal })}
                    isEditorPreview={true}
                    tag="button"
                    style={{ color: config.textColorHex || undefined }}
                    className={`${
                      isLight
                        ? "text-slate-700 hover:text-slate-950"
                        : "text-zinc-300 hover:text-white"
                    } transition-colors cursor-pointer font-semibold`}
                  />
                ) : (
                  <button
                    onClick={() => handleScrollTo(link.targetSectionId)}
                    style={{ color: config.textColorHex || undefined }}
                    className={`${
                      isLight
                        ? "text-slate-700 hover:text-slate-950"
                        : "text-zinc-300 hover:text-white"
                    } transition-colors cursor-pointer`}
                  >
                    {link.label}
                  </button>
                )}
              </div>
            ))}

            {isEditorPreview && (
              <button
                type="button"
                onClick={handleAddLink}
                className="px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-900/50 flex items-center gap-1 transition-colors cursor-pointer"
                title="Adicionar novo link no cabeçalho"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link</span>
              </button>
            )}
          </nav>

          {/* RIGHT ACTION CTA & EDIT TRIGGER */}
          <div className="flex items-center gap-3">
            {/* CTA Button */}
            {isEditorPreview ? (
              <InlineEditableText
                value={config.ctaText || "Garantir Vaga"}
                onChange={(newVal) => updateConfig({ ctaText: newVal })}
                isEditorPreview={true}
                tag="button"
                style={ctaBtnStyle}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${config.ctaBgColorHex ? "" : themeCfg.ctaBg}`}
                placeholder="Texto do Botão..."
                fieldLabel="Botão do Cabeçalho"
              />
            ) : (
              <button
                onClick={() => handleScrollTo(config.ctaTargetSectionId || "formSection")}
                style={ctaBtnStyle}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${config.ctaBgColorHex ? "" : themeCfg.ctaBg}`}
              >
                {config.ctaText || "Garantir Vaga"}
              </button>
            )}

            {/* Editor Config Settings Trigger Button */}
            {isEditorPreview && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-purple-500 transition-colors cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-bold"
                title="Personalizar Logo, Links e Fixação do Cabeçalho"
              >
                <Sliders className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Configurar Topo</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900/60 md:hidden text-zinc-300 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="space-y-2">
              {(config.links || []).map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.targetSectionId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 text-zinc-200 font-semibold text-sm hover:bg-zinc-800"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              ))}
            </div>

            <button
              onClick={() => handleScrollTo(config.ctaTargetSectionId || "formSection")}
              style={ctaBtnStyle}
              className={`w-full py-3.5 rounded-2xl text-center font-bold text-white shadow-lg text-sm ${
                config.ctaBgColorHex ? "" : themeCfg.ctaBg
              }`}
            >
              {config.ctaText || "Garantir Vaga"}
            </button>
          </div>
        )}
      </header>

      {/* MODAL DE CONFIGURAÇÃO DO CABEÇALHO & LOGO */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-left max-h-[92vh] overflow-y-auto space-y-6 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Configurar Cabeçalho & Logotipo
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Defina texto, imagem PNG com upload, fixação no topo e links.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* SEÇÃO 1: TIPO DE LOGO & UPLOAD PNG */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    Formato do Logotipo
                  </label>
                </div>
              </div>

              {/* 3 Options: Escrito, Imagem PNG, ou Ambos */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "text", label: "Texto Escrito", icon: Type, desc: "Apenas nome" },
                  { id: "image", label: "Imagem PNG", icon: ImageIcon, desc: "Upload de arquivo" },
                  { id: "both", label: "Ambos", icon: Sparkles, desc: "Logo + Texto" },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = (config.logoType || "text") === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateConfig({ logoType: opt.id as any })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/40"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-purple-400" : "text-zinc-500"}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <span className="font-bold text-xs">{opt.label}</span>
                      <span className="text-[10px] text-zinc-500 leading-tight">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input for Brand Name if Text or Both */}
              {(config.logoType === "text" || config.logoType === "both" || !config.logoType) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Nome da Marca / Texto do Logo:
                  </label>
                  <input
                    type="text"
                    value={config.logoText || ""}
                    onChange={(e) => updateConfig({ logoText: e.target.value })}
                    placeholder="Ex: COMET.LP, Minha Marca..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Upload PNG & Image Settings if Image or Both */}
              {(config.logoType === "image" || config.logoType === "both") && (
                <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">
                      Upload da Imagem da Logo (PNG, SVG, JPG, WebP):
                    </label>
                    {config.logoImageUrl && (
                      <button
                        type="button"
                        onClick={() => updateConfig({ logoImageUrl: "" })}
                        className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remover</span>
                      </button>
                    )}
                  </div>

                  {/* Upload Drop Zone / Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Fazer Upload do Arquivo PNG/SVG</span>
                    </button>

                    <span className="text-xs text-zinc-500">ou insira a URL abaixo</span>
                  </div>

                  <input
                    type="url"
                    value={config.logoImageUrl || ""}
                    onChange={(e) => updateConfig({ logoImageUrl: e.target.value })}
                    placeholder="https://exemplo.com/minha-logo.png"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none font-mono"
                  />

                  {/* Transparent Checkerboard Preview Box */}
                  {config.logoImageUrl && (
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-12 rounded-lg border border-zinc-700 flex items-center justify-center p-1 overflow-hidden"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #222 25%, transparent 25%), 
                              linear-gradient(-45deg, #222 25%, transparent 25%), 
                              linear-gradient(45deg, transparent 75%, #222 75%), 
                              linear-gradient(-45deg, transparent 75%, #222 75%)
                            `,
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                            backgroundColor: "#111",
                          }}
                        >
                          <img
                            src={config.logoImageUrl}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Logotipo Carregado</span>
                          <span className="text-[10px] text-emerald-400">PNG Transparente Pronto</span>
                        </div>
                      </div>

                      {/* Height Slider */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 font-semibold">Altura:</span>
                        <input
                          type="range"
                          min="20"
                          max="70"
                          value={config.logoImageHeightPx || 36}
                          onChange={(e) => updateConfig({ logoImageHeightPx: parseInt(e.target.value) })}
                          className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-xs font-bold text-purple-300 w-10 text-right">
                          {config.logoImageHeightPx || 36}px
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SEÇÃO 2: COMPORTAMENTO DO CABEÇALHO (FIXAR NO TOPO / STICKY) */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Posicionamento & Fixação
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Toggle Exibir */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Exibir Cabeçalho</span>
                    <span className="text-[10px] text-zinc-500">Ativa a barra superior</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => updateConfig({ enabled: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                {/* 2. Fixar no Topo Permanente (Fixed) */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Fixar no Topo da Tela</span>
                    <span className="text-[10px] text-purple-300 font-semibold">100% Estático / Fixo</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.fixed ?? true}
                    onChange={(e) => updateConfig({ fixed: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Sticky Note */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-white block">Acompanhar Rolagem (Sticky)</span>
                  <span className="text-[10px] text-zinc-400">
                    O cabeçalho gruda no topo suavemente conforme o usuário navega
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.sticky !== false}
                  onChange={(e) => updateConfig({ sticky: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Height / Spacing */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-300">Altura do Menu:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["small", "medium", "large"] as const).map((hSize) => (
                    <button
                      key={hSize}
                      type="button"
                      onClick={() => updateConfig({ height: hSize })}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        (config.height || "medium") === hSize
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                      }`}
                    >
                      {hSize === "small" ? "Slim (Pequeno)" : hSize === "large" ? "Alto" : "Médio (Padrão)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Opacidade com Desfoque (Blur):</label>
                  <span className="text-xs font-bold text-purple-400">
                    {config.bgOpacity !== undefined ? config.bgOpacity : 90}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.bgOpacity !== undefined ? config.bgOpacity : 90}
                  onChange={(e) => updateConfig({ bgOpacity: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* SEÇÃO 3: CORES PERSONALIZADAS */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Cores do Cabeçalho
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColorHex || (isLight ? "#ffffff" : "#09090b")}
                      onChange={(e) => updateConfig({ bgColorHex: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.bgColorHex || ""}
                      placeholder="Tema padrão"
                      onChange={(e) => updateConfig({ bgColorHex: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Texto & Links</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColorHex || (isLight ? "#0f172a" : "#ffffff")}
                      onChange={(e) => updateConfig({ textColorHex: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textColorHex || ""}
                      placeholder="Tema padrão"
                      onChange={(e) => updateConfig({ textColorHex: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Botão CTA (Fundo)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.ctaBgColorHex || "#a855f7"}
                      onChange={(e) => updateConfig({ ctaBgColorHex: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.ctaBgColorHex || ""}
                      placeholder="Tema padrão"
                      onChange={(e) => updateConfig({ ctaBgColorHex: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Botão CTA (Texto)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.ctaTextColorHex || "#ffffff"}
                      onChange={(e) => updateConfig({ ctaTextColorHex: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.ctaTextColorHex || ""}
                      placeholder="#ffffff"
                      onChange={(e) => updateConfig({ ctaTextColorHex: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: LINKS DE NAVEGAÇÃO */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Links de Navegação
                </label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Link</span>
                </button>
              </div>

              <div className="space-y-2">
                {(config.links || []).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800"
                  >
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(link.id, { label: e.target.value })}
                      placeholder="Nome do Link..."
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <select
                      value={link.targetSectionId}
                      onChange={(e) => handleUpdateLink(link.id, { targetSectionId: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300 font-semibold"
                    >
                      <option value="hero">Hero / Topo</option>
                      <option value="bentoGrid">Bento Grid / Recursos</option>
                      <option value="testimonials">Depoimentos</option>
                      <option value="quiz">Quiz / Diagnóstico</option>
                      <option value="formSection">Formulário / Garantir</option>
                      <option value="faq">FAQ / Dúvidas</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 5: BOTÃO CTA */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Texto do Botão de Ação (CTA)
              </label>
              <input
                type="text"
                value={config.ctaText || ""}
                onChange={(e) => updateConfig({ ctaText: e.target.value })}
                placeholder="Ex: Garantir Vaga, Agendar Consulta..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-950/50 cursor-pointer transition-all hover:scale-[1.01]"
            >
              Salvar Configurações do Cabeçalho
            </button>
          </div>
        </div>
      )}
    </>
  );
};
