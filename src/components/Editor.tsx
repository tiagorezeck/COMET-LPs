import React, { useState, useEffect } from "react";
import {
  LandingPage,
  AccentColor,
  TextAlign,
  FontSize,
  CardRadius,
  CardPadding,
  ContainerWidth,
  LogoColorMode,
  HeroModel,
  MarqueeSpeed,
} from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { LandingPageRenderer } from "./LandingPageRenderer";
import { generateStandaloneHtml } from "../utils/htmlExporter";
import { DynamicIcon } from "./DynamicIcon";
import { ImagePickerModal } from "./ImagePickerModal";
import { LogoManagerModal } from "./LogoManagerModal";
import { IconPickerModal } from "./IconPickerModal";
import { HeroModelSelector } from "./HeroModelSelector";
import { NetworkPreviewModal } from "./NetworkPreviewModal";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Save,
  Download,
  Sparkles,
  Layers,
  Edit3,
  Image as ImageIcon,
  Video,
  Share2,
  Check,
  Globe,
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Send,
  Zap,
  HelpCircle,
  ExternalLink,
  Code,
  CheckCircle2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Minimize2,
  Sliders,
  Palette,
  Camera,
  GripVertical,
  RotateCcw,
  Columns,
  Box,
  Type,
  ArrowUp,
  ArrowDown,
  PanelLeftClose,
  PanelLeftOpen,
  Expand,
  Shrink,
  Sun,
  Moon,
} from "lucide-react";

interface EditorProps {
  page: LandingPage;
  onSave: (page: LandingPage) => void;
  onBackToDashboard: () => void;
}

type EditorTab = "content" | "layout" | "sections" | "media" | "ai" | "webhook";
type DeviceView = "desktop" | "tablet" | "mobile";

export const Editor: React.FC<EditorProps> = ({ page: initialPage, onSave, onBackToDashboard }) => {
  const [page, setPage] = useState<LandingPage>(initialPage);
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [activeSectionEdit, setActiveSectionEdit] = useState<string>("hero");
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  // Sync with browser fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Modal states for direct image and logo editing
  const [imagePickerConfig, setImagePickerConfig] = useState<{
    isOpen: boolean;
    type: "hero" | "bento" | "testimonial" | "avatar";
    currentUrl: string;
    itemId?: string;
    title: string;
    initialPositionX?: number;
    initialPositionY?: number;
    initialZoom?: number;
  }>({
    isOpen: false,
    type: "hero",
    currentUrl: "",
    title: "Trocar Imagem",
  });

  const [isLogoManagerOpen, setIsLogoManagerOpen] = useState(false);
  const [isHeroModelModalOpen, setIsHeroModelModalOpen] = useState(false);
  const [isNetworkPreviewOpen, setIsNetworkPreviewOpen] = useState(false);

  // Icon picker state
  const [iconPickerConfig, setIconPickerConfig] = useState<{
    isOpen: boolean;
    currentIcon: string;
    onSelect: (icon: string) => void;
    title: string;
  }>({
    isOpen: false,
    currentIcon: "Zap",
    onSelect: () => {},
    title: "Escolher Ícone",
  });

  // Drag & Drop reorder tracking
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);

  // AI Assistant in Editor
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ result: string; alternatives: string[]; reasoning: string } | null>(null);

  // Webhook test state
  const [webhookTestStatus, setWebhookTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [webhookResponseMsg, setWebhookResponseMsg] = useState("");

  const theme = THEME_CONFIGS[page.accentColor] || THEME_CONFIGS.purple;

  const handleSave = () => {
    setSaveStatus("saving");
    onSave(page);
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 400);
  };

  const handleExportHtml = () => {
    // Explicitly persist current editor page state to parent/local storage
    onSave(page);
    const htmlContent = generateStandaloneHtml(page);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug || "landing-page"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification("Arquivo HTML exportado com sucesso!");
  };

  const showNotification = (msg: string) => {
    setCopyNotification(msg);
    setTimeout(() => setCopyNotification(null), 3000);
  };

  const updatePage = (updater: (prev: LandingPage) => LandingPage) => {
    setPage((prev) => {
      const updated = updater(prev);
      const withTime = { ...updated, updatedAt: new Date().toISOString() };
      // Safely propagate changes back to parent and local storage on the next tick
      setTimeout(() => {
        onSave(withTime);
      }, 0);
      return withTime;
    });
  };

  // Section drag-and-drop & ordering
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const order = page.sectionOrder || ["hero", "socialProof", "quiz", "bentoGrid", "testimonials", "formSection", "faq"];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;

    const newOrder = [...order];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    updatePage((p) => ({ ...p, sectionOrder: newOrder }));
  };

  // Card reordering helpers
  const handleMoveBentoCard = (index: number, direction: "up" | "down") => {
    const items = [...page.bentoGrid.items];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    updatePage((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, items } }));
  };

  const handleMoveTestimonialCard = (index: number, direction: "up" | "down") => {
    const items = [...page.testimonials.items];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    updatePage((p) => ({ ...p, testimonials: { ...p.testimonials, items } }));
  };

  const handleMoveQuizQuestion = (index: number, direction: "up" | "down") => {
    const items = [...page.quiz.questions];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    updatePage((p) => ({ ...p, quiz: { ...p.quiz, questions: items } }));
  };

  // Apply selected image from modal
  const handleApplyImage = (
    newUrl: string,
    framing?: { positionX?: number; positionY?: number; zoom?: number }
  ) => {
    const { type, itemId } = imagePickerConfig;
    if (type === "hero") {
      updatePage((p) => ({
        ...p,
        hero: {
          ...p.hero,
          imageUrl: newUrl,
          videoThumbnail: newUrl,
          ...(framing?.positionX !== undefined ? { imagePositionX: framing.positionX } : {}),
          ...(framing?.positionY !== undefined ? { imagePositionY: framing.positionY } : {}),
          ...(framing?.zoom !== undefined ? { imageZoom: framing.zoom } : {}),
        },
      }));
    } else if (type === "bento" && itemId) {
      updatePage((p) => ({
        ...p,
        bentoGrid: {
          ...p.bentoGrid,
          items: p.bentoGrid.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  imageUrl: newUrl,
                  ...(framing?.positionX !== undefined ? { imagePositionX: framing.positionX } : {}),
                  ...(framing?.positionY !== undefined ? { imagePositionY: framing.positionY } : {}),
                  ...(framing?.zoom !== undefined ? { imageZoom: framing.zoom } : {}),
                }
              : item
          ),
        },
      }));
    } else if ((type === "avatar" || type === "testimonial") && itemId) {
      updatePage((p) => ({
        ...p,
        testimonials: {
          ...p.testimonials,
          items: p.testimonials.items.map((t) =>
            t.id === itemId
              ? {
                  ...t,
                  avatarUrl: newUrl,
                  screenshotUrl: type === "testimonial" ? newUrl : t.screenshotUrl,
                  ...(framing?.positionX !== undefined ? { imagePositionX: framing.positionX } : {}),
                  ...(framing?.positionY !== undefined ? { imagePositionY: framing.positionY } : {}),
                  ...(framing?.zoom !== undefined ? { imageZoom: framing.zoom } : {}),
                }
              : t
          ),
        },
      }));
    }
    showNotification("Imagem e enquadramento atualizados!");
  };

  const handleAiRefine = async (action: string, currentText: string) => {
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/refine-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          currentText,
          context: `Landing Page no nicho de ${page.niche} para a região de ${page.cityOrRegion}`,
          tone: "Agressivo, persuasivo, alta conversão de alto ticket",
          cityOrRegion: page.cityOrRegion,
          customInstruction: aiPrompt || "Melhore a copy mantendo o foco em benefícios e quebra de objeções.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data);
      }
    } catch (err) {
      console.error("AI refine error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const SECTION_LIST = [
    { id: "hero", label: "1. Hero Principal" },
    { id: "socialProof", label: "2. Prova Social & Logos" },
    { id: "quiz", label: "3. Quiz de Qualificação" },
    { id: "bentoGrid", label: "4. Bento Grid / Método" },
    { id: "testimonials", label: "5. Depoimentos" },
    { id: "formSection", label: "6. Formulário de Captura" },
    { id: "faq", label: "7. Perguntas Frequentes" },
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {copyNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-zinc-900 border border-emerald-500/50 text-emerald-300 font-semibold text-xs sm:text-sm shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{copyNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Image Picker Modal */}
      <ImagePickerModal
        isOpen={imagePickerConfig.isOpen}
        onClose={() => setImagePickerConfig((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={imagePickerConfig.currentUrl}
        onSelectImage={handleApplyImage}
        title={imagePickerConfig.title}
        targetType={imagePickerConfig.type}
      />

      {/* Interactive Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerConfig.isOpen}
        onClose={() => setIconPickerConfig((prev) => ({ ...prev, isOpen: false }))}
        currentIconName={iconPickerConfig.currentIcon}
        onSelectIcon={(iconName) => {
          iconPickerConfig.onSelect(iconName);
          showNotification(`Ícone "${iconName}" aplicado!`);
        }}
        title={iconPickerConfig.title}
      />

      {/* Network & Standalone Preview Modal */}
      <NetworkPreviewModal
        isOpen={isNetworkPreviewOpen}
        onClose={() => setIsNetworkPreviewOpen(false)}
        page={page}
      />

      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 flex-shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={page.title}
              onChange={(e) => updatePage((p) => ({ ...p, title: e.target.value }))}
              className="bg-transparent font-bold text-sm sm:text-base text-white hover:bg-zinc-900/60 px-2 py-1 rounded-lg border border-transparent hover:border-zinc-800 focus:border-purple-500 focus:outline-none transition-colors w-44 sm:w-80 truncate"
            />
            <div className="flex items-center gap-2 px-2 text-[11px] text-zinc-500">
              <span>{page.niche}</span>
              <span>•</span>
              <span>{page.cityOrRegion}</span>
            </div>
          </div>
        </div>

        {/* Center: Fullscreen & Device Switcher (Notebook, Tablet, Mobile) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Fullscreen / Expand Screen Icon Button (First, ahead of device modes) */}
          <button
            onClick={handleToggleFullscreen}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
              isFullscreen
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-950/50"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
            }`}
            title={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia (F11 / Preview Completo)"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Device Switcher (Notebook, Tablet, Mobile) - Icon-only with hover labels */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setDeviceView("desktop")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                deviceView === "desktop" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
              title="Notebook / Desktop"
            >
              <Monitor className="w-4 h-4" />
              <span className="sr-only">Notebook</span>
            </button>
            <button
              onClick={() => setDeviceView("tablet")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                deviceView === "tablet" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
              <span className="sr-only">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                deviceView === "mobile" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
              <span className="sr-only">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-nowrap">
          {/* Theme Mode Toggle (Escuro / Claro) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => updatePage((p) => ({ ...p, theme: "dark" }))}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                page.theme !== "light"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Mudar para Tema Escuro (Fundo Dark Moderno)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Escuro</span>
            </button>
            <button
              type="button"
              onClick={() => updatePage((p) => ({ ...p, theme: "light" }))}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                page.theme === "light"
                  ? "bg-amber-500 text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Mudar para Tema Claro (Fundo 100% Branco com elementos na cor escolhida)"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Claro (Branco)</span>
            </button>
          </div>

          {/* Accent Color Picker (Dropdown) */}
          <div className="hidden md:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-xl text-xs text-white">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400 font-bold">Cor:</span>
            <select
              value={page.accentColor}
              onChange={(e) => updatePage((p) => ({ ...p, accentColor: e.target.value as AccentColor }))}
              className="bg-zinc-950 text-white font-bold py-1 px-2 rounded-lg border border-zinc-800 outline-none cursor-pointer focus:border-purple-500"
            >
              <option value="purple">Cyber Purple (Roxo)</option>
              <option value="emerald">Verde Esmeralda</option>
              <option value="cyan">Electric Cyan (Ciano)</option>
              <option value="amber">Sunset Amber (Âmbar)</option>
              <option value="rose">Rosa Crimson (Rosa)</option>
              <option value="orange">Laranja Degradê</option>
              <option value="blue">Azul Royal</option>
              <option value="indigo">Índigo Profundo</option>
              <option value="red">Vermelho Fogo</option>
              <option value="teal">Verde Água</option>
              <option value="gray">Grafite (Cinza)</option>
            </select>
          </div>

          {/* Link Teste (Network Preview / Share Modal) */}
          <button
            onClick={() => {
              onSave(page);
              setIsNetworkPreviewOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/80 text-purple-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-950/40"
            title="Link de Teste (Visualizar em outro navegador ou celular via QR Code / URL)"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Link Teste</span>
          </button>

          {/* Toggle Full Preview */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPreviewMode
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{isPreviewMode ? "Editor" : "Visualizar"}</span>
          </button>

          {/* Export HTML */}
          <button
            onClick={handleExportHtml}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exportar HTML Standalone"
          >
            <Download className="w-4 h-4" />
            <span>HTML</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer whitespace-nowrap"
          >
            {saveStatus === "saving" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveStatus === "saved" ? "Salvo!" : "Salvar"}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Split into Sidebar & Center Canvas */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Sidebar (Inspector & Customization Tools) */}
        {!isPreviewMode && !isSidebarCollapsed && (
          <aside className="w-80 sm:w-96 border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex flex-col z-20 overflow-hidden flex-shrink-0 h-full">
            {/* Sidebar Title & Collapse Button */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>PAINEL DE EDIÇÃO</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Recolher barra lateral de edição"
              >
                <PanelLeftClose className="w-4 h-4 text-purple-400" />
                <span>Recolher</span>
              </button>
            </div>

            {/* Sidebar Main Tabs */}
            <div className="flex items-center border-b border-zinc-800 px-2 py-2 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "content"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Conteúdo</span>
              </button>

              <button
                onClick={() => setActiveTab("layout")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "layout"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Design & Cards</span>
              </button>

              <button
                onClick={() => setActiveTab("sections")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "sections"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ordem</span>
              </button>

              <button
                onClick={() => setActiveTab("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "media"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Mídia</span>
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "ai"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>IA CRO</span>
              </button>

              <button
                onClick={() => setActiveTab("webhook")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "webhook"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Webhook</span>
              </button>
            </div>

            {/* Sub-Header: Section Navigator */}
            {(activeTab === "content" || activeTab === "layout") && (
              <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/30">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {SECTION_LIST.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSectionEdit(sec.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        activeSectionEdit === sec.id
                          ? "bg-zinc-800 text-white border border-zinc-700"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* 1. LAYOUT & VISUAL STYLING TAB */}
              {activeTab === "layout" && (
                <div className="space-y-6">
                  {/* GLOBAL THEME & BACKGROUND OPTIONS */}
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <span>Tema Global da Página (Claro / Escuro)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => updatePage((p) => ({ ...p, theme: "dark" }))}
                        className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          page.theme !== "light"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-900/50"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>🌙 Escuro</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updatePage((p) => ({ ...p, theme: "light" }))}
                        className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          page.theme === "light"
                            ? "bg-amber-500 text-zinc-950 font-extrabold shadow-md shadow-amber-900/30"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        <Sun className="w-4 h-4 text-zinc-950" />
                        <span>☀️ Claro (Branco)</span>
                      </button>
                    </div>

                    {/* ACCENT COLOR SELECTION */}
                    <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <span>Cor de Destaque do Tema</span>
                      </span>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          value={page.accentColor}
                          onChange={(e) => updatePage((p) => ({ ...p, accentColor: e.target.value as AccentColor }))}
                          className="w-full bg-zinc-950 text-white font-bold py-2 px-3 rounded-xl border border-zinc-800 outline-none cursor-pointer focus:border-purple-500 text-xs text-left"
                        >
                          <option value="purple">Cyber Purple (Roxo)</option>
                          <option value="emerald">Verde Esmeralda</option>
                          <option value="cyan">Electric Cyan (Ciano)</option>
                          <option value="amber">Sunset Amber (Âmbar)</option>
                          <option value="rose">Rosa Crimson (Rosa)</option>
                          <option value="orange">Laranja Degradê</option>
                          <option value="blue">Azul Royal</option>
                          <option value="indigo">Índigo Profundo</option>
                          <option value="red">Vermelho Fogo</option>
                          <option value="teal">Verde Água</option>
                          <option value="gray">Grafite (Cinza)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] text-zinc-400 font-bold block">Tonalidade da Cor</span>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px] font-bold">
                          {(["light", "normal", "dark"] as const).map((s) => {
                            const label = s === "light" ? "Claro" : s === "dark" ? "Escuro" : "Padrão";
                            const isSelected = (page.accentShade || "normal") === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => updatePage((p) => ({ ...p, accentShade: s }))}
                                className={`py-1 rounded-lg transition-all cursor-pointer text-center ${
                                  isSelected ? "bg-purple-600 text-white shadow" : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Header Navigation Toggle */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-1 bg-purple-950/20 p-3 rounded-xl border border-purple-500/20 shadow-md shadow-purple-950/20">
                      <div>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          <span>Menu Superior (Cabeçalho)</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5 leading-snug">Habilitar barra de links e botão CTA fixa no topo</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updatePage((p) => ({
                            ...p,
                            headerNav: {
                              ...p.headerNav,
                              logoType: p.headerNav?.logoType || "text",
                              logoText: p.headerNav?.logoText || "COMET.LP",
                              ctaText: p.headerNav?.ctaText || "Quero uma Bolsa",
                              ctaTargetSectionId: p.headerNav?.ctaTargetSectionId || "formSection",
                              links: p.headerNav?.links || [
                                { id: "l1", label: "Cursos", targetSectionId: "bentoGrid" },
                                { id: "l2", label: "Por que a People?", targetSectionId: "bentoGrid" },
                                { id: "l3", label: "Depoimentos", targetSectionId: "testimonials" },
                                { id: "l4", label: "Faq", targetSectionId: "faq" },
                              ],
                              enabled: !(page.headerNav?.enabled),
                            },
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          page.headerNav?.enabled
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white"
                        }`}
                      >
                        {page.headerNav?.enabled ? "Habilitado" : "Desabilitado"}
                      </button>
                    </div>
                  </div>

                  {/* HERO VISUAL CONTROLS */}
                  {activeSectionEdit === "hero" && (
                    <div className="space-y-5">
                      {/* Text Alignment */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Posicionamento do Texto & Headline
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "left", label: "Esquerda", icon: AlignLeft },
                            { id: "center", label: "Centro", icon: AlignCenter },
                            { id: "right", label: "Direita", icon: AlignRight },
                            { id: "justify", label: "Justificado", icon: AlignJustify },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = (page.hero.align || "center") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, align: item.id as TextAlign },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                                title={item.label}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Headline Size with Extra Small options */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-zinc-300">
                            Tamanho do Título (Headline)
                          </label>
                          <span className="text-[10px] text-purple-400 font-mono font-bold">
                            {page.hero.headlineSize || "base"}
                          </span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-[10px]">
                          {[
                            { id: "2xs", label: "2XS" },
                            { id: "xs", label: "XS" },
                            { id: "sm", label: "SM" },
                            { id: "base", label: "MD" },
                            { id: "lg", label: "LG" },
                            { id: "xl", label: "XL" },
                            { id: "2xl", label: "2XL" },
                          ].map((size) => {
                            const isSelected = (page.hero.headlineSize || "base") === size.id;
                            return (
                              <button
                                key={size.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, headlineSize: size.id as FontSize },
                                  }))
                                }
                                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {size.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Subheadline Size and Align */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-zinc-300">
                            Tamanho da Descrição (Subheadline)
                          </label>
                          <span className="text-[10px] text-purple-400 font-mono font-bold">
                            {page.hero.subheadlineSize || "base"}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-[10px]">
                          {[
                            { id: "xs", label: "XS" },
                            { id: "sm", label: "SM" },
                            { id: "base", label: "MD" },
                            { id: "lg", label: "LG" },
                            { id: "xl", label: "XL" },
                          ].map((size) => {
                            const isSelected = (page.hero.subheadlineSize || "base") === size.id;
                            return (
                              <button
                                key={size.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, subheadlineSize: size.id as FontSize },
                                  }))
                                }
                                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {size.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Media Card Controls: Position, Orientation, Width & Max Height */}
                      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Card de Mídia (Imagem / Vídeo)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                            Arrastável & Redimensionável
                          </span>
                        </div>

                        {/* Media Position */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-zinc-400">
                            Posição do Card de Mídia
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, mediaPosition: "left" },
                                }))
                              }
                              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                (page.hero.mediaPosition || "right") === "left"
                                  ? "bg-purple-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              ⬅ Esquerda
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, mediaPosition: "right" },
                                }))
                              }
                              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                (page.hero.mediaPosition || "right") === "right"
                                  ? "bg-purple-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              Direita ➡
                            </button>
                          </div>
                        </div>

                        {/* Media Orientation */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-zinc-400">
                            Orientação da Mídia
                          </label>
                          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px]">
                            {[
                              { id: "horizontal", label: "Horizontal" },
                              { id: "vertical", label: "Vertical" },
                              { id: "square", label: "1:1" },
                              { id: "free", label: "Livre" },
                            ].map((ori) => {
                              const isSel = (page.hero.mediaOrientation || "horizontal") === ori.id;
                              return (
                                <button
                                  key={ori.id}
                                  type="button"
                                  onClick={() =>
                                    updatePage((p) => ({
                                      ...p,
                                      hero: { ...p.hero, mediaOrientation: ori.id as any },
                                    }))
                                  }
                                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                                    isSel
                                      ? "bg-purple-600 text-white"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  {ori.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Width Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                            <span>Largura do Card no Layout</span>
                            <span className="text-purple-300 font-mono font-bold">
                              {page.hero.mediaWidthPercent || 44}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="25"
                            max="70"
                            step="1"
                            value={page.hero.mediaWidthPercent || 44}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updatePage((p) => ({
                                ...p,
                                hero: { ...p.hero, mediaWidthPercent: val },
                              }));
                            }}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>

                        {/* Max Height Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                            <span>Altura Máxima (px)</span>
                            <span className="text-purple-300 font-mono font-bold">
                              {page.hero.mediaMaxHeightPx || 480}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="220"
                            max="800"
                            step="20"
                            value={page.hero.mediaMaxHeightPx || 480}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updatePage((p) => ({
                                ...p,
                                hero: { ...p.hero, mediaMaxHeightPx: val },
                              }));
                            }}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>

                        {/* Vertical Offset (Move Up / Down) */}
                        <div className="space-y-2 pt-1 border-t border-zinc-800">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                            <span className="flex items-center gap-1">
                              <span>Posição Vertical (Mover Cima / Baixo)</span>
                            </span>
                            <span className="text-cyan-300 font-mono font-bold">
                              {page.hero.mediaOffsetY ? `${page.hero.mediaOffsetY > 0 ? '+' : ''}${page.hero.mediaOffsetY}px` : "0px (Padrão)"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-250"
                            max="250"
                            step="5"
                            value={page.hero.mediaOffsetY || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updatePage((p) => ({
                                ...p,
                                hero: { ...p.hero, mediaOffsetY: val },
                              }));
                            }}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <div className="grid grid-cols-3 gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, mediaOffsetY: (p.hero.mediaOffsetY || 0) - 30 },
                                }))
                              }
                              className="py-1 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold cursor-pointer"
                            >
                              ⬆ Subir (-30px)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, mediaOffsetY: 0 },
                                }))
                              }
                              className="py-1 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold cursor-pointer"
                            >
                              Centralizar (0px)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, mediaOffsetY: (p.hero.mediaOffsetY || 0) + 30 },
                                }))
                              }
                              className="py-1 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold cursor-pointer"
                            >
                              ⬇ Descer (+30px)
                            </button>
                          </div>
                        </div>

                        {/* Reset to Original Button */}
                        <div className="pt-2 border-t border-zinc-800">
                          <button
                            type="button"
                            onClick={() =>
                              updatePage((p) => ({
                                ...p,
                                hero: {
                                  ...p.hero,
                                  mediaWidthPercent: undefined,
                                  mediaMaxHeightPx: undefined,
                                  mediaOffsetY: 0,
                                  mediaOrientation: p.hero.model === "split_video" ? "vertical" : "horizontal",
                                },
                              }))
                            }
                            className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-amber-950/60 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                            <span>Restaurar Tamanho e Posição Original</span>
                          </button>
                        </div>
                      </div>

                      {/* Container Width */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Largura da Seção (Container)
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "narrow", label: "Estreito" },
                            { id: "normal", label: "Padrão" },
                            { id: "wide", label: "Amplo" },
                          ].map((w) => {
                            const isSelected = (page.hero.containerWidth || "normal") === w.id;
                            return (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, containerWidth: w.id as ContainerWidth },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {w.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Change Hero Media Directly */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setImagePickerConfig({
                              isOpen: true,
                              type: "hero",
                              currentUrl: page.hero.videoThumbnail || page.hero.imageUrl,
                              title: "Trocar Imagem / Capa do Hero",
                            })
                          }
                          className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Camera className="w-4 h-4 text-purple-400" />
                          <span>Trocar Imagem / Capa do Hero</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SOCIAL PROOF VISUAL CONTROLS */}
                  {activeSectionEdit === "socialProof" && (
                    <div className="space-y-5">
                      {/* Logo Color Style */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Estilo Visual das Logos
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "accent", label: "Cor Tema" },
                            { id: "original", label: "Original" },
                            { id: "monochrome", label: "Clean" },
                          ].map((mode) => {
                            const isSelected = (page.socialProof.logoColorMode || "accent") === mode.id;
                            return (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: {
                                      ...p.socialProof,
                                      logoColorMode: mode.id as LogoColorMode,
                                    },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {mode.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Marquee Speed Selector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-zinc-300">
                            Velocidade dos Logos
                          </label>
                          <span className="text-[11px] text-purple-400 font-semibold">
                            {(page.socialProof.marqueeSpeed || "medium") === "stopped"
                              ? "Parado (Fixo)"
                              : (page.socialProof.marqueeSpeed || "medium") === "slow"
                              ? "Lento (80s)"
                              : (page.socialProof.marqueeSpeed || "medium") === "fast"
                              ? "Rápido (30s)"
                              : "Médio (50s)"}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "stopped", label: "Parado", desc: "Fixo" },
                            { id: "slow", label: "Lento", desc: "80s" },
                            { id: "medium", label: "Médio", desc: "50s" },
                            { id: "fast", label: "Rápido", desc: "30s" },
                          ].map((sp) => {
                            const isSelected = (page.socialProof.marqueeSpeed || "medium") === sp.id;
                            return (
                              <button
                                key={sp.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: {
                                      ...p.socialProof,
                                      marqueeSpeed: sp.id as MarqueeSpeed,
                                    },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {sp.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Radius */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Arredondamento dos Cards de Métricas
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "sm", label: "Leve" },
                            { id: "lg", label: "Médio" },
                            { id: "xl", label: "Suave" },
                            { id: "3xl", label: "Total" },
                          ].map((r) => {
                            const isSelected = (page.socialProof.cardRadius || "xl") === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: {
                                      ...p.socialProof,
                                      cardRadius: r.id as CardRadius,
                                    },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {r.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Padding */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Espaçamento Interno (Padding)
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "compact", label: "Compacto" },
                            { id: "normal", label: "Normal" },
                            { id: "spacious", label: "Espaçoso" },
                          ].map((pad) => {
                            const isSelected = (page.socialProof.cardPadding || "normal") === pad.id;
                            return (
                              <button
                                key={pad.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: {
                                      ...p.socialProof,
                                      cardPadding: pad.id as CardPadding,
                                    },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {pad.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Open Logo Manager Button */}
                      <button
                        type="button"
                        onClick={() => setIsLogoManagerOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Gerenciar Lista de Logos do Letreiro</span>
                      </button>
                    </div>
                  )}

                  {/* BENTO GRID VISUAL CONTROLS */}
                  {activeSectionEdit === "bentoGrid" && (
                    <div className="space-y-5">
                      {/* Alignment */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Alinhamento dos Títulos do Bento Grid
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "left", label: "Esquerda", icon: AlignLeft },
                            { id: "center", label: "Centro", icon: AlignCenter },
                            { id: "right", label: "Direita", icon: AlignRight },
                            { id: "justify", label: "Justificado", icon: AlignJustify },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = (page.bentoGrid.align || "center") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    bentoGrid: { ...p.bentoGrid, align: item.id as TextAlign },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Number of Columns */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Colunas do Grid (Disposição)
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: 2, label: "2 Colunas" },
                            { id: 3, label: "3 Colunas (Padrão)" },
                            { id: 4, label: "4 Colunas" },
                          ].map((col) => {
                            const isSelected = (page.bentoGrid.columns || 3) === col.id;
                            return (
                              <button
                                key={col.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    bentoGrid: { ...p.bentoGrid, columns: col.id as any },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {col.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Radius */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Arredondamento dos Cards
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "sm", label: "Leve" },
                            { id: "lg", label: "Médio" },
                            { id: "xl", label: "Suave" },
                            { id: "3xl", label: "Super" },
                          ].map((r) => {
                            const isSelected = (page.bentoGrid.cardRadius || "xl") === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    bentoGrid: { ...p.bentoGrid, cardRadius: r.id as CardRadius },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {r.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Reordering list (Drag and Drop / Move) */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Reordenar Cards do Bento Grid
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {page.bentoGrid.items.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
                                <span className="font-semibold text-white truncate">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveBentoCard(idx, "up")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === page.bentoGrid.items.length - 1}
                                  onClick={() => handleMoveBentoCard(idx, "down")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TESTIMONIALS VISUAL CONTROLS */}
                  {activeSectionEdit === "testimonials" && (
                    <div className="space-y-5">
                      {/* Alignment */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Alinhamento do Título da Seção
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "left", label: "Esquerda", icon: AlignLeft },
                            { id: "center", label: "Centro", icon: AlignCenter },
                            { id: "right", label: "Direita", icon: AlignRight },
                            { id: "justify", label: "Justificado", icon: AlignJustify },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = (page.testimonials.align || "center") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    testimonials: { ...p.testimonials, align: item.id as TextAlign },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Columns */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Colunas de Depoimentos
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: 2, label: "2 Colunas" },
                            { id: 3, label: "3 Colunas" },
                            { id: 4, label: "4 Colunas" },
                          ].map((col) => {
                            const isSelected = (page.testimonials.columns || 3) === col.id;
                            return (
                              <button
                                key={col.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    testimonials: { ...p.testimonials, columns: col.id as any },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {col.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Reordering */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Reordenar Depoimentos
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {page.testimonials.items.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
                                <span className="font-semibold text-white truncate">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveTestimonialCard(idx, "up")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === page.testimonials.items.length - 1}
                                  onClick={() => handleMoveTestimonialCard(idx, "down")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FORM VISUAL CONTROLS */}
                  {activeSectionEdit === "formSection" && (
                    <div className="space-y-5">
                      {/* Alignment */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Alinhamento do Título do Formulário
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "left", label: "Esquerda", icon: AlignLeft },
                            { id: "center", label: "Centro", icon: AlignCenter },
                            { id: "right", label: "Direita", icon: AlignRight },
                            { id: "justify", label: "Justificado", icon: AlignJustify },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = (page.formSection.align || "center") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    formSection: { ...p.formSection, align: item.id as TextAlign },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Width */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Largura do Card do Formulário
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "narrow", label: "Focado (Padrão)" },
                            { id: "normal", label: "Médio" },
                            { id: "wide", label: "Largo" },
                          ].map((w) => {
                            const isSelected = (page.formSection.cardWidth || "narrow") === w.id;
                            return (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    formSection: { ...p.formSection, cardWidth: w.id as ContainerWidth },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                {w.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QUIZ VISUAL CONTROLS */}
                  {activeSectionEdit === "quiz" && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-300">
                          Alinhamento do Título do Quiz
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                          {[
                            { id: "left", label: "Esquerda", icon: AlignLeft },
                            { id: "center", label: "Centro", icon: AlignCenter },
                            { id: "right", label: "Direita", icon: AlignRight },
                            { id: "justify", label: "Justificado", icon: AlignJustify },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = (page.quiz.align || "center") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  updatePage((p) => ({
                                    ...p,
                                    quiz: { ...p.quiz, align: item.id as TextAlign },
                                  }))
                                }
                                className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reorder Questions */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Reordenar Etapas do Quiz
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {page.quiz.questions.map((q, idx) => (
                            <div
                              key={q.id || idx}
                              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
                                <span className="font-semibold text-white truncate">
                                  {idx + 1}. {q.question}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveQuizQuestion(idx, "up")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === page.quiz.questions.length - 1}
                                  onClick={() => handleMoveQuizQuestion(idx, "down")}
                                  className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CONTENT TAB */}
              {activeTab === "content" && (
                <div className="space-y-5">
                  {/* HERO CONTENT */}
                  {activeSectionEdit === "hero" && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                          Editar Seção 1: Hero Principal
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsHeroModelModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3 h-3 text-purple-400" />
                          <span>Mudar Modelo (6)</span>
                        </button>
                      </div>

                      {/* Model Selector Card */}
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 font-medium">Modelo Ativo:</span>
                          <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/60 text-[11px]">
                            {page.hero.model === "split_video" && "Modelo 2: VSL Vertical"}
                            {page.hero.model === "centered_showcase" && "Modelo 3: Vitrine Centralizada"}
                            {page.hero.model === "split_lead_form" && "Modelo 4: Captura Direta (Form)"}
                            {page.hero.model === "b2b_metrics" && "Modelo 5: B2B & Consultoria"}
                            {page.hero.model === "editorial_ebook" && "Modelo 6: Editorial E-book"}
                            {(!page.hero.model || page.hero.model === "split_image") && "Modelo 1: Split com Imagem"}
                          </span>
                        </div>

                        <select
                          value={page.hero.model || "split_image"}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, model: e.target.value as HeroModel },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="split_image">Modelo 1: Split com Imagem / Mockup</option>
                          <option value="split_video">Modelo 2: VSL Vertical & Avaliação Flutuante</option>
                          <option value="centered_showcase">Modelo 3: Vitrine Centralizada & Métricas</option>
                          <option value="split_lead_form">Modelo 4: Captura Direta com Formulário Embutido</option>
                          <option value="b2b_metrics">Modelo 5: Consultoria B2B com Métricas e 2 Botões</option>
                          <option value="editorial_ebook">Modelo 6: Editorial / E-book Clássico Imersivo</option>
                        </select>
                      </div>

                      {/* Badge Superior */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Badge Superior Iluminado
                        </label>
                        <input
                          type="text"
                          value={page.hero.badgeText}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, badgeText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      {/* Headline */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Headline Principal (Impacto Agressivo)
                        </label>
                        <textarea
                          rows={3}
                          value={page.hero.headline}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, headline: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      {/* TYPEWRITER ANIMATION CONTROLS */}
                      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span>Efeito de Digitação (Typewriter)</span>
                          </label>
                          <input
                            type="checkbox"
                            checked={page.hero.typewriterEnabled || false}
                            onChange={(e) =>
                              updatePage((p) => ({
                                ...p,
                                hero: { ...p.hero, typewriterEnabled: e.target.checked },
                              }))
                            }
                            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                          />
                        </div>

                        {page.hero.typewriterEnabled && (
                          <div className="space-y-3 pt-2 border-t border-zinc-800">
                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                                Texto Antes (Prefixo)
                              </label>
                              <input
                                type="text"
                                value={page.hero.typewriterPrefix || ""}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, typewriterPrefix: e.target.value },
                                  }))
                                }
                                placeholder="Ex: Transforme sua"
                                className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                                Palavras em Animação (Trocam Automaticamente)
                              </label>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {(page.hero.typewriterWords || ["Curso", "Carreira", "Vida", "Profissão", "Competência"]).map(
                                  (word, wIdx) => (
                                    <span
                                      key={wIdx}
                                      className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center gap-1.5"
                                    >
                                      <span>{word}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextWords = (
                                            page.hero.typewriterWords || ["Curso", "Carreira", "Vida", "Profissão", "Competência"]
                                          ).filter((_, i) => i !== wIdx);
                                          updatePage((p) => ({
                                            ...p,
                                            hero: { ...p.hero, typewriterWords: nextWords },
                                          }));
                                        }}
                                        className="hover:text-red-400 cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  )
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  id="new-typewriter-word-input"
                                  placeholder="Nova palavra..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const val = (e.target as HTMLInputElement).value.trim();
                                      if (val) {
                                        const current = page.hero.typewriterWords || ["Curso", "Carreira", "Vida", "Profissão", "Competência"];
                                        updatePage((p) => ({
                                          ...p,
                                          hero: { ...p.hero, typewriterWords: [...current, val] },
                                        }));
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById(
                                      "new-typewriter-word-input"
                                    ) as HTMLInputElement;
                                    if (input && input.value.trim()) {
                                      const val = input.value.trim();
                                      const current = page.hero.typewriterWords || ["Curso", "Carreira", "Vida", "Profissão", "Competência"];
                                      updatePage((p) => ({
                                        ...p,
                                        hero: { ...p.hero, typewriterWords: [...current, val] },
                                      }));
                                      input.value = "";
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Adicionar</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                                Texto Depois (Sufixo)
                              </label>
                              <input
                                type="text"
                                value={page.hero.typewriterSuffix || ""}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, typewriterSuffix: e.target.value },
                                  }))
                                }
                                placeholder="Ex: com nosso método de alta conversão"
                                className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                              />
                            </div>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                              <div>
                                <span className="text-[11px] font-bold text-white block">Exibir cursor de digitação (|)</span>
                                <span className="text-[10px] text-zinc-400">Mostra o cursor piscando no final da palavra</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={page.hero.typewriterShowCursor !== false}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, typewriterShowCursor: e.target.checked },
                                  }))
                                }
                                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subheadline */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Subtítulo (Quebra de Objeções)
                        </label>
                        <textarea
                          rows={3}
                          value={page.hero.subheadline}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, subheadline: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      {/* Dynamic Model 4 Fields: Direct Lead Form */}
                      {page.hero.model === "split_lead_form" && (
                        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-3">
                          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-purple-400" />
                            <span>Campos do Formulário Embutido (Modelo 4)</span>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Título do Formulário de Captura
                            </label>
                            <input
                              type="text"
                              value={page.hero.leadFormTitle || "Garanta Sua Vaga VIP"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, leadFormTitle: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Subtítulo do Formulário
                            </label>
                            <input
                              type="text"
                              value={page.hero.leadFormSubtitle || "Preencha para receber o acesso instantâneo"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, leadFormSubtitle: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Texto do Botão de Envio
                            </label>
                            <input
                              type="text"
                              value={page.hero.leadFormButtonText || "Quero Receber Agora"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, leadFormButtonText: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Dynamic Model 5 Fields: B2B & Consultoria */}
                      {page.hero.model === "b2b_metrics" && (
                        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-3">
                          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                            <span>Controles de B2B & Escassez (Modelo 5)</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                Texto do 2º Botão
                              </label>
                              <input
                                type="text"
                                value={page.hero.secondaryCtaText || "Falar com Consultor"}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, secondaryCtaText: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                Link do 2º Botão
                              </label>
                              <input
                                type="text"
                                value={page.hero.secondaryCtaUrl || "#"}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, secondaryCtaUrl: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Rótulo de Escassez / Vagas
                            </label>
                            <input
                              type="text"
                              value={page.hero.scarcityLabel || "Vagas Restantes para Diagnóstico:"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, scarcityLabel: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                Vagas Restantes
                              </label>
                              <input
                                type="number"
                                value={page.hero.scarcityRemainingSlots ?? 4}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, scarcityRemainingSlots: Number(e.target.value) || 0 },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                Total de Vagas
                              </label>
                              <input
                                type="number"
                                value={page.hero.scarcityTotalSlots ?? 10}
                                onChange={(e) =>
                                  updatePage((p) => ({
                                    ...p,
                                    hero: { ...p.hero, scarcityTotalSlots: Number(e.target.value) || 10 },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Model 6 Fields: Editorial E-book */}
                      {page.hero.model === "editorial_ebook" && (
                        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-3">
                          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Configurações Editoriais (Modelo 6)</span>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Nome do Autor / Especialista
                            </label>
                            <input
                              type="text"
                              value={page.hero.authorName || "Por Especialista & Autor Best-Seller"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, authorName: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Formatos Disponíveis
                            </label>
                            <input
                              type="text"
                              value={page.hero.availableFormats || "PDF • Kindle • ePub • Áudio MP3"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, availableFormats: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Texto do Botão Secundário / Amostra
                            </label>
                            <input
                              type="text"
                              value={page.hero.secondaryCtaText || "Ler Amostra Grátis (Capítulo 1)"}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, secondaryCtaText: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Video vs Image URL */}
                      {page.hero.model === "split_video" ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-zinc-400">
                            URL do Vídeo VSL (YouTube / Vimeo / MP4)
                          </label>
                          <input
                            type="text"
                            value={page.hero.videoUrl}
                            onChange={(e) =>
                              updatePage((p) => ({
                                ...p,
                                hero: { ...p.hero, videoUrl: e.target.value },
                              }))
                            }
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-zinc-400">
                            Imagem da Hero
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={page.hero.imageUrl}
                              onChange={(e) =>
                                updatePage((p) => ({
                                  ...p,
                                  hero: { ...p.hero, imageUrl: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePickerConfig({
                                  isOpen: true,
                                  type: "hero",
                                  currentUrl: page.hero.imageUrl,
                                  title: "Selecionar Imagem da Hero",
                                });
                              }}
                              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Trocar</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* CTA & Micro-copy */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Texto do Botão CTA Principal
                        </label>
                        <input
                          type="text"
                          value={page.hero.ctaText}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, ctaText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Micro-texto Abaixo do Botão / Garantia
                        </label>
                        <input
                          type="text"
                          value={page.hero.ctaSubtext}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              hero: { ...p.hero, ctaSubtext: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* SOCIAL PROOF CONTENT */}
                  {activeSectionEdit === "socialProof" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Editar Seção 2: Prova Social & Métricas
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Título do Letreiro de Logos
                        </label>
                        <input
                          type="text"
                          value={page.socialProof.marqueeTitle}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              socialProof: { ...p.socialProof, marqueeTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-400">
                          Métricas Numéricas
                        </label>
                        {page.socialProof.metrics.map((metric, idx) => (
                          <div key={metric.id || idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => {
                                  const updated = [...page.socialProof.metrics];
                                  updated[idx].value = e.target.value;
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: { ...p.socialProof, metrics: updated },
                                  }));
                                }}
                                placeholder="Ex: +R$ 14M"
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-bold"
                              />
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => {
                                  const updated = [...page.socialProof.metrics];
                                  updated[idx].label = e.target.value;
                                  updatePage((p) => ({
                                    ...p,
                                    socialProof: { ...p.socialProof, metrics: updated },
                                  }));
                                }}
                                placeholder="Rótulo"
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QUIZ CONTENT */}
                  {activeSectionEdit === "quiz" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Editar Seção 3: Quiz de Qualificação
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Título do Quiz</label>
                        <input
                          type="text"
                          value={page.quiz.title}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              quiz: { ...p.quiz, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Subtítulo</label>
                        <input
                          type="text"
                          value={page.quiz.subtitle}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              quiz: { ...p.quiz, subtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* BENTO GRID CONTENT */}
                  {activeSectionEdit === "bentoGrid" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Editar Seção 4: Bento Grid do Método
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Título Principal</label>
                        <input
                          type="text"
                          value={page.bentoGrid.title}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              bentoGrid: { ...p.bentoGrid, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Subtítulo</label>
                        <input
                          type="text"
                          value={page.bentoGrid.subtitle}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              bentoGrid: { ...p.bentoGrid, subtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="block text-xs font-medium text-zinc-400">Cards do Método</label>
                        {page.bentoGrid.items.map((item, idx) => (
                          <div key={item.id || idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...page.bentoGrid.items];
                                updated[idx].title = e.target.value;
                                updatePage((p) => ({
                                  ...p,
                                  bentoGrid: { ...p.bentoGrid, items: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white"
                            />
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...page.bentoGrid.items];
                                updated[idx].description = e.target.value;
                                updatePage((p) => ({
                                  ...p,
                                  bentoGrid: { ...p.bentoGrid, items: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FORM CONTENT */}
                  {activeSectionEdit === "formSection" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Editar Seção 6: Formulário de Conversão
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Título do Formulário</label>
                        <input
                          type="text"
                          value={page.formSection.title}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              formSection: { ...p.formSection, title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Texto do Botão</label>
                        <input
                          type="text"
                          value={page.formSection.ctaButtonText}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              formSection: { ...p.formSection, ctaButtonText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Garantia / Selo</label>
                        <input
                          type="text"
                          value={page.formSection.guaranteeText}
                          onChange={(e) =>
                            updatePage((p) => ({
                              ...p,
                              formSection: { ...p.formSection, guaranteeText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* FAQ CONTENT */}
                  {activeSectionEdit === "faq" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Editar Seção 7: Perguntas Frequentes (FAQ)
                      </div>

                      {page.faq.map((faqItem, idx) => (
                        <div key={faqItem.id || idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                          <input
                            type="text"
                            value={faqItem.question}
                            onChange={(e) => {
                              const updated = [...page.faq];
                              updated[idx].question = e.target.value;
                              updatePage((p) => ({ ...p, faq: updated }));
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white"
                          />
                          <textarea
                            rows={2}
                            value={faqItem.answer}
                            onChange={(e) => {
                              const updated = [...page.faq];
                              updated[idx].answer = e.target.value;
                              updatePage((p) => ({ ...p, faq: updated }));
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. SECTIONS REORDER & VISIBILITY TAB */}
              {activeTab === "sections" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Ordem e Visibilidade das Seções
                    </div>
                    <span className="text-[11px] text-zinc-500">Mova com as setas</span>
                  </div>

                  {/* Menu Superior (Header Navbar) Toggle */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-zinc-900 border border-purple-500/30 flex items-center justify-between gap-4 shadow-lg shadow-purple-950/10">
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        <span>Menu Superior (Cabeçalho)</span>
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-1 leading-relaxed">
                        Habilite ou desabilite a barra de links e botão de CTA fixa no topo da sua página de forma visível e prática.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updatePage((p) => ({
                          ...p,
                          headerNav: {
                            ...p.headerNav,
                            logoType: p.headerNav?.logoType || "text",
                            logoText: p.headerNav?.logoText || "COMET.LP",
                            ctaText: p.headerNav?.ctaText || "Quero uma Bolsa",
                            ctaTargetSectionId: p.headerNav?.ctaTargetSectionId || "formSection",
                            links: p.headerNav?.links || [
                              { id: "l1", label: "Cursos", targetSectionId: "bentoGrid" },
                              { id: "l2", label: "Por que a People?", targetSectionId: "bentoGrid" },
                              { id: "l3", label: "Depoimentos", targetSectionId: "testimonials" },
                              { id: "l4", label: "Faq", targetSectionId: "faq" },
                            ],
                            enabled: !(page.headerNav?.enabled),
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        page.headerNav?.enabled
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                          : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white"
                      }`}
                    >
                      {page.headerNav?.enabled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Habilitado</span>
                        </>
                      ) : (
                        <span>Desabilitado</span>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(page.sectionOrder || [
                      "hero",
                      "socialProof",
                      "quiz",
                      "bentoGrid",
                      "testimonials",
                      "formSection",
                      "faq",
                    ]).map((secKey, idx) => {
                      const isVisible = (page.visibility as any)[secKey] !== false;
                      const label = SECTION_LIST.find((s) => s.id === secKey)?.label || secKey;

                      return (
                        <div
                          key={secKey}
                          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2 group hover:border-zinc-700"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <GripVertical className="w-4 h-4 text-zinc-600" />
                            <span className="text-xs font-mono text-zinc-500 w-4">{idx + 1}</span>
                            <span className="text-xs sm:text-sm font-semibold text-white truncate">
                              {label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Toggle visibility */}
                            <button
                              type="button"
                              onClick={() =>
                                updatePage((p) => ({
                                  ...p,
                                  visibility: {
                                    ...p.visibility,
                                    [secKey]: !isVisible,
                                  },
                                }))
                              }
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                isVisible
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                  : "bg-zinc-950 text-zinc-600 border border-zinc-800"
                              }`}
                              title={isVisible ? "Visível" : "Oculto"}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Up / Down */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveSection(idx, "up")}
                              className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (page.sectionOrder?.length || 7) - 1}
                              onClick={() => handleMoveSection(idx, "down")}
                              className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. MEDIA TAB */}
              {activeTab === "media" && (
                <div className="space-y-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Gerenciador de Imagens, Vídeos e Logos
                  </div>

                  {/* Hero Media Card */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Imagem / Vídeo Principal (Hero)</span>
                      <button
                        type="button"
                        onClick={() =>
                          setImagePickerConfig({
                            isOpen: true,
                            type: "hero",
                            currentUrl: page.hero.imageUrl || page.hero.videoThumbnail,
                            title: "Trocar Imagem do Hero",
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Trocar</span>
                      </button>
                    </div>

                    <div className="h-28 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                      <img
                        src={page.hero.videoThumbnail || page.hero.imageUrl}
                        alt="Hero Media"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Logos Manager Quick Card */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Logos de Prova Social</div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <span>{page.socialProof.marqueeLogos.length} marcas</span>
                          <span>•</span>
                          <span className="text-purple-400 font-semibold">
                            {(page.socialProof.marqueeSpeed || "medium") === "stopped"
                              ? "Parado"
                              : (page.socialProof.marqueeSpeed || "medium") === "slow"
                              ? "Lento"
                              : (page.socialProof.marqueeSpeed || "medium") === "fast"
                              ? "Rápido"
                              : "Médio"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLogoManagerOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Editar Logos</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. AI TAB */}
              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Copiloto de Copy & Objeções (IA)</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Refine textos, crie variações persuasivas e quebre objeções com inteligência artificial adaptativa.
                  </p>

                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Instrução customizada (Ex: Deixe o tom mais focado em médicos e autoridade)..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiRefine("make_punchy", page.hero.headline)}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Mais Agressivo</span>
                    </button>

                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiRefine("break_objections", page.hero.subheadline)}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Quebrar Objeção</span>
                    </button>
                  </div>

                  {aiLoading && (
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
                      <RefreshCw className="w-5 h-5 text-purple-400 animate-spin mx-auto" />
                      <p className="text-xs text-zinc-400">Sintetizando copy de alta conversão...</p>
                    </div>
                  )}

                  {aiResult && (
                    <div className="p-4 rounded-xl bg-zinc-900 border border-purple-500/40 space-y-3">
                      <div className="text-xs font-bold text-purple-300">Sugestão Gerada:</div>
                      <p className="text-xs text-zinc-200 leading-relaxed font-medium bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                        {aiResult.result}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          updatePage((p) => ({
                            ...p,
                            hero: { ...p.hero, headline: aiResult.result },
                          }));
                          showNotification("Headline atualizada!");
                        }}
                        className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Aplicar como Headline
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 6. WEBHOOK TAB */}
              {activeTab === "webhook" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Integração de Leads (Webhook / CRM)
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      URL do Webhook (n8n, Make, Zapier, Hotmart)
                    </label>
                    <input
                      type="url"
                      value={page.webhookUrl || ""}
                      onChange={(e) => updatePage((p) => ({ ...p, webhookUrl: e.target.value }))}
                      placeholder="https://seu-n8n.com/webhook/lead"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Quando um lead preencher o formulário final, o payload estruturado com respostas do quiz, telefone, nome e UTMs será enviado para este endpoint.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center Live Canvas Preview */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto relative flex justify-center p-2 sm:p-6 h-full">
          {/* Floating button to restore sidebar when collapsed */}
          <AnimatePresence>
            {isSidebarCollapsed && !isPreviewMode && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setIsSidebarCollapsed(false)}
                className="fixed top-20 left-4 z-40 px-4 py-2.5 rounded-2xl bg-zinc-950/95 hover:bg-zinc-900 border border-purple-500/80 text-purple-300 hover:text-white text-xs font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(168,85,247,0.3)] backdrop-blur-xl transition-all cursor-pointer hover:scale-105"
                title="Abrir painel lateral de ferramentas e configurações"
              >
                <PanelLeftOpen className="w-4 h-4 text-purple-400" />
                <span>Abrir Painel de Edição</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            className={`transition-all duration-300 w-full ${
              deviceView === "mobile"
                ? "max-w-sm rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden my-auto h-[840px] overflow-y-auto"
                : deviceView === "tablet"
                ? "max-w-2xl rounded-2xl border-4 border-zinc-800 shadow-2xl overflow-hidden my-auto h-[900px] overflow-y-auto"
                : "max-w-full"
            }`}
          >
            <LandingPageRenderer
              page={page}
              isEditorPreview={!isPreviewMode}
              activeSection={activeSectionEdit}
              onUpdatePage={updatePage}
              onSelectSection={(secId) => {
                setActiveSectionEdit(secId);
              }}
              onOpenHeroModelSelector={() => {
                setIsHeroModelModalOpen(true);
              }}
              onOpenImagePicker={(config) => {
                let posX = 50;
                let posY = 50;
                let zoomVal = 100;
                if (config.type === "hero") {
                  posX = page.hero.imagePositionX ?? 50;
                  posY = page.hero.imagePositionY ?? 50;
                  zoomVal = page.hero.imageZoom ?? 100;
                } else if (config.type === "bento" && config.itemId) {
                  const bItem = page.bentoGrid?.items?.find((i) => i.id === config.itemId);
                  if (bItem) {
                    posX = bItem.imagePositionX ?? 50;
                    posY = bItem.imagePositionY ?? 50;
                    zoomVal = bItem.imageZoom ?? 100;
                  }
                } else if ((config.type === "testimonial" || config.type === "avatar") && config.itemId) {
                  const tItem = page.testimonials?.items?.find((i) => i.id === config.itemId);
                  if (tItem) {
                    posX = tItem.imagePositionX ?? 50;
                    posY = tItem.imagePositionY ?? 50;
                    zoomVal = tItem.imageZoom ?? 100;
                  }
                }

                setImagePickerConfig({
                  isOpen: true,
                  ...config,
                  initialPositionX: posX,
                  initialPositionY: posY,
                  initialZoom: zoomVal,
                });
              }}
              onOpenLogoManager={() => {
                setIsLogoManagerOpen(true);
              }}
              onOpenIconPicker={(config) => {
                setIconPickerConfig({
                  isOpen: true,
                  ...config,
                });
              }}
            />
          </div>
        </main>
      </div>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={imagePickerConfig.isOpen}
        onClose={() => setImagePickerConfig((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={imagePickerConfig.currentUrl}
        title={imagePickerConfig.title}
        targetType={imagePickerConfig.type}
        initialPositionX={imagePickerConfig.initialPositionX}
        initialPositionY={imagePickerConfig.initialPositionY}
        initialZoom={imagePickerConfig.initialZoom}
        onSelectImage={(newUrl, framing) => {
          handleApplyImage(newUrl, framing);
        }}
      />

      {/* Logo Manager Modal */}
      <LogoManagerModal
        isOpen={isLogoManagerOpen}
        onClose={() => setIsLogoManagerOpen(false)}
        logos={page.socialProof?.marqueeLogos || []}
        logoItems={page.socialProof?.logoItems}
        colorMode={page.socialProof?.logoColorMode || "original"}
        logoSize={page.socialProof?.logoSize || "sm"}
        marqueeSpeed={page.socialProof?.marqueeSpeed || "medium"}
        accentColorName={page.accentColor}
        onUpdateLogos={(updatedLogos, mode, updatedItems, size, speed) => {
          updatePage((p) => ({
            ...p,
            socialProof: {
              ...p.socialProof,
              marqueeLogos: updatedLogos,
              logoItems: updatedItems || p.socialProof.logoItems,
              logoColorMode: mode,
              logoSize: size || p.socialProof.logoSize || "sm",
              marqueeSpeed: speed || p.socialProof.marqueeSpeed || "medium",
            },
          }));
          showNotification("Logos, cores, tamanho e velocidade atualizados!");
        }}
      />

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerConfig.isOpen}
        onClose={() => setIconPickerConfig((prev) => ({ ...prev, isOpen: false }))}
        currentIconName={iconPickerConfig.currentIcon}
        title={iconPickerConfig.title}
        onSelectIcon={(newIcon) => {
          iconPickerConfig.onSelect(newIcon);
          setIconPickerConfig((prev) => ({ ...prev, isOpen: false }));
          showNotification("Ícone atualizado com sucesso!");
        }}
      />

      {/* Hero Model Selector Modal */}
      {isHeroModelModalOpen && (
        <HeroModelSelector
          currentModel={page.hero.model || "split_image"}
          onSelectModel={(newModel) => {
            updatePage((p) => ({
              ...p,
              hero: {
                ...p.hero,
                model: newModel,
              },
            }));
            setIsHeroModelModalOpen(false);
            showNotification("Modelo da Hero atualizado com sucesso!");
          }}
          onClose={() => setIsHeroModelModalOpen(false)}
        />
      )}

      {/* Network Preview Modal */}
      <NetworkPreviewModal
        isOpen={isNetworkPreviewOpen}
        onClose={() => setIsNetworkPreviewOpen(false)}
        page={page}
        onUpdatePage={(updatedPage) => updatePage(() => updatedPage)}
      />
    </div>
  );
};
