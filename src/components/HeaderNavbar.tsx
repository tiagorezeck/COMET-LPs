import React, { useState } from "react";
import { HeaderNavConfig, HeaderNavLink, AccentColor } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { Sparkles, Menu, X, Plus, Trash2, ChevronRight, Edit3 } from "lucide-react";
import { InlineEditableText } from "./InlineEditableText";

interface HeaderNavbarProps {
  config: HeaderNavConfig;
  pageTitle?: string;
  accentColor: AccentColor;
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
  config,
  accentColor = "purple",
  theme = "dark",
  isEditorPreview = false,
  onUpdateConfig,
  onSelectSection,
  onOpenImagePicker,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!config.enabled && !isEditorPreview) return null;

  const themeCfg = THEME_CONFIGS[accentColor] || THEME_CONFIGS.purple;
  const isLight = theme === "light";

  const handleScrollTo = (targetId: string) => {
    if (isEditorPreview) {
      if (onSelectSection) onSelectSection(targetId);
      return;
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

  return (
    <>
      <header
        className={`w-full z-40 transition-all ${
          config.sticky ? "sticky top-0 backdrop-blur-md" : "relative"
        } ${
          isLight
            ? "bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm"
            : "bg-zinc-950/90 border-b border-zinc-800/80 text-white shadow-xl shadow-black/20"
        } ${!config.enabled && isEditorPreview ? "opacity-40 hover:opacity-100 transition-opacity" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {config.logoType === "image" && config.logoImageUrl ? (
              <img
                src={config.logoImageUrl}
                alt="Logo"
                className="h-8 sm:h-10 object-contain cursor-pointer"
                onClick={() => {
                  if (isEditorPreview && onOpenImagePicker) {
                    onOpenImagePicker({
                      type: "hero",
                      currentUrl: config.logoImageUrl || "",
                      title: "Escolher Imagem do Logotipo",
                    });
                  }
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${themeCfg.ctaBg}`} />
                {isEditorPreview ? (
                  <InlineEditableText
                    value={config.logoText || "COMET.LP"}
                    onChange={(newVal) => updateConfig({ logoText: newVal })}
                    isEditorPreview={true}
                    tag="span"
                    className="font-extrabold text-lg sm:text-xl tracking-tight"
                    placeholder="Nome da Marca/Logo..."
                    fieldLabel="Logo do Cabeçalho"
                  />
                ) : (
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight">
                    {config.logoText || "COMET.LP"}
                  </span>
                )}
              </div>
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
                    className={`${
                      isLight
                        ? "text-slate-700 hover:text-slate-950"
                        : "text-zinc-300 hover:text-white"
                    } transition-colors cursor-pointer font-semibold`}
                  />
                ) : (
                  <button
                    onClick={() => handleScrollTo(link.targetSectionId)}
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
                value={config.ctaText || "Quero uma Bolsa"}
                onChange={(newVal) => updateConfig({ ctaText: newVal })}
                isEditorPreview={true}
                tag="button"
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${themeCfg.ctaBg}`}
                placeholder="Texto do Botão..."
                fieldLabel="Botão do Cabeçalho"
              />
            ) : (
              <button
                onClick={() => handleScrollTo(config.ctaTargetSectionId || "formSection")}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${themeCfg.ctaBg}`}
              >
                {config.ctaText || "Quero uma Bolsa"}
              </button>
            )}

            {/* Quick Editor Settings Button */}
            {isEditorPreview && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                title="Configurar Menu e Cabeçalho"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border ${
                isLight ? "border-slate-300 text-slate-800" : "border-zinc-800 text-zinc-300"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden px-4 pt-3 pb-6 border-t ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
            } space-y-3`}
          >
            {(config.links || []).map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.targetSectionId)}
                className="w-full text-left py-2 text-sm font-semibold border-b border-zinc-800/40 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HEADER EDIT MODAL (EDITOR ONLY) */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Configurar Cabeçalho / Menu Superior</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Toggle Enabled */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="text-sm font-bold text-white block">Exibir Cabeçalho na Página</span>
                <span className="text-xs text-zinc-400">Ativa a barra de navegação no topo da LP</span>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateConfig({ enabled: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Sticky Header Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="text-sm font-bold text-white block">Cabeçalho Fixo ao Rolar (Sticky)</span>
                <span className="text-xs text-zinc-400">Permanece visível no topo durante o scroll</span>
              </div>
              <input
                type="checkbox"
                checked={config.sticky !== false}
                onChange={(e) => updateConfig({ sticky: e.target.checked })}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Logo Config */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">Texto / Nome da Marca no Logo</label>
              <input
                type="text"
                value={config.logoText}
                onChange={(e) => updateConfig({ logoText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
              />
            </div>

            {/* Links List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300">Links de Navegação</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Link</span>
                </button>
              </div>

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
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <select
                    value={link.targetSectionId}
                    onChange={(e) => handleUpdateLink(link.id, { targetSectionId: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300"
                  >
                    <option value="hero">Hero / Topo</option>
                    <option value="bentoGrid">Bento Grid / Recursos</option>
                    <option value="testimonials">Depoimentos</option>
                    <option value="quiz">Quiz / Diagnóstico</option>
                    <option value="formSection">Formulário / Garantir</option>
                    <option value="faq">FAQ / Perguntas</option>
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

            {/* CTA Config */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-bold text-zinc-300">Texto do Botão de Ação (CTA)</label>
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => updateConfig({ ctaText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg cursor-pointer"
            >
              Concluído
            </button>
          </div>
        </div>
      )}
    </>
  );
};
