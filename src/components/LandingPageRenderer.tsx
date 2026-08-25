import React, { useState, useEffect } from "react";
import {
  LandingPage,
  QuizOption,
  QuizQuestion,
  BentoItem,
  TestimonialItem,
  FaqItem,
  MetricItem,
  TextAlign,
  FontSize,
  CardRadius,
  CardPadding,
  ContainerWidth,
  HeroModel,
  ElementOffset,
  ButtonCustomStyle,
} from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { DynamicIcon } from "./DynamicIcon";
import { InlineEditableText } from "./InlineEditableText";
import { DraggableElement } from "./DraggableElement";
import { VisualEditableButton } from "./VisualEditableButton";
import { formatBrazilianPhone, extractUrlUtms } from "../utils/formUtils";
import { recordLocalLead } from "../utils/storage";
import { POPULAR_LOGO_PRESETS } from "./LogoManagerModal";
import { SectionControlToolbar } from "./SectionControlToolbar";
import { HeroModelSelector, HERO_MODELS } from "./HeroModelSelector";
import { HeroMediaCard } from "./HeroMediaCard";
import { DraggableFloatingCard } from "./DraggableFloatingCard";
import { HeaderNavbar } from "./HeaderNavbar";
import { TypewriterHeadline } from "./TypewriterHeadline";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ShieldCheck,
  Star,
  Play,
  Volume2,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Send,
  Zap,
  Check,
  ChevronDown,
  Building,
  Flame,
  Camera,
  Plus,
  Trash2,
  Copy,
  Palette,
  MessageSquare,
  MoveLeft,
  MoveRight,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Sliders,
  HelpCircle,
  TrendingUp,
  Layout,
  Video,
  Smartphone,
  Briefcase,
  BookOpen,
  PhoneCall,
  Download,
  Users,
  Target,
  Award,
  Calendar,
} from "lucide-react";

interface LandingPageRendererProps {
  page: LandingPage;
  isEditorPreview?: boolean;
  onUpdatePage?: (updater: (prev: LandingPage) => LandingPage) => void;
  onEditField?: (section: string, field: string, value: any) => void;
  selectedField?: string | null;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  onOpenImagePicker?: (target: {
    type: "hero" | "bento" | "testimonial" | "avatar";
    currentUrl: string;
    itemId?: string;
    title: string;
  }) => void;
  onOpenLogoManager?: () => void;
  onOpenIconPicker?: (target: {
    currentIcon: string;
    onSelect: (icon: string) => void;
    title: string;
  }) => void;
}

// Helpers for dynamic styling classes
export const getAlignClass = (align?: TextAlign) => {
  switch (align) {
    case "left":
      return "text-left items-start justify-start";
    case "right":
      return "text-right items-end justify-end";
    case "justify":
      return "text-justify items-start";
    case "center":
    default:
      return "text-center items-center justify-center";
  }
};

export const getHeadingAlignClass = (align?: TextAlign) => {
  switch (align) {
    case "left":
      return "text-left mr-auto";
    case "right":
      return "text-right ml-auto";
    case "justify":
      return "text-justify mx-auto";
    case "center":
    default:
      return "text-center mx-auto";
  }
};

export const getHeadlineSizeClass = (size?: FontSize) => {
  switch (size) {
    case "4xs":
      return "text-xs sm:text-xs md:text-sm"; // ~8-12px
    case "3xs":
      return "text-xs sm:text-sm md:text-base"; // ~10-14px
    case "2xs":
      return "text-sm sm:text-base md:text-lg"; // ~12-16px
    case "xs":
      return "text-base sm:text-lg md:text-xl"; // ~14-18px
    case "sm":
      return "text-lg sm:text-xl md:text-2xl"; // ~18-22px
    case "base":
    case "md":
      return "text-xl sm:text-2xl md:text-3xl"; // ~20-28px
    case "lg":
      return "text-2xl sm:text-3xl md:text-4xl"; // ~24-36px
    case "xl":
      return "text-3xl sm:text-4xl md:text-5xl"; // ~30-48px
    case "2xl":
      return "text-4xl sm:text-5xl md:text-6xl"; // ~36-60px
    case "3xl":
      return "text-5xl sm:text-6xl md:text-7xl"; // ~48-72px
    case "4xl":
      return "text-6xl sm:text-7xl md:text-8xl"; // ~60-84px
    case "5xl":
      return "text-7xl sm:text-8xl md:text-9xl"; // ~72-96px
    default:
      return "text-2xl sm:text-3xl md:text-4xl";
  }
};

export const getSubheadlineSizeClass = (size?: FontSize) => {
  switch (size) {
    case "4xs":
      return "text-[10px] sm:text-[10px]";
    case "3xs":
      return "text-[11px] sm:text-xs";
    case "2xs":
      return "text-xs sm:text-xs";
    case "xs":
      return "text-xs sm:text-sm";
    case "sm":
      return "text-sm sm:text-base";
    case "base":
    case "md":
      return "text-base sm:text-lg";
    case "lg":
      return "text-lg sm:text-xl";
    case "xl":
      return "text-xl sm:text-2xl";
    case "2xl":
    case "3xl":
    case "4xl":
    case "5xl":
      return "text-2xl sm:text-3xl";
    default:
      return "text-sm sm:text-base";
  }
};

export const FONT_SIZE_STEPS: FontSize[] = [
  "4xs",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
];

export const getNextFontSize = (
  current: FontSize = "base",
  direction: "up" | "down"
): FontSize => {
  const idx = FONT_SIZE_STEPS.indexOf(current);
  if (idx === -1) return direction === "up" ? "lg" : "sm";
  const newIdx =
    direction === "up"
      ? Math.min(FONT_SIZE_STEPS.length - 1, idx + 1)
      : Math.max(0, idx - 1);
  return FONT_SIZE_STEPS[newIdx];
};

export const getRadiusClass = (radius?: CardRadius) => {
  switch (radius) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-lg";
    case "md":
      return "rounded-xl";
    case "lg":
      return "rounded-2xl";
    case "2xl":
      return "rounded-[2rem]";
    case "3xl":
      return "rounded-[2.5rem]";
    case "full":
      return "rounded-full";
    case "xl":
    default:
      return "rounded-3xl";
  }
};

export const getPaddingClass = (padding?: CardPadding) => {
  switch (padding) {
    case "compact":
      return "p-4 sm:p-5";
    case "spacious":
      return "p-8 sm:p-12";
    case "normal":
    default:
      return "p-6 sm:p-8";
  }
};

export const getContainerWidthClass = (width?: ContainerWidth) => {
  switch (width) {
    case "narrow":
      return "max-w-4xl";
    case "wide":
      return "max-w-7xl";
    case "full":
      return "max-w-full px-4 sm:px-10";
    case "normal":
    default:
      return "max-w-6xl";
  }
};

export const getBentoSizeClasses = (size?: "large" | "tall" | "wide" | "standard") => {
  switch (size) {
    case "wide":
      return "col-span-1 md:col-span-2 row-span-1";
    case "tall":
      return "col-span-1 row-span-1 md:row-span-2";
    case "large":
      return "col-span-1 md:col-span-2 md:row-span-2";
    case "standard":
    default:
      return "col-span-1 row-span-1";
  }
};

export const CARD_PRESET_GRADIENTS = [
  { id: "default", label: "Padrão Tema", gradient: "", colorHex: "#27272a" },
  { id: "orange", label: "Laranja Degradê (Sunset)", gradient: "bg-gradient-to-br from-orange-950/90 via-amber-950/70 to-zinc-950 border-orange-500/70 text-orange-200 shadow-orange-500/20", colorHex: "#ea580c" },
  { id: "purple", label: "Roxo Cyber", gradient: "bg-gradient-to-br from-purple-950/90 via-fuchsia-950/70 to-zinc-950 border-purple-500/70 text-purple-200 shadow-purple-500/20", colorHex: "#a855f7" },
  { id: "emerald", label: "Verde Esmeralda", gradient: "bg-gradient-to-br from-emerald-950/90 via-teal-950/70 to-zinc-950 border-emerald-500/70 text-emerald-200 shadow-emerald-500/20", colorHex: "#10b981" },
  { id: "cyan", label: "Azul Elétrico", gradient: "bg-gradient-to-br from-cyan-950/90 via-blue-950/70 to-zinc-950 border-cyan-500/70 text-cyan-200 shadow-cyan-500/20", colorHex: "#06b6d4" },
  { id: "rose", label: "Vermelho Fogo", gradient: "bg-gradient-to-br from-rose-950/90 via-red-950/70 to-zinc-950 border-rose-500/70 text-rose-200 shadow-rose-500/20", colorHex: "#f43f5e" },
  { id: "gold", label: "Dourado Premium", gradient: "bg-gradient-to-br from-amber-950/90 via-yellow-950/70 to-zinc-950 border-amber-500/70 text-amber-200 shadow-amber-500/20", colorHex: "#eab308" },
  { id: "dark", label: "Midnight Dark", gradient: "bg-zinc-950 border-zinc-800 text-white shadow-xl", colorHex: "#09090b" },
];

export const LandingPageRenderer: React.FC<LandingPageRendererProps> = ({
  page,
  isEditorPreview = false,
  onUpdatePage,
  activeSection,
  onSelectSection,
  onOpenHeroModelSelector,
  onOpenImagePicker,
  onOpenLogoManager,
  onOpenIconPicker,
}) => {
  const theme = THEME_CONFIGS[page.accentColor] || THEME_CONFIGS.purple;

  // Pinned active element selection & draggable floating editor card
  const [pinnedCardId, setPinnedCardId] = useState<string | null>(null);
  const [floatingCardConfig, setFloatingCardConfig] = useState<{
    type: "bento" | "testimonial" | "quiz" | "metric" | "faq" | "hero_media";
    id: string;
    title: string;
    index: number;
  } | null>(null);

  // Deselect card when clicking outside cards or floating panel
  useEffect(() => {
    if (!pinnedCardId && !floatingCardConfig) return;

    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Keep selection if clicking inside a floating card, modal, or any selectable card
      if (
        target.closest("[data-floating-card]") ||
        target.closest("[data-modal]") ||
        target.closest(".group\\/bento") ||
        target.closest(".group\\/test")
      ) {
        return;
      }

      setPinnedCardId(null);
      setFloatingCardConfig(null);
    };

    const timer = setTimeout(() => {
      window.addEventListener("click", handleWindowClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleWindowClick);
    };
  }, [pinnedCardId, floatingCardConfig]);

  // Safe page updater helper
  const updateP = (fn: (prev: LandingPage) => LandingPage) => {
    if (onUpdatePage) {
      onUpdatePage(fn);
    }
  };

  // Drag & Move element offset helpers
  const getElementOffset = (id: string): ElementOffset => {
    return page.elementOffsets?.[id] || { x: 0, y: 0 };
  };

  const setElementOffset = (id: string, offset: ElementOffset) => {
    updateP((p) => ({
      ...p,
      elementOffsets: {
        ...(p.elementOffsets || {}),
        [id]: offset,
      },
    }));
  };

  // Button style helpers
  const getButtonStyle = (buttonId: string, fallback?: ButtonCustomStyle): ButtonCustomStyle => {
    return page.customButtonStyles?.[buttonId] || fallback || {};
  };

  const setButtonStyle = (buttonId: string, style: ButtonCustomStyle) => {
    updateP((p) => ({
      ...p,
      customButtonStyles: {
        ...(p.customButtonStyles || {}),
        [buttonId]: style,
      },
    }));
  };

  // Section order array fallback
  const sectionOrder = page.sectionOrder || [
    "hero",
    "socialProof",
    "quiz",
    "bentoGrid",
    "testimonials",
    "formSection",
    "faq",
  ];

  // Helper to reorder sections
  const handleMoveSection = (secName: string, direction: "up" | "down") => {
    const idx = sectionOrder.indexOf(secName);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;

    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);

    updateP((p) => ({ ...p, sectionOrder: newOrder }));
  };

  // Quiz interactive state
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, QuizOption>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Form submission state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Video modal / active player
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHeroModelModalOpen, setIsHeroModelModalOpen] = useState(false);

  // FAQ open toggles
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    minutes: page.hero?.countdownMinutes || 14,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 14, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuizOptionSelect = (questionId: string, option: QuizOption, stepIndex: number) => {
    if (isEditorPreview) return;

    const updated = { ...selectedQuizAnswers, [questionId]: option };
    setSelectedQuizAnswers(updated);

    if (stepIndex < (page.quiz?.questions?.length || 0) - 1) {
      setTimeout(() => {
        setCurrentQuizStep(stepIndex + 1);
      }, 250);
    } else {
      setTimeout(() => {
        setQuizCompleted(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {}
      }, 250);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail) {
      setSubmitError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const quizSummary: Record<string, string> = {};
    (Object.entries(selectedQuizAnswers) as [string, QuizOption][]).forEach(([qId, opt]) => {
      quizSummary[qId] = opt?.label || "";
    });

    const utms = extractUrlUtms();

    const payload = {
      pageId: page.id,
      pageTitle: page.title,
      name: leadName,
      whatsapp: leadPhone,
      email: leadEmail,
      quizAnswers: quizSummary,
      utms,
      submittedAt: new Date().toISOString(),
      webhookStatus: "pending",
    };

    try {
      if (page.webhookUrl) {
        await fetch(page.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "no-cors",
        });
        payload.webhookStatus = "sent";
      }

      recordLocalLead(payload as any);
      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      console.error("Submission failed:", err);
      recordLocalLead({
        id: `lead_${Date.now()}`,
        pageId: page.id,
        pageTitle: page.title,
        name: leadName,
        whatsapp: leadPhone,
        email: leadEmail,
        quizAnswers: quizSummary,
        utms,
        submittedAt: new Date().toISOString(),
        webhookStatus: "skipped",
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const visibility = page.visibility || {
    hero: true,
    socialProof: true,
    quiz: true,
    bentoGrid: true,
    testimonials: true,
    formSection: true,
    faq: true,
    stickyMobileCta: true,
  };

  // Render individual sections
  const renderSection = (secName: string) => {
    switch (secName) {
      case "hero":
        if (!visibility.hero || !page.hero) return null;
        const heroIndex = sectionOrder.indexOf("hero");
        const currentHeroModel: HeroModel = page.hero.model || "split_image";

        return (
          <section
            key="hero"
            id="hero-section"
            onClick={() => isEditorPreview && onSelectSection?.("hero")}
            className={`pt-8 md:pt-14 pb-16 px-4 sm:px-6 ${getContainerWidthClass(
              page.hero.containerWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "hero" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="hero"
                sectionTitle="SEÇÃO HERO / HEADLINE PRINCIPAL"
                icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                sectionIndex={heroIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("hero", dir)}
                containerWidth={page.hero.containerWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({ ...p, hero: { ...p.hero, containerWidth: w } }))
                }
                headlineSize={page.hero.headlineSize || "lg"}
                onChangeHeadlineSize={(sz) =>
                  updateP((p) => ({ ...p, hero: { ...p.hero, headlineSize: sz } }))
                }
                align={page.hero.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, hero: { ...p.hero, align: a } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, hero: false } }))
                }
                customActions={
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenHeroModelSelector) {
                          onOpenHeroModelSelector();
                        } else {
                          setIsHeroModelModalOpen(true);
                        }
                      }}
                      className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-purple-900/40 transition-colors cursor-pointer"
                      title="Escolher Modelo de Hero"
                    >
                      <Layout className="w-3.5 h-3.5" />
                      <span>Modelo: {HERO_MODELS.find(m => m.id === currentHeroModel)?.title.split(":")[0] || "Hero"}</span>
                    </button>
                  </div>
                }
              />
            )}

            {/* Hero Model Switcher Modal */}
            {isHeroModelModalOpen && (
              <div
                className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setIsHeroModelModalOpen(false)}
              >
                <div
                  className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-3xl w-full shadow-2xl text-left max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span>Escolher Modelo da Seção Hero</span>
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Alterne entre os 6 formatos de alta conversão para transformar o topo da sua página.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsHeroModelModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <HeroModelSelector
                    currentModel={currentHeroModel}
                    onSelectModel={(newModel) => {
                      updateP((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          model: newModel,
                        },
                      }));
                      setIsHeroModelModalOpen(false);
                    }}
                    accentColor={page.accentColor}
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODEL 1: SPLIT WITH IMAGE / MOCKUP                                       */}
            {/* ========================================================================= */}
            {currentHeroModel === "split_image" && (() => {
              const isMediaLeft = page.hero.mediaPosition === "left";
              const mediaWidthPct = page.hero.mediaWidthPercent || 44;
              const textWidthPct = 100 - mediaWidthPct;
              const heroAlign = page.hero.align || "left";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              const textBlock = (
                <div
                  className={`flex flex-col ${getAlignClass(heroAlign)} w-full`}
                  style={{
                    flex: `1 1 ${Math.max(30, textWidthPct)}%`,
                    minWidth: "min(100%, 300px)",
                  }}
                >
                  {/* Badge */}
                  <DraggableElement
                    elementId="hero-badge"
                    offset={getElementOffset("hero-badge")}
                    onOffsetChange={(o) => setElementOffset("hero-badge", o)}
                    isEditorPreview={isEditorPreview}
                    label="Badge"
                    inline
                    className="mb-6"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-semibold shadow-xl shadow-black/40 hover:border-zinc-700 transition-colors">
                      <span className={`w-2 h-2 rounded-full ${theme.badgeBg} animate-ping`} />
                      <button
                        type="button"
                        onClick={(e) => {
                          if (isEditorPreview) {
                            e.stopPropagation();
                            onOpenIconPicker?.({
                              currentIcon: page.hero.badgeIcon || "Zap",
                              onSelect: (newIcon) => {
                                updateP((p) => ({ ...p, hero: { ...p.hero, badgeIcon: newIcon } }));
                              },
                              title: "Escolher Ícone do Badge",
                            });
                          }
                        }}
                        className={`flex items-center gap-1 ${
                          isEditorPreview ? "hover:scale-110 cursor-pointer p-0.5 rounded bg-zinc-800" : ""
                        }`}
                        title={isEditorPreview ? "Clique para trocar o ícone" : undefined}
                      >
                        <DynamicIcon name={page.hero.badgeIcon || "Zap"} className={`w-4 h-4 ${theme.iconText}`} />
                      </button>
                      <InlineEditableText
                        value={page.hero.badgeText}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, badgeText: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        className={theme.badgeText}
                        placeholder="Texto do Badge..."
                        fieldLabel="Badge"
                        nicheContext={page.niche}
                      />
                    </div>
                  </DraggableElement>

                  {/* Headline */}
                  <DraggableElement
                    elementId="hero-headline"
                    offset={getElementOffset("hero-headline")}
                    onOffsetChange={(o) => setElementOffset("hero-headline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Título Principal"
                    className="mb-6"
                  >
                    <div
                      className={`font-bold ${getHeadlineSizeClass(
                        page.hero.headlineSize
                      )} ${getHeadingAlignClass(headlineAlign)} leading-[1.12] tracking-tight text-white w-full`}
                      style={{
                        fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                        lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                      }}
                    >
                      {page.hero.typewriterEnabled ? (
                        <TypewriterHeadline
                          prefix={page.hero.typewriterPrefix || ""}
                          words={page.hero.typewriterWords || ["Carreira", "Vida", "Profissão", "Competência"]}
                          suffix={page.hero.typewriterSuffix || ""}
                          accentClass={theme.gradientText ? `bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent` : theme.iconText}
                          accentHex={page.customAccentHex}
                          isEditorPreview={isEditorPreview}
                          className="font-bold tracking-tight"
                        />
                      ) : (
                        <InlineEditableText
                          value={page.hero.headline}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                          }
                          align={headlineAlign}
                          onAlignChange={(newAlign) =>
                            updateP((p) => ({
                              ...p,
                              hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                            }))
                          }
                          fontSize={page.hero.headlineSize || "base"}
                          onFontSizeChange={(newSize) =>
                            updateP((p) => ({
                              ...p,
                              hero: { ...p.hero, headlineSize: newSize },
                            }))
                          }
                          fontSizePx={page.hero.headlineFontSizePx}
                          onFontSizePxChange={(newPx) =>
                            updateP((p) => ({
                              ...p,
                              hero: { ...p.hero, headlineFontSizePx: newPx },
                            }))
                          }
                          onIncreaseFontSize={() =>
                            updateP((p) => ({
                              ...p,
                              hero: {
                                ...p.hero,
                                headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                              },
                            }))
                          }
                          onDecreaseFontSize={() =>
                            updateP((p) => ({
                              ...p,
                              hero: {
                                ...p.hero,
                                headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                              },
                            }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="h1"
                          multiline={true}
                          placeholder="Insira a Headline principal..."
                          fieldLabel="Headline Principal"
                          nicheContext={page.niche}
                        />
                      )}
                    </div>
                  </DraggableElement>

                  {/* Subheadline */}
                  <DraggableElement
                    elementId="hero-subheadline"
                    offset={getElementOffset("hero-subheadline")}
                    onOffsetChange={(o) => setElementOffset("hero-subheadline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Subtítulo"
                    className="mb-8"
                  >
                    <div
                      className={`text-zinc-400 ${getSubheadlineSizeClass(
                        page.hero.subheadlineSize
                      )} ${getHeadingAlignClass(subheadlineAlign)} leading-relaxed font-normal w-full`}
                      style={{
                        fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                      }}
                    >
                      <InlineEditableText
                        value={page.hero.subheadline}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                        }
                        align={subheadlineAlign}
                        onAlignChange={(newAlign) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineAlign: newAlign },
                          }))
                        }
                        fontSize={page.hero.subheadlineSize || "base"}
                        onFontSizeChange={(newSize) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineSize: newSize },
                          }))
                        }
                        fontSizePx={page.hero.subheadlineFontSizePx}
                        onFontSizePxChange={(newPx) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineFontSizePx: newPx },
                          }))
                        }
                        onIncreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                            },
                          }))
                        }
                        onDecreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                            },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="p"
                        multiline={true}
                        placeholder="Insira a subheadline explicativa..."
                        fieldLabel="Subheadline"
                        nicheContext={page.niche}
                      />
                    </div>
                  </DraggableElement>

                  {/* Urgency Pill & Social Proof Avatars */}
                  <DraggableElement
                    elementId="hero-urgency"
                    offset={getElementOffset("hero-urgency")}
                    onOffsetChange={(o) => setElementOffset("hero-urgency", o)}
                    isEditorPreview={isEditorPreview}
                    label="Prova Social & Cronômetro"
                    className="mb-8"
                  >
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-300">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>
                          Oferta expira em:{" "}
                          <strong className="text-white font-mono font-bold">
                            {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                          </strong>
                        </span>
                      </div>

                      {page.hero.socialProofAvatars && page.hero.socialProofAvatars.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {page.hero.socialProofAvatars.map((av, i) => (
                              <img
                                key={i}
                                src={av.avatarUrl}
                                alt={av.name}
                                className="w-7 h-7 rounded-full border-2 border-zinc-900 object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-400">
                            <span className="text-amber-400 font-bold flex items-center">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              {page.hero.ratingScore || "4.9"}
                            </span>
                            <span>
                              (
                              <InlineEditableText
                                value={page.hero.ratingText || "4.9/5 estrelas • 1.200+ clientes"}
                                onChange={(newVal) =>
                                  updateP((p) => ({ ...p, hero: { ...p.hero, ratingText: newVal } }))
                                }
                                isEditorPreview={isEditorPreview}
                                tag="span"
                                placeholder="Avaliação e Prova..."
                              />
                              )
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </DraggableElement>

                  {/* Primary CTA with Visual Editable Button */}
                  <DraggableElement
                    elementId="hero-cta-group"
                    offset={getElementOffset("hero-cta-group")}
                    onOffsetChange={(o) => setElementOffset("hero-cta-group", o)}
                    isEditorPreview={isEditorPreview}
                    label="Botão de Ação CTA"
                    className="w-full max-w-md space-y-3"
                  >
                    <VisualEditableButton
                      buttonId="hero-primary-cta"
                      text={page.hero.ctaText || "QUERO GARANTIR MINHA VAGA"}
                      subtext={page.hero.ctaSubtext}
                      onTextChange={(newText) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaText: newText } }))
                      }
                      onSubtextChange={(newSub) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newSub } }))
                      }
                      buttonStyle={getButtonStyle("hero-primary-cta", page.hero.ctaStyle)}
                      onStyleChange={(s) => {
                        setButtonStyle("hero-primary-cta", s);
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaStyle: s } }));
                      }}
                      isEditorPreview={isEditorPreview}
                      onClick={() => {
                        if (!isEditorPreview) scrollToSection("form-section");
                      }}
                      themeGlow={theme.ctaGlow}
                      nicheContext={page.niche}
                    />

                    <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <InlineEditableText
                        value={page.hero.ctaSubtext || "Garantia incondicional de 30 dias • Acesso Imediato"}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        placeholder="Garantia ou micro-copy..."
                      />
                    </div>
                  </DraggableElement>
                </div>
              );

              const mediaBlock = (
                <div
                  className="w-full flex justify-center items-center"
                  style={{
                    flex: `0 0 ${Math.max(25, mediaWidthPct)}%`,
                    maxWidth: "100%",
                  }}
                >
                  <HeroMediaCard
                    hero={page.hero}
                    onUpdateHero={(updated) =>
                      updateP((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          ...(typeof updated === "function" ? updated(p.hero) : updated),
                        },
                      }))
                    }
                    isEditorPreview={isEditorPreview}
                    themeGlow={theme.neonGlow}
                    onOpenImagePicker={onOpenImagePicker}
                  />
                </div>
              );

              return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
                  {isMediaLeft ? (
                    <>
                      {mediaBlock}
                      {textBlock}
                    </>
                  ) : (
                    <>
                      {textBlock}
                      {mediaBlock}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ========================================================================= */}
            {/* MODEL 2: SPLIT WITH VERTICAL VSL / VIDEO + FLOATING RATING                */}
            {/* ========================================================================= */}
            {currentHeroModel === "split_video" && (() => {
              const isMediaLeft = page.hero.mediaPosition === "left";
              const mediaWidthPct = page.hero.mediaWidthPercent || 38;
              const textWidthPct = 100 - mediaWidthPct;
              const heroAlign = page.hero.align || "left";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              const textBlock = (
                <div
                  className={`flex flex-col ${getAlignClass(heroAlign)} w-full`}
                  style={{
                    flex: `1 1 ${Math.max(30, textWidthPct)}%`,
                    minWidth: "min(100%, 300px)",
                  }}
                >
                  {/* Badge */}
                  <DraggableElement
                    elementId="hero2-badge"
                    offset={getElementOffset("hero2-badge")}
                    onOffsetChange={(o) => setElementOffset("hero2-badge", o)}
                    isEditorPreview={isEditorPreview}
                    label="Badge"
                    inline
                    className="mb-6"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-semibold shadow-xl shadow-black/40">
                      <span className={`w-2 h-2 rounded-full ${theme.badgeBg} animate-ping`} />
                      <DynamicIcon name={page.hero.badgeIcon || "Video"} className={`w-4 h-4 ${theme.iconText}`} />
                      <InlineEditableText
                        value={page.hero.badgeText}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, badgeText: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        className={theme.badgeText}
                        placeholder="Texto do Badge..."
                        fieldLabel="Badge"
                        nicheContext={page.niche}
                      />
                    </div>
                  </DraggableElement>

                  {/* Headline */}
                  <DraggableElement
                    elementId="hero2-headline"
                    offset={getElementOffset("hero2-headline")}
                    onOffsetChange={(o) => setElementOffset("hero2-headline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Título Principal"
                    className="mb-6"
                  >
                    <div
                      className={`font-bold ${getHeadlineSizeClass(
                        page.hero.headlineSize
                      )} ${getHeadingAlignClass(headlineAlign)} leading-[1.12] tracking-tight text-white w-full`}
                      style={{
                        fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                        lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                      }}
                    >
                      <InlineEditableText
                        value={page.hero.headline}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                        }
                        align={headlineAlign}
                        onAlignChange={(newAlign) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                          }))
                        }
                        fontSize={page.hero.headlineSize || "base"}
                        onFontSizeChange={(newSize) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineSize: newSize },
                          }))
                        }
                        fontSizePx={page.hero.headlineFontSizePx}
                        onFontSizePxChange={(newPx) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineFontSizePx: newPx },
                          }))
                        }
                        onIncreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                            },
                          }))
                        }
                        onDecreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                            },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="h1"
                        multiline={true}
                        placeholder="Insira a Headline principal..."
                        fieldLabel="Headline Principal"
                        nicheContext={page.niche}
                      />
                    </div>
                  </DraggableElement>

                  {/* Subheadline */}
                  <DraggableElement
                    elementId="hero2-subheadline"
                    offset={getElementOffset("hero2-subheadline")}
                    onOffsetChange={(o) => setElementOffset("hero2-subheadline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Subtítulo"
                    className="mb-8"
                  >
                    <div
                      className={`text-zinc-400 ${getSubheadlineSizeClass(
                        page.hero.subheadlineSize
                      )} ${getHeadingAlignClass(subheadlineAlign)} leading-relaxed font-normal w-full`}
                      style={{
                        fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                      }}
                    >
                      <InlineEditableText
                        value={page.hero.subheadline}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                        }
                        align={subheadlineAlign}
                        onAlignChange={(newAlign) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineAlign: newAlign },
                          }))
                        }
                        fontSize={page.hero.subheadlineSize || "base"}
                        onFontSizeChange={(newSize) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineSize: newSize },
                          }))
                        }
                        fontSizePx={page.hero.subheadlineFontSizePx}
                        onFontSizePxChange={(newPx) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineFontSizePx: newPx },
                          }))
                        }
                        onIncreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                            },
                          }))
                        }
                        onDecreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                            },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="p"
                        multiline={true}
                        placeholder="Insira a subheadline explicativa..."
                        fieldLabel="Subheadline"
                        nicheContext={page.niche}
                      />
                    </div>
                  </DraggableElement>

                  {/* CTA Button + Social Avatars Side-by-Side */}
                  <DraggableElement
                    elementId="hero2-cta-group"
                    offset={getElementOffset("hero2-cta-group")}
                    onOffsetChange={(o) => setElementOffset("hero2-cta-group", o)}
                    isEditorPreview={isEditorPreview}
                    label="Botão de Ação & Prova Social"
                    className="w-full space-y-3 mb-4"
                  >
                    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <div className="flex-1">
                        <VisualEditableButton
                          buttonId="hero2-primary-cta"
                          text={page.hero.ctaText || "QUERO COMEÇAR AGORA"}
                          subtext={page.hero.ctaSubtext}
                          onTextChange={(newText) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, ctaText: newText } }))
                          }
                          onSubtextChange={(newSub) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newSub } }))
                          }
                          buttonStyle={getButtonStyle("hero2-primary-cta", page.hero.ctaStyle)}
                          onStyleChange={(s) => {
                            setButtonStyle("hero2-primary-cta", s);
                            updateP((p) => ({ ...p, hero: { ...p.hero, ctaStyle: s } }));
                          }}
                          isEditorPreview={isEditorPreview}
                          onClick={() => {
                            if (!isEditorPreview) scrollToSection("form-section");
                          }}
                          themeGlow={theme.ctaGlow}
                          nicheContext={page.niche}
                        />
                      </div>

                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shrink-0">
                        <div className="flex -space-x-2">
                          {(page.hero.socialProofAvatars || []).slice(0, 3).map((av, idx) => (
                            <img
                              key={idx}
                              src={av.avatarUrl}
                              alt={av.name}
                              className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                        <div className="text-xs">
                          <div className="font-bold text-white flex items-center gap-1">
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>+2.400 Alunos</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Turmas ativas em 2026</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <InlineEditableText
                        value={page.hero.ctaSubtext || "Acesso Imediato + 7 Dias de Garantia Total"}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        placeholder="Garantia..."
                      />
                    </div>
                  </DraggableElement>
                </div>
              );

              const mediaBlock = (
                <div
                  className="w-full flex justify-center items-center relative"
                  style={{
                    flex: `0 0 ${Math.max(25, mediaWidthPct)}%`,
                    maxWidth: "100%",
                  }}
                >
                  <HeroMediaCard
                    hero={page.hero}
                    onUpdateHero={(updated) =>
                      updateP((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          ...(typeof updated === "function" ? updated(p.hero) : updated),
                        },
                      }))
                    }
                    isEditorPreview={isEditorPreview}
                    themeGlow={theme.neonGlow}
                    onOpenImagePicker={onOpenImagePicker}
                  />

                  {/* Floating Review Badge */}
                  <div className="absolute -bottom-4 -left-2 sm:-left-4 z-20 px-4 py-3 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-extrabold text-white text-sm">
                        <InlineEditableText
                          value={page.hero.ratingScore || "4.9 / 5.0"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, ratingScore: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                        <InlineEditableText
                          value={page.hero.ratingText || "+3.200 procedimentos realizados com excelência"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, ratingText: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="div"
                          placeholder="+3.200 procedimentos..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );

              return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
                  {isMediaLeft ? (
                    <>
                      {mediaBlock}
                      {textBlock}
                    </>
                  ) : (
                    <>
                      {textBlock}
                      {mediaBlock}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ========================================================================= */}
            {/* MODEL 3: CENTERED SHOWCASE WITH EMBEDDED METRICS BAR                     */}
            {/* ========================================================================= */}
            {currentHeroModel === "centered_showcase" && (() => {
              const heroAlign = page.hero.align || "center";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              return (
                <div className={`max-w-5xl mx-auto flex flex-col ${getAlignClass(heroAlign)} w-full`}>
                  {/* Badge */}
                  <DraggableElement
                    elementId="hero3-badge"
                    offset={getElementOffset("hero3-badge")}
                    onOffsetChange={(o) => setElementOffset("hero3-badge", o)}
                    isEditorPreview={isEditorPreview}
                    label="Badge"
                    inline
                    className="mb-6"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-semibold shadow-xl shadow-black/40">
                      <span className={`w-2 h-2 rounded-full ${theme.badgeBg} animate-ping`} />
                      <DynamicIcon name={page.hero.badgeIcon || "Zap"} className={`w-4 h-4 ${theme.iconText}`} />
                      <InlineEditableText
                        value={page.hero.badgeText}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, badgeText: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        className={theme.badgeText}
                        placeholder="Texto do Badge..."
                      />
                    </div>
                  </DraggableElement>

                  {/* Headline */}
                  <DraggableElement
                    elementId="hero3-headline"
                    offset={getElementOffset("hero3-headline")}
                    onOffsetChange={(o) => setElementOffset("hero3-headline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Título Principal"
                    className="mb-6"
                  >
                    <div
                      className={`font-bold ${getHeadlineSizeClass(
                        page.hero.headlineSize
                      )} ${getHeadingAlignClass(headlineAlign)} leading-[1.12] tracking-tight text-white max-w-4xl w-full`}
                      style={{
                        fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                        lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                      }}
                    >
                      <InlineEditableText
                        value={page.hero.headline}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                        }
                        align={headlineAlign}
                        onAlignChange={(newAlign) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                          }))
                        }
                        fontSize={page.hero.headlineSize || "base"}
                        onFontSizeChange={(newSize) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineSize: newSize },
                          }))
                        }
                        fontSizePx={page.hero.headlineFontSizePx}
                        onFontSizePxChange={(newPx) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, headlineFontSizePx: newPx },
                          }))
                        }
                        onIncreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                            },
                          }))
                        }
                        onDecreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                            },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="h1"
                        multiline={true}
                        placeholder="Insira a Headline principal..."
                      />
                    </div>
                  </DraggableElement>

                  {/* Subheadline */}
                  <DraggableElement
                    elementId="hero3-subheadline"
                    offset={getElementOffset("hero3-subheadline")}
                    onOffsetChange={(o) => setElementOffset("hero3-subheadline", o)}
                    isEditorPreview={isEditorPreview}
                    label="Subtítulo"
                    className="mb-8"
                  >
                    <div
                      className={`text-zinc-400 ${getSubheadlineSizeClass(
                        page.hero.subheadlineSize
                      )} ${getHeadingAlignClass(subheadlineAlign)} max-w-3xl leading-relaxed font-normal w-full`}
                      style={{
                        fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                      }}
                    >
                      <InlineEditableText
                        value={page.hero.subheadline}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                        }
                        align={subheadlineAlign}
                        onAlignChange={(newAlign) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineAlign: newAlign },
                          }))
                        }
                        fontSize={page.hero.subheadlineSize || "base"}
                        onFontSizeChange={(newSize) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineSize: newSize },
                          }))
                        }
                        fontSizePx={page.hero.subheadlineFontSizePx}
                        onFontSizePxChange={(newPx) =>
                          updateP((p) => ({
                            ...p,
                            hero: { ...p.hero, subheadlineFontSizePx: newPx },
                          }))
                        }
                        onIncreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                            },
                          }))
                        }
                        onDecreaseFontSize={() =>
                          updateP((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                            },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="p"
                        multiline={true}
                        placeholder="Insira a subheadline explicativa..."
                      />
                    </div>
                  </DraggableElement>

                  {/* Centered CTA */}
                  <DraggableElement
                    elementId="hero3-cta-group"
                    offset={getElementOffset("hero3-cta-group")}
                    onOffsetChange={(o) => setElementOffset("hero3-cta-group", o)}
                    isEditorPreview={isEditorPreview}
                    label="Botão de Ação CTA"
                    className="max-w-md w-full space-y-3 mb-10 mx-auto"
                  >
                    <VisualEditableButton
                      buttonId="hero3-primary-cta"
                      text={page.hero.ctaText || "QUERO GARANTIR ACESSO"}
                      subtext={page.hero.ctaSubtext}
                      onTextChange={(newText) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaText: newText } }))
                      }
                      onSubtextChange={(newSub) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newSub } }))
                      }
                      buttonStyle={getButtonStyle("hero3-primary-cta", page.hero.ctaStyle)}
                      onStyleChange={(s) => {
                        setButtonStyle("hero3-primary-cta", s);
                        updateP((p) => ({ ...p, hero: { ...p.hero, ctaStyle: s } }));
                      }}
                      isEditorPreview={isEditorPreview}
                      onClick={() => {
                        if (!isEditorPreview) scrollToSection("form-section");
                      }}
                      themeGlow={theme.ctaGlow}
                      nicheContext={page.niche}
                    />

                    <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <InlineEditableText
                          value={page.hero.ctaSubtext || "Sem cartão de crédito • Setup em 5 minutos"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, ctaSubtext: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                          placeholder="Micro-copy..."
                        />
                      </span>
                    </div>
                  </DraggableElement>

                  {/* Large Showcase Card with HeroMediaCard and Embedded Bottom Metrics */}
                  <div className="w-full flex flex-col items-center">
                    <HeroMediaCard
                      hero={page.hero}
                      onUpdateHero={(updated) =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            ...(typeof updated === "function" ? updated(p.hero) : updated),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      themeGlow={theme.neonGlow}
                      onOpenImagePicker={onOpenImagePicker}
                    />

                    {/* Embedded Bottom Metrics Bar */}
                    <div className="w-full max-w-4xl grid grid-cols-3 divide-x divide-zinc-800 bg-zinc-950/95 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-3.5 sm:p-5 text-center mt-4 shadow-xl">
                      <div className="px-2">
                        <div className="text-xl sm:text-2xl font-black text-purple-400">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[0]?.value || "+42%"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[0] = { ...list[0], value: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[0]?.label || "Conversão Média"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[0] = { ...list[0], label: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </p>
                      </div>

                      <div className="px-2">
                        <div className="text-xl sm:text-2xl font-black text-emerald-400">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[1]?.value || "14min"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[1] = { ...list[1], value: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[1]?.label || "SLA de Resposta"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[1] = { ...list[1], label: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </p>
                      </div>

                      <div className="px-2">
                        <div className="text-xl sm:text-2xl font-black text-amber-400">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[2]?.value || "12.4x"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[2] = { ...list[2], value: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                          <InlineEditableText
                            value={page.hero.b2bMetrics?.[2]?.label || "ROI Médio"}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "+42%", label: "Taxa de Conversão" }, { id: "m2", value: "14min", label: "SLA de Resposta" }, { id: "m3", value: "12.4x", label: "ROI Estimado" }])];
                                list[2] = { ...list[2], label: newVal };
                                return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ========================================================================= */}
            {/* MODEL 4: SPLIT WITH EMBEDDED LEAD CAPTURE FORM (E-BOOK / LEAD MAGNET)     */}
            {/* ========================================================================= */}
            {currentHeroModel === "split_lead_form" && (() => {
              const isMediaLeft = page.hero.mediaPosition !== "right"; // default left for ebook
              const mediaWidthPct = page.hero.mediaWidthPercent || 40;
              const formWidthPct = 100 - mediaWidthPct;
              const heroAlign = page.hero.align || "left";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              const mediaBlock = (
                <div
                  className="w-full flex justify-center items-center"
                  style={{
                    flex: `0 0 ${Math.max(25, mediaWidthPct)}%`,
                    maxWidth: "100%",
                  }}
                >
                  <HeroMediaCard
                    hero={page.hero}
                    onUpdateHero={(updated) =>
                      updateP((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          ...(typeof updated === "function" ? updated(p.hero) : updated),
                        },
                      }))
                    }
                    isEditorPreview={isEditorPreview}
                    themeGlow={theme.neonGlow}
                    onOpenImagePicker={onOpenImagePicker}
                  />
                </div>
              );

              const formBlock = (
                <div
                  className={`flex flex-col ${getAlignClass(heroAlign)} w-full`}
                  style={{
                    flex: `1 1 ${Math.max(30, formWidthPct)}%`,
                    minWidth: "min(100%, 300px)",
                  }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-semibold mb-4 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <InlineEditableText
                      value={page.hero.badgeText || "MATERIAL EXCLUSIVO & GRATUITO"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, badgeText: newVal } }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="span"
                      className="text-emerald-300"
                      placeholder="Badge..."
                    />
                  </div>

                  {/* Headline */}
                  <div
                    className={`font-bold ${getHeadlineSizeClass(
                      page.hero.headlineSize
                    )} ${getHeadingAlignClass(headlineAlign)} leading-[1.15] tracking-tight text-white mb-4 w-full`}
                    style={{
                      fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                      lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.headline || "O Guia Definitivo para Escalar seu Negócio em 2026"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                      }
                      align={headlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                        }))
                      }
                      fontSize={page.hero.headlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.headlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="h1"
                      multiline={true}
                      placeholder="Headline do E-book..."
                    />
                  </div>

                  {/* Subheadline */}
                  <div
                    className={`text-zinc-400 ${getSubheadlineSizeClass(
                      page.hero.subheadlineSize
                    )} ${getHeadingAlignClass(subheadlineAlign)} mb-6 leading-relaxed w-full`}
                    style={{
                      fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.subheadline || "Preencha o formulário abaixo e receba seu exemplar completo imediatamente via WhatsApp e E-mail."}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                      }
                      align={subheadlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineAlign: newAlign },
                        }))
                      }
                      fontSize={page.hero.subheadlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.subheadlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="p"
                      multiline={true}
                      placeholder="Subheadline..."
                    />
                  </div>

                  {/* Embedded Form Box */}
                  <div className="w-full rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <InlineEditableText
                        value={page.hero.leadFormTitle || "Preencha seus dados para download gratuito"}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, leadFormTitle: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                      />
                    </h4>

                    {isSubmitted ? (
                      <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <h5 className="font-bold text-white text-base">Material Enviado com Sucesso!</h5>
                        <p className="text-xs text-zinc-300">
                          Verifique sua caixa de entrada e seu WhatsApp para acessar seu material.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-3">
                        {submitError && (
                          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                            {submitError}
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Seu nome completo"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                              WhatsApp com DDD *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="(11) 99999-9999"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(formatBrazilianPhone(e.target.value))}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                              E-mail Corporativo *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="seu@email.com"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-4 rounded-2xl ${theme.ctaBg} hover:opacity-95 text-white font-extrabold text-base shadow-xl ${theme.ctaGlow} flex items-center justify-center gap-2 transition-all cursor-pointer mt-2`}
                        >
                          <Download className="w-5 h-5 text-white" />
                          <span>{isSubmitting ? "Enviando..." : (page.hero.ctaText || "RECEBER MATERIAL AGORA")}</span>
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Seus dados estão 100% seguros e confidenciais.</span>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              );

              return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
                  {isMediaLeft ? (
                    <>
                      {mediaBlock}
                      {formBlock}
                    </>
                  ) : (
                    <>
                      {formBlock}
                      {mediaBlock}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ========================================================================= */}
            {/* MODEL 5: B2B & CONSULTANCY WITH DUAL CTAS, METRICS & SCARCITY BAR        */}
            {/* ========================================================================= */}
            {currentHeroModel === "b2b_metrics" && (() => {
              const isMediaLeft = page.hero.mediaPosition === "left";
              const mediaWidthPct = page.hero.mediaWidthPercent || 42;
              const textWidthPct = 100 - mediaWidthPct;
              const heroAlign = page.hero.align || "left";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              const textBlock = (
                <div
                  className={`flex flex-col ${getAlignClass(heroAlign)} space-y-6 w-full`}
                  style={{
                    flex: `1 1 ${Math.max(30, textWidthPct)}%`,
                    minWidth: "min(100%, 300px)",
                  }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-xs sm:text-sm font-semibold shadow-xl">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <InlineEditableText
                      value={page.hero.badgeText || "TRANSFORMAÇÃO EMPRESARIAL COMPROVADA"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, badgeText: newVal } }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="span"
                      className="text-purple-300"
                    />
                  </div>

                  {/* Headline */}
                  <div
                    className={`font-bold ${getHeadlineSizeClass(
                      page.hero.headlineSize
                    )} ${getHeadingAlignClass(headlineAlign)} leading-[1.12] tracking-tight text-white w-full`}
                    style={{
                      fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                      lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.headline || "Desenvolver Pessoas, Transformar Empresas"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                      }
                      align={headlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                        }))
                      }
                      fontSize={page.hero.headlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.headlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="h1"
                      multiline={true}
                    />
                  </div>

                  {/* Subheadline */}
                  <div
                    className={`text-zinc-400 ${getSubheadlineSizeClass(
                      page.hero.subheadlineSize
                    )} ${getHeadingAlignClass(subheadlineAlign)} leading-relaxed w-full`}
                    style={{
                      fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.subheadline || "Acelere a eficiência operacional e os lucros da sua organização com metodologia validada em mais de 25 grandes empresas."}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                      }
                      align={subheadlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineAlign: newAlign },
                        }))
                      }
                      fontSize={page.hero.subheadlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.subheadlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="p"
                      multiline={true}
                    />
                  </div>

                  {/* Authority Metrics Row */}
                  <div className="w-full grid grid-cols-3 gap-4 py-4 border-y border-zinc-800/80">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[0]?.value || "10+"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[0] = { ...list[0], value: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[0]?.label || "Anos de Experiência"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[0] = { ...list[0], label: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </p>
                    </div>

                    <div>
                      <div className="text-xl sm:text-2xl font-black text-purple-400">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[1]?.value || "25+"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[1] = { ...list[1], value: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[1]?.label || "Empresas Atendidas"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[1] = { ...list[1], label: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </p>
                    </div>

                    <div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[2]?.value || "+300"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[2] = { ...list[2], value: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        <InlineEditableText
                          value={page.hero.b2bMetrics?.[2]?.label || "Pessoas Transformadas"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const list = [...(p.hero.b2bMetrics || [{ id: "m1", value: "10+", label: "Anos de Experiência" }, { id: "m2", value: "25+", label: "Empresas Atendidas" }, { id: "m3", value: "+300", label: "Pessoas Transformadas" }])];
                              list[2] = { ...list[2], label: newVal };
                              return { ...p, hero: { ...p.hero, b2bMetrics: list } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </p>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isEditorPreview) scrollToSection("form-section");
                      }}
                      className={`flex-1 py-4 px-6 rounded-2xl ${theme.ctaBg} hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl ${theme.ctaGlow} flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <InlineEditableText
                        value={page.hero.ctaText || "Agendar uma Reunião"}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, ctaText: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                      />
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isEditorPreview) {
                          const phone = page.formSection?.whatsappHelpNumber?.replace(/\D/g, "") || "5511999999999";
                          window.open(`https://wa.me/${phone}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20consultoria.`, "_blank");
                        }
                      }}
                      className="py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm sm:text-base border border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <InlineEditableText
                        value={page.hero.secondaryCtaText || "Fale no WhatsApp"}
                        onChange={(newVal) =>
                          updateP((p) => ({ ...p, hero: { ...p.hero, secondaryCtaText: newVal } }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                      />
                    </button>
                  </div>
                </div>
              );

              const mediaBlock = (
                <div
                  className="w-full flex justify-center items-center relative"
                  style={{
                    flex: `0 0 ${Math.max(25, mediaWidthPct)}%`,
                    maxWidth: "100%",
                  }}
                >
                  <HeroMediaCard
                    hero={page.hero}
                    onUpdateHero={(updated) =>
                      updateP((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          ...(typeof updated === "function" ? updated(p.hero) : updated),
                        },
                      }))
                    }
                    isEditorPreview={isEditorPreview}
                    themeGlow={theme.neonGlow}
                    onOpenImagePicker={onOpenImagePicker}
                  />

                  {/* Scarcity Card Floating */}
                  <div className="absolute -bottom-4 -right-2 sm:-right-4 z-20 p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl max-w-xs w-full space-y-2 pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <InlineEditableText
                          value={page.hero.scarcityLabel || "TURMA DE MARÇO"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, hero: { ...p.hero, scarcityLabel: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                        />
                      </span>
                      <span className="text-emerald-400 font-extrabold">18 vagas restantes</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="w-3/4 h-full rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              );

              return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
                  {isMediaLeft ? (
                    <>
                      {mediaBlock}
                      {textBlock}
                    </>
                  ) : (
                    <>
                      {textBlock}
                      {mediaBlock}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ========================================================================= */}
            {/* MODEL 6: EDITORIAL & AUTHOR WITH FULL IMMERSIVE BACKGROUND               */}
            {/* ========================================================================= */}
            {currentHeroModel === "editorial_ebook" && (() => {
              const heroAlign = page.hero.align || "center";
              const headlineAlign = page.hero.headlineAlign || heroAlign;
              const subheadlineAlign = page.hero.subheadlineAlign || heroAlign;

              return (
                <div
                  className={`relative rounded-3xl overflow-hidden p-8 sm:p-16 border border-zinc-800/80 bg-zinc-950 flex flex-col ${getAlignClass(
                    heroAlign
                  )} min-h-[520px]`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.75), rgba(9, 9, 11, 0.95)), url('${page.hero.imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {isEditorPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImagePicker?.({
                          type: "hero",
                          currentUrl: page.hero.imageUrl,
                          title: "Trocar Fundo Editorial",
                        });
                      }}
                      className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-2xl transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Trocar Fundo</span>
                    </button>
                  )}

                  {/* Author Name Tag */}
                  <p className="text-xs uppercase tracking-[0.3em] font-extrabold text-purple-400 mb-4">
                    <InlineEditableText
                      value={page.hero.authorName || "LANE EMERY"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, authorName: newVal } }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="span"
                    />
                  </p>

                  {/* Editorial Title */}
                  <div
                    className={`font-serif ${getHeadlineSizeClass(
                      page.hero.headlineSize
                    )} ${getHeadingAlignClass(headlineAlign)} font-normal text-white max-w-3xl leading-[1.15] mb-6 w-full`}
                    style={{
                      fontSize: page.hero.headlineFontSizePx ? `${page.hero.headlineFontSizePx}px` : undefined,
                      lineHeight: page.hero.headlineFontSizePx && page.hero.headlineFontSizePx < 28 ? "1.25" : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.headline || "A New Education for a Changing World"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, headline: newVal } }))
                      }
                      align={headlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineAlign: newAlign, align: newAlign },
                        }))
                      }
                      fontSize={page.hero.headlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.headlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, headlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            headlineSize: getNextFontSize(p.hero.headlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="h1"
                      multiline={true}
                    />
                  </div>

                  {/* Subtitle */}
                  <div
                    className={`text-zinc-300 ${getSubheadlineSizeClass(
                      page.hero.subheadlineSize
                    )} ${getHeadingAlignClass(subheadlineAlign)} max-w-2xl mb-8 leading-relaxed font-light w-full`}
                    style={{
                      fontSize: page.hero.subheadlineFontSizePx ? `${page.hero.subheadlineFontSizePx}px` : undefined,
                    }}
                  >
                    <InlineEditableText
                      value={page.hero.subheadline || "A comprehensive exploration into the philosophical foundations and pragmatic methodologies of modern education."}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, subheadline: newVal } }))
                      }
                      align={subheadlineAlign}
                      onAlignChange={(newAlign) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineAlign: newAlign },
                        }))
                      }
                      fontSize={page.hero.subheadlineSize || "base"}
                      onFontSizeChange={(newSize) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineSize: newSize },
                        }))
                      }
                      fontSizePx={page.hero.subheadlineFontSizePx}
                      onFontSizePxChange={(newPx) =>
                        updateP((p) => ({
                          ...p,
                          hero: { ...p.hero, subheadlineFontSizePx: newPx },
                        }))
                      }
                      onIncreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "up"),
                          },
                        }))
                      }
                      onDecreaseFontSize={() =>
                        updateP((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            subheadlineSize: getNextFontSize(p.hero.subheadlineSize || "base", "down"),
                          },
                        }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="p"
                      multiline={true}
                    />
                  </div>

                  {/* Format Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300 mb-8">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <InlineEditableText
                      value={page.hero.formatBadge || "Disponível em PDF, ePub, Mobi & TXT"}
                      onChange={(newVal) =>
                        updateP((p) => ({ ...p, hero: { ...p.hero, formatBadge: newVal } }))
                      }
                      isEditorPreview={isEditorPreview}
                      tag="span"
                    />
                  </div>

                  {/* Download CTA Button */}
                  <VisualEditableButton
                    buttonId="hero-m6-cta"
                    text={page.hero.ctaText || "Download Ebook"}
                    onTextChange={(newVal) =>
                      updateP((p) => ({ ...p, hero: { ...p.hero, ctaText: newVal } }))
                    }
                    buttonStyle={getButtonStyle("hero-m6-cta")}
                    onStyleChange={(s) => setButtonStyle("hero-m6-cta", s)}
                    isEditorPreview={isEditorPreview}
                    onClick={() => {
                      if (!isEditorPreview) scrollToSection("form-section");
                    }}
                    variant="outline"
                    defaultIcon="arrow"
                    nicheContext={page.niche}
                  />

                  {/* Media / Press Bar */}
                  <div className="mt-12 pt-8 border-t border-white/10 w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
                    <span>FALTNER WEEKLY</span>
                    <span>•</span>
                    <span>THE PLEW</span>
                    <span>•</span>
                    <span>HARWINN GAZETTE</span>
                    <span>•</span>
                    <span>SANTA SOLANA POST</span>
                  </div>
                </div>
              );
            })()}
          </section>
        );

      case "socialProof":
        if (!visibility.socialProof || !page.socialProof) return null;
        const socialIndex = sectionOrder.indexOf("socialProof");
        return (
          <section
            key="socialProof"
            id="social-proof-section"
            onClick={() => isEditorPreview && onSelectSection?.("socialProof")}
            className={`py-14 px-4 sm:px-6 ${getContainerWidthClass(
              page.socialProof.containerWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "socialProof" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="socialProof"
                sectionTitle="PROVA SOCIAL, LOGOS & MÉTRICAS"
                icon={<Building className="w-3.5 h-3.5 text-purple-400" />}
                sectionIndex={socialIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("socialProof", dir)}
                containerWidth={page.socialProof.containerWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({ ...p, socialProof: { ...p.socialProof, containerWidth: w } }))
                }
                align={page.socialProof.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, socialProof: { ...p.socialProof, align: a } }))
                }
                cardPadding={page.socialProof.cardPadding || "normal"}
                onChangeCardPadding={(pad) =>
                  updateP((p) => ({ ...p, socialProof: { ...p.socialProof, cardPadding: pad } }))
                }
                cardRadius={page.socialProof.cardRadius || "xl"}
                onChangeCardRadius={(rad) =>
                  updateP((p) => ({ ...p, socialProof: { ...p.socialProof, cardRadius: rad } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, socialProof: false } }))
                }
                customActions={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLogoManager?.();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Palette className="w-3 h-3" />
                    Logos & Cores
                  </button>
                }
              />
            )}

            {/* Marquee Title */}
            <div className={`mb-8 ${getHeadingAlignClass(page.socialProof.align)}`}>
              <InlineEditableText
                value={page.socialProof.marqueeTitle || "CONFIADO POR MAIS DE 500+ EMPRESAS LÍDERES NO BRASIL"}
                onChange={(newVal) =>
                  updateP((p) => ({ ...p, socialProof: { ...p.socialProof, marqueeTitle: newVal } }))
                }
                isEditorPreview={isEditorPreview}
                tag="h2"
                className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 max-w-xl mx-auto"
                placeholder="Título da Prova Social..."
              />
            </div>

            {/* Logo Marquee */}
            <div className="relative overflow-hidden py-4 mb-14 border-y border-zinc-800/60 bg-zinc-950/40 rounded-2xl">
              <div className="flex items-center justify-around gap-8 flex-wrap px-4">
                {(() => {
                  const logoItems = page.socialProof.logoItems;
                  if (logoItems && logoItems.length > 0) {
                    return logoItems.map((item, idx) => {
                      const mode = item.colorMode || page.socialProof.logoColorMode || "accent";
                      if (item.type === "image" && item.imageUrl) {
                        return (
                          <div key={item.id || idx} className="flex items-center gap-2 py-1">
                            <img
                              src={item.imageUrl}
                              alt={item.text}
                              className={`h-8 sm:h-10 w-auto object-contain transition-all ${
                                mode === "original"
                                  ? "filter opacity-90 hover:opacity-100"
                                  : mode === "monochrome"
                                  ? "filter grayscale contrast-200 brightness-200 opacity-80"
                                  : "filter brightness-200 contrast-125 opacity-90"
                              }`}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={item.id || idx}
                          className={`flex items-center gap-2 transition-all duration-300 py-1 ${
                            mode === "accent"
                              ? `opacity-80 hover:opacity-100 ${theme.iconText}`
                              : mode === "monochrome"
                              ? "opacity-60 hover:opacity-100 text-zinc-400"
                              : "opacity-80 hover:opacity-100 text-zinc-200"
                          }`}
                        >
                          <DynamicIcon name="Building" className="w-5 h-5" />
                          <span className="font-bold text-sm sm:text-base tracking-tight">
                            {item.text}
                          </span>
                        </div>
                      );
                    });
                  }

                  const rawLogos =
                    page.socialProof.marqueeLogos && page.socialProof.marqueeLogos.length > 0
                      ? page.socialProof.marqueeLogos
                      : POPULAR_LOGO_PRESETS.map((p) => p.name).slice(0, 6);

                  return rawLogos.map((logoName, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 transition-all duration-300 py-1 ${
                        (page.socialProof.logoColorMode || "original") === "accent"
                          ? `opacity-80 hover:opacity-100 ${theme.iconText}`
                          : "opacity-70 hover:opacity-100 text-zinc-300"
                      }`}
                    >
                      <DynamicIcon name="Building" className="w-5 h-5" />
                      <span className="font-bold text-sm sm:text-base tracking-tight">
                        {logoName}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Numerical Proof Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
              {page.socialProof.metrics?.map((metric, idx) => (
                <div
                  key={metric.id || idx}
                  className={`${getPaddingClass(page.socialProof.cardPadding)} ${getRadiusClass(
                    page.socialProof.cardRadius
                  )} bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md relative group/card flex flex-col justify-between hover:border-purple-500/40 transition-all ${getAlignClass(
                    page.socialProof.align
                  )}`}
                >
                  {/* Metric Action Controls in Editor */}
                  {isEditorPreview && (
                    <div className="opacity-0 group-hover/card:opacity-100 transition-opacity absolute top-2 right-2 z-20 flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/95 border border-zinc-800 shadow-xl">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx > 0) {
                            const next = [...page.socialProof.metrics];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx - 1, 0, m);
                            updateP((p) => ({ ...p, socialProof: { ...p.socialProof, metrics: next } }));
                          }
                        }}
                        className={`p-1 rounded bg-zinc-900 ${
                          idx === 0 ? "opacity-30 cursor-not-allowed" : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Métrica para a Esquerda"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={idx >= (page.socialProof.metrics?.length || 0) - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx < (page.socialProof.metrics?.length || 0) - 1) {
                            const next = [...page.socialProof.metrics];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx + 1, 0, m);
                            updateP((p) => ({ ...p, socialProof: { ...p.socialProof, metrics: next } }));
                          }
                        }}
                        className={`p-1 rounded bg-zinc-900 ${
                          idx >= (page.socialProof.metrics?.length || 0) - 1
                            ? "opacity-30 cursor-not-allowed"
                            : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Métrica para a Direita"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const copy = { ...metric, id: `metric_${Date.now()}` };
                          const next = [
                            ...page.socialProof.metrics.slice(0, idx + 1),
                            copy,
                            ...page.socialProof.metrics.slice(idx + 1),
                          ];
                          updateP((p) => ({ ...p, socialProof: { ...p.socialProof, metrics: next } }));
                        }}
                        className="p-1 rounded bg-zinc-900 text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        title="Duplicar Métrica"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateP((p) => ({
                            ...p,
                            socialProof: {
                              ...p.socialProof,
                              metrics: p.socialProof.metrics.filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        className="p-1 rounded bg-zinc-900 text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
                        title="Excluir Métrica"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className={`text-2xl sm:text-3xl font-extrabold ${theme.headingGradient} mb-1`}>
                    <InlineEditableText
                      value={metric.value}
                      onChange={(newVal) =>
                        updateP((p) => {
                          const nextMetrics = [...page.socialProof.metrics];
                          nextMetrics[idx] = { ...nextMetrics[idx], value: newVal };
                          return { ...p, socialProof: { ...p.socialProof, metrics: nextMetrics } };
                        })
                      }
                      isEditorPreview={isEditorPreview}
                      tag="span"
                      placeholder="Ex: R$ 10M+"
                    />
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-zinc-200 mb-0.5">
                    <InlineEditableText
                      value={metric.label}
                      onChange={(newVal) =>
                        updateP((p) => {
                          const nextMetrics = [...page.socialProof.metrics];
                          nextMetrics[idx] = { ...nextMetrics[idx], label: newVal };
                          return { ...p, socialProof: { ...p.socialProof, metrics: nextMetrics } };
                        })
                      }
                      isEditorPreview={isEditorPreview}
                      tag="div"
                      placeholder="Ex: Gerados para Clientes"
                    />
                  </div>

                  {metric.sublabel && (
                    <div className="text-[11px] text-zinc-500">
                      <InlineEditableText
                        value={metric.sublabel}
                        onChange={(newVal) =>
                          updateP((p) => {
                            const nextMetrics = [...page.socialProof.metrics];
                            nextMetrics[idx] = { ...nextMetrics[idx], sublabel: newVal };
                            return { ...p, socialProof: { ...p.socialProof, metrics: nextMetrics } };
                          })
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        placeholder="Sublabel..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Metric Button in Editor */}
            {isEditorPreview && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newMetric: MetricItem = {
                      id: `metric_${Date.now()}`,
                      value: "+99.8%",
                      label: "Nova Métrica de Impacto",
                      sublabel: "Comprovado em testes reais",
                    };
                    updateP((p) => ({
                      ...p,
                      socialProof: {
                        ...p.socialProof,
                        metrics: [...(p.socialProof.metrics || []), newMetric],
                      },
                    }));
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Nova Métrica</span>
                </button>
              </div>
            )}
          </section>
        );

      case "quiz":
        if (!visibility.quiz || !page.quiz?.questions || page.quiz.questions.length === 0) return null;
        const quizIndex = sectionOrder.indexOf("quiz");
        const currentQ = page.quiz.questions[currentQuizStep] || page.quiz.questions[0];

        return (
          <section
            key="quiz"
            id="quiz-section"
            onClick={() => isEditorPreview && onSelectSection?.("quiz")}
            className={`py-16 px-4 sm:px-6 ${getContainerWidthClass(
              page.quiz.containerWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "quiz" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="quiz"
                sectionTitle="QUIZ DE QUALIFICAÇÃO CRO"
                icon={<Flame className="w-3.5 h-3.5 text-purple-400" />}
                sectionIndex={quizIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("quiz", dir)}
                containerWidth={page.quiz.containerWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({ ...p, quiz: { ...p.quiz, containerWidth: w } }))
                }
                align={page.quiz.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, quiz: { ...p.quiz, align: a } }))
                }
                cardPadding={page.quiz.cardPadding || "normal"}
                onChangeCardPadding={(pad) =>
                  updateP((p) => ({ ...p, quiz: { ...p.quiz, cardPadding: pad } }))
                }
                cardRadius={page.quiz.cardRadius || "xl"}
                onChangeCardRadius={(rad) =>
                  updateP((p) => ({ ...p, quiz: { ...p.quiz, cardRadius: rad } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, quiz: false } }))
                }
                customActions={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newQ: QuizQuestion = {
                        id: `q_${Date.now()}`,
                        question: "Qual é o seu principal desafio atualmente?",
                        description: "Selecione a opção mais aderente ao seu negócio:",
                        options: [
                          { id: "opt1", label: "Gerar leads qualificados", badge: "Alta Escala", iconName: "TrendingUp" },
                          { id: "opt2", label: "Aumentar a conversão da página", badge: "Conversão", iconName: "Zap" },
                        ],
                      };
                      updateP((p) => ({
                        ...p,
                        quiz: { ...p.quiz, questions: [...p.quiz.questions, newQ] },
                      }));
                      setCurrentQuizStep(page.quiz.questions.length);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Plus className="w-3 h-3" />
                    + Nova Pergunta
                  </button>
                }
              />
            )}

            {/* Quiz Title & Subtitle */}
            <div className={`mb-10 ${getHeadingAlignClass(page.quiz.align)}`}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>DIAGNÓSTICO ESTRATÉGICO PERSONALIZADO</span>
              </div>

              <div className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                <InlineEditableText
                  value={page.quiz.title || "Descubra o Plano Ideal Para o Seu Negócio"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, quiz: { ...p.quiz, title: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="h2"
                  placeholder="Título do Quiz..."
                  fieldLabel="Título do Quiz"
                />
              </div>

              <div className="text-zinc-400 text-sm sm:text-base max-w-2xl">
                <InlineEditableText
                  value={page.quiz.subtitle || "Responda a perguntas rápidas para desbloquear sua condição exclusiva:"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, quiz: { ...p.quiz, subtitle: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="p"
                  placeholder="Subtítulo do Quiz..."
                />
              </div>
            </div>

            {/* Step Switcher Bar in Editor with Move Questions */}
            {isEditorPreview && (
              <div className="flex items-center justify-center gap-2 mb-6 p-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex-wrap">
                <span className="text-xs text-zinc-400 font-semibold mr-1">Etapas:</span>
                {page.quiz.questions.map((_, qIdx) => (
                  <div key={qIdx} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentQuizStep(qIdx);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        currentQuizStep === qIdx
                          ? "bg-purple-600 text-white shadow"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Etapa {qIdx + 1}
                    </button>

                    {/* Move question left/right */}
                    {currentQuizStep === qIdx && page.quiz.questions.length > 1 && (
                      <div className="flex items-center gap-0.5 bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                        <button
                          type="button"
                          disabled={qIdx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (qIdx > 0) {
                              const qs = [...page.quiz.questions];
                              const [m] = qs.splice(qIdx, 1);
                              qs.splice(qIdx - 1, 0, m);
                              updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: qs } }));
                              setCurrentQuizStep(qIdx - 1);
                            }
                          }}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Mover Pergunta para Trás"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={qIdx >= page.quiz.questions.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (qIdx < page.quiz.questions.length - 1) {
                              const qs = [...page.quiz.questions];
                              const [m] = qs.splice(qIdx, 1);
                              qs.splice(qIdx + 1, 0, m);
                              updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: qs } }));
                              setCurrentQuizStep(qIdx + 1);
                            }
                          }}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Mover Pergunta para Frente"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Active Question Box */}
            <div
              className={`max-w-2xl mx-auto ${getRadiusClass(page.quiz.cardRadius)} ${getPaddingClass(
                page.quiz.cardPadding
              )} bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl shadow-2xl relative`}
            >
              {/* Question counter & progress */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Etapa {currentQuizStep + 1} de {page.quiz.questions.length}
                </span>
                <div className="flex gap-1.5">
                  {page.quiz.questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentQuizStep
                          ? "w-8 bg-purple-500"
                          : idx < currentQuizStep
                          ? "w-4 bg-purple-900"
                          : "w-4 bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-lg sm:text-2xl font-bold text-white mb-2">
                <InlineEditableText
                  value={currentQ.question}
                  onChange={(newVal) =>
                    updateP((p) => {
                      const nextQ = [...p.quiz.questions];
                      nextQ[currentQuizStep] = { ...nextQ[currentQuizStep], question: newVal };
                      return { ...p, quiz: { ...p.quiz, questions: nextQ } };
                    })
                  }
                  isEditorPreview={isEditorPreview}
                  tag="h3"
                  placeholder="Texto da pergunta..."
                  fieldLabel="Pergunta"
                />
              </div>

              {currentQ.description && (
                <div className="text-xs sm:text-sm text-zinc-400 mb-6">
                  <InlineEditableText
                    value={currentQ.description}
                    onChange={(newVal) =>
                      updateP((p) => {
                        const nextQ = [...p.quiz.questions];
                        nextQ[currentQuizStep] = { ...nextQ[currentQuizStep], description: newVal };
                        return { ...p, quiz: { ...p.quiz, questions: nextQ } };
                      })
                    }
                    isEditorPreview={isEditorPreview}
                    tag="p"
                    placeholder="Instrução ou descrição da etapa..."
                  />
                </div>
              )}

              {/* Options List */}
              <div className="space-y-3 mb-6">
                {currentQ.options?.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswers[currentQ.id]?.id === opt.id;
                  return (
                    <div
                      key={opt.id || optIdx}
                      onClick={() => handleQuizOptionSelect(currentQ.id, opt, currentQuizStep)}
                      className={`p-4 rounded-2xl border transition-all relative group/opt flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-950/50"
                          : "bg-zinc-950/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 pr-2">
                        {opt.iconName && (
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <DynamicIcon name={opt.iconName} className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm sm:text-base text-white">
                            <InlineEditableText
                              value={opt.label}
                              onChange={(newVal) =>
                                updateP((p) => {
                                  const nextQ = [...p.quiz.questions];
                                  const nextOpts = [...nextQ[currentQuizStep].options];
                                  nextOpts[optIdx] = { ...nextOpts[optIdx], label: newVal };
                                  nextQ[currentQuizStep].options = nextOpts;
                                  return { ...p, quiz: { ...p.quiz, questions: nextQ } };
                                })
                              }
                              isEditorPreview={isEditorPreview}
                              tag="span"
                              placeholder="Opção..."
                            />
                          </div>
                          {opt.description && (
                            <div className="text-xs text-zinc-400 mt-0.5">
                              <InlineEditableText
                                value={opt.description}
                                onChange={(newVal) =>
                                  updateP((p) => {
                                    const nextQ = [...p.quiz.questions];
                                    const nextOpts = [...nextQ[currentQuizStep].options];
                                    nextOpts[optIdx] = { ...nextOpts[optIdx], description: newVal };
                                    nextQ[currentQuizStep].options = nextOpts;
                                    return { ...p, quiz: { ...p.quiz, questions: nextQ } };
                                  })
                                }
                                isEditorPreview={isEditorPreview}
                                tag="span"
                                placeholder="Sub-detalhes..."
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Badge and Editor Actions */}
                      <div className="flex items-center gap-2">
                        {opt.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
                            {opt.badge}
                          </span>
                        )}

                        {isEditorPreview && (
                          <div className="flex items-center gap-1 opacity-0 group-hover/opt:opacity-100 transition-opacity">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={optIdx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (optIdx > 0) {
                                  const nextQ = [...page.quiz.questions];
                                  const nextOpts = [...nextQ[currentQuizStep].options];
                                  const [m] = nextOpts.splice(optIdx, 1);
                                  nextOpts.splice(optIdx - 1, 0, m);
                                  nextQ[currentQuizStep].options = nextOpts;
                                  updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: nextQ } }));
                                }
                              }}
                              className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Subir Opção"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={optIdx >= currentQ.options.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (optIdx < currentQ.options.length - 1) {
                                  const nextQ = [...page.quiz.questions];
                                  const nextOpts = [...nextQ[currentQuizStep].options];
                                  const [m] = nextOpts.splice(optIdx, 1);
                                  nextOpts.splice(optIdx + 1, 0, m);
                                  nextQ[currentQuizStep].options = nextOpts;
                                  updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: nextQ } }));
                                }
                              }}
                              className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Descer Opção"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>

                            {/* Delete Option */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextQ = [...page.quiz.questions];
                                nextQ[currentQuizStep].options = nextQ[currentQuizStep].options.filter(
                                  (_, i) => i !== optIdx
                                );
                                updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: nextQ } }));
                              }}
                              className="p-1 rounded bg-zinc-900 text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
                              title="Excluir Opção"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Option in Editor */}
              {isEditorPreview && (
                <div className="flex justify-center mb-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextQ = [...page.quiz.questions];
                      const newOpt: QuizOption = {
                        id: `opt_${Date.now()}`,
                        label: "Nova Alternativa Estratégica",
                        badge: "Novo",
                        iconName: "CheckCircle2",
                      };
                      nextQ[currentQuizStep].options.push(newOpt);
                      updateP((p) => ({ ...p, quiz: { ...p.quiz, questions: nextQ } }));
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Opção a Esta Pergunta</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        );

      case "bentoGrid":
        if (!visibility.bentoGrid || !page.bentoGrid?.items || page.bentoGrid.items.length === 0)
          return null;

        const bentoIndex = sectionOrder.indexOf("bentoGrid");
        const bentoCols = page.bentoGrid.columns || 3;
        const bentoColsClass =
          bentoCols === 2
            ? "grid-cols-1 md:grid-cols-2"
            : bentoCols === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

        return (
          <section
            key="bentoGrid"
            id="bento-section"
            onClick={() => isEditorPreview && onSelectSection?.("bentoGrid")}
            className={`py-16 px-4 sm:px-6 ${getContainerWidthClass(
              page.bentoGrid.containerWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "bentoGrid" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="bentoGrid"
                sectionTitle="BENTO GRID & DIFERENCIAIS"
                icon={<Sliders className="w-3.5 h-3.5 text-purple-400" />}
                sectionIndex={bentoIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("bentoGrid", dir)}
                containerWidth={page.bentoGrid.containerWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, containerWidth: w } }))
                }
                columns={page.bentoGrid.columns || 3}
                onChangeColumns={(cols) =>
                  updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, columns: cols } }))
                }
                align={page.bentoGrid.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, align: a } }))
                }
                cardPadding={page.bentoGrid.cardPadding || "normal"}
                onChangeCardPadding={(pad) =>
                  updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, cardPadding: pad } }))
                }
                cardRadius={page.bentoGrid.cardRadius || "xl"}
                onChangeCardRadius={(rad) =>
                  updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, cardRadius: rad } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, bentoGrid: false } }))
                }
              />
            )}

            {/* Header */}
            <div className={`mb-12 ${getHeadingAlignClass(page.bentoGrid.align)}`}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-purple-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TECNOLOGIA & METODOLOGIA ÚNICA</span>
              </div>

              <div className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                <InlineEditableText
                  value={page.bentoGrid.title || "Por Que Este Método Supera Qualquer Outro"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, title: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="h2"
                  placeholder="Título do Bento Grid..."
                  fieldLabel="Título dos Diferenciais"
                />
              </div>

              <div className="text-zinc-400 text-sm sm:text-base max-w-2xl">
                <InlineEditableText
                  value={page.bentoGrid.subtitle || "Uma estrutura validada para gerar previsibilidade, autoridade e conversão máxima:"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, bentoGrid: { ...p.bentoGrid, subtitle: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="p"
                  placeholder="Subtítulo do Bento Grid..."
                />
              </div>
            </div>

            {/* Bento Grid Container */}
            <div className={`grid ${bentoColsClass} gap-4 sm:gap-6 auto-rows-[minmax(240px,auto)]`}>
              {page.bentoGrid.items.map((item, idx) => {
                const isPinned = pinnedCardId === item.id;
                return (
                  <div
                    key={item.id || idx}
                    onClick={(e) => {
                      if (isEditorPreview) {
                        e.stopPropagation();
                        setPinnedCardId(item.id);
                        setFloatingCardConfig({
                          type: "bento",
                          id: item.id,
                          title: item.title || `Card Bento #${idx + 1}`,
                          index: idx,
                        });
                      }
                    }}
                    style={{
                      backgroundColor: item.customBgColorHex && !item.customGradient ? item.customBgColorHex : undefined,
                      color: item.customTextColorHex ? item.customTextColorHex : undefined,
                    }}
                    className={`${getPaddingClass(page.bentoGrid.cardPadding)} ${getRadiusClass(
                      page.bentoGrid.cardRadius
                    )} ${
                      item.customGradient
                        ? item.customGradient
                        : "bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl"
                    } flex flex-col justify-between relative group/bento hover:border-purple-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer ${getBentoSizeClasses(
                      item.size
                    )} ${
                      isPinned
                        ? "ring-2 ring-purple-500 border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.4)] scale-[1.01]"
                        : ""
                    }`}
                  >
                    {/* Pinned Card Indicator Badge */}
                    {isPinned && isEditorPreview && (
                      <div className="absolute -top-3 left-4 z-40 px-3 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-xl border border-purple-400">
                        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>CARD SELECIONADO & FIXADO</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPinnedCardId(null);
                            setFloatingCardConfig(null);
                          }}
                          className="ml-1 text-purple-200 hover:text-white font-bold text-xs"
                          title="Desafixar Card"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  {/* Floating Action Controls on Card in Editor */}
                  {isEditorPreview && (
                    <div className="opacity-0 group-hover/bento:opacity-100 transition-opacity absolute top-3 right-3 z-30 flex items-center gap-1 p-1 rounded-xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-md shadow-2xl">
                      {/* Move Left / Previous */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx > 0) {
                            const nextItems = [...page.bentoGrid.items];
                            const [moved] = nextItems.splice(idx, 1);
                            nextItems.splice(idx - 1, 0, moved);
                            updateP((p) => ({
                              ...p,
                              bentoGrid: { ...p.bentoGrid, items: nextItems },
                            }));
                          }
                        }}
                        className={`p-1.5 rounded-lg bg-zinc-900 ${
                          idx === 0
                            ? "opacity-30 cursor-not-allowed"
                            : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Card para a Esquerda / Cima"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Right / Next */}
                      <button
                        type="button"
                        disabled={idx >= page.bentoGrid.items.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx < page.bentoGrid.items.length - 1) {
                            const nextItems = [...page.bentoGrid.items];
                            const [moved] = nextItems.splice(idx, 1);
                            nextItems.splice(idx + 1, 0, moved);
                            updateP((p) => ({
                              ...p,
                              bentoGrid: { ...p.bentoGrid, items: nextItems },
                            }));
                          }
                        }}
                        className={`p-1.5 rounded-lg bg-zinc-900 ${
                          idx >= page.bentoGrid.items.length - 1
                            ? "opacity-30 cursor-not-allowed"
                            : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Card para a Direita / Baixo"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Size Toggle Selector */}
                      <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                        {[
                          { id: "standard", label: "1x1", title: "Padrão (1 Coluna)" },
                          { id: "wide", label: "2x1", title: "Largo (2 Colunas)" },
                          { id: "tall", label: "1x2", title: "Alto (2 Linhas)" },
                          { id: "large", label: "2x2", title: "Destaque (2x2)" },
                        ].map((sz) => {
                          const isSelected = (item.size || "standard") === sz.id;
                          return (
                            <button
                              key={sz.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateP((p) => {
                                  const nextItems = [...p.bentoGrid.items];
                                  nextItems[idx] = { ...nextItems[idx], size: sz.id as any };
                                  return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                                });
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                              title={`Tamanho: ${sz.title}`}
                            >
                              {sz.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Change Image Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImagePicker?.({
                            type: "bento",
                            currentUrl: item.imageUrl || "",
                            itemId: item.id,
                            title: `Trocar Imagem de "${item.title}"`,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        title="Trocar Imagem do Card"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate Card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const copyItem: BentoItem = {
                            ...item,
                            id: `bento_${Date.now()}`,
                            title: `${item.title} (Cópia)`,
                          };
                          updateP((p) => ({
                            ...p,
                            bentoGrid: {
                              ...p.bentoGrid,
                              items: [
                                ...p.bentoGrid.items.slice(0, idx + 1),
                                copyItem,
                                ...p.bentoGrid.items.slice(idx + 1),
                              ],
                            },
                          }));
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        title="Duplicar Card"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateP((p) => ({
                            ...p,
                            bentoGrid: {
                              ...p.bentoGrid,
                              items: p.bentoGrid.items.filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
                        title="Excluir Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Top Icon & Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (isEditorPreview) {
                            e.stopPropagation();
                            onOpenIconPicker?.({
                              currentIcon: item.iconName || "Zap",
                              onSelect: (newIcon) => {
                                updateP((p) => {
                                  const nextItems = [...p.bentoGrid.items];
                                  nextItems[idx] = { ...nextItems[idx], iconName: newIcon };
                                  return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                                });
                              },
                              title: `Escolher Ícone de "${item.title}"`,
                            });
                          }
                        }}
                        className={`w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${
                          isEditorPreview ? "hover:scale-110 cursor-pointer text-purple-400 hover:border-purple-500" : ""
                        }`}
                        title={isEditorPreview ? "Clique para trocar o ícone" : undefined}
                      >
                        <DynamicIcon name={item.iconName || "Zap"} className={`w-6 h-6 ${theme.iconText}`} />
                      </button>

                      {item.tag && (
                        <div className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
                          <InlineEditableText
                            value={item.tag}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const nextItems = [...p.bentoGrid.items];
                                nextItems[idx] = { ...nextItems[idx], tag: newVal };
                                return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                            placeholder="Tag..."
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Title */}
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                      <InlineEditableText
                        value={item.title}
                        onChange={(newVal) =>
                          updateP((p) => {
                            const nextItems = [...p.bentoGrid.items];
                            nextItems[idx] = { ...nextItems[idx], title: newVal };
                            return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                          })
                        }
                        isEditorPreview={isEditorPreview}
                        tag="h3"
                        placeholder="Título do Card..."
                        fieldLabel="Título do Diferencial"
                      />
                    </div>

                    {/* Card Description */}
                    <div className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-4">
                      <InlineEditableText
                        value={item.description}
                        onChange={(newVal) =>
                          updateP((p) => {
                            const nextItems = [...p.bentoGrid.items];
                            nextItems[idx] = { ...nextItems[idx], description: newVal };
                            return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                          })
                        }
                        isEditorPreview={isEditorPreview}
                        tag="p"
                        multiline={true}
                        placeholder="Descrição detalhada..."
                      />
                    </div>
                  </div>

                  {/* Optional Image or Metric preview */}
                  <div>
                    {item.imageUrl && (
                      <div className="rounded-2xl overflow-hidden mb-4 border border-zinc-800 bg-zinc-950 aspect-video relative group/img">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300"
                          style={{
                            objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`,
                            transform: `scale(${(item.imageZoom ?? 100) / 100})`,
                            transformOrigin: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`,
                          }}
                          referrerPolicy="no-referrer"
                        />
                        {isEditorPreview && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenImagePicker?.({
                                  type: "bento",
                                  currentUrl: item.imageUrl || "",
                                  itemId: item.id,
                                  title: `Trocar Imagem de "${item.title}"`,
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Trocar Foto</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateP((p) => {
                                  const nextItems = [...p.bentoGrid.items];
                                  nextItems[idx] = { ...nextItems[idx], imageUrl: undefined };
                                  return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                                });
                              }}
                              className="p-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold cursor-pointer shadow-lg"
                              title="Remover Imagem do Card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {item.metric && (
                      <div className="pt-4 border-t border-zinc-800/80 flex items-baseline gap-2">
                        <span className={`text-2xl font-extrabold ${theme.headingGradient}`}>
                          <InlineEditableText
                            value={item.metric}
                            onChange={(newVal) =>
                              updateP((p) => {
                                const nextItems = [...p.bentoGrid.items];
                                nextItems[idx] = { ...nextItems[idx], metric: newVal };
                                return { ...p, bentoGrid: { ...p.bentoGrid, items: nextItems } };
                              })
                            }
                            isEditorPreview={isEditorPreview}
                            tag="span"
                            placeholder="+45%"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>

            {/* Add Bento Card Button in Editor */}
            {isEditorPreview && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newBento: BentoItem = {
                      id: `bento_${Date.now()}`,
                      size: "standard",
                      title: "Novo Diferencial Competitivo",
                      description: "Descreva o benefício exclusivo que transforma os resultados do seu cliente.",
                      iconName: "Sparkles",
                      tag: "Exclusivo",
                      metric: "+450% Escala",
                    };
                    updateP((p) => ({
                      ...p,
                      bentoGrid: {
                        ...p.bentoGrid,
                        items: [...p.bentoGrid.items, newBento],
                      },
                    }));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Novo Card ao Bento Grid</span>
                </button>
              </div>
            )}
          </section>
        );

      case "testimonials":
        if (
          !visibility.testimonials ||
          !page.testimonials?.items ||
          page.testimonials.items.length === 0
        )
          return null;

        const testIndex = sectionOrder.indexOf("testimonials");
        const testCols = page.testimonials.columns || 3;
        const testColsClass =
          testCols === 2
            ? "grid-cols-1 md:grid-cols-2"
            : testCols === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

        return (
          <section
            key="testimonials"
            id="testimonials-section"
            onClick={() => isEditorPreview && onSelectSection?.("testimonials")}
            className={`py-16 px-4 sm:px-6 ${getContainerWidthClass(
              page.testimonials.containerWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "testimonials" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="testimonials"
                sectionTitle="DEPOIMENTOS & CASOS DE SUCESSO"
                icon={<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                sectionIndex={testIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("testimonials", dir)}
                containerWidth={page.testimonials.containerWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({ ...p, testimonials: { ...p.testimonials, containerWidth: w } }))
                }
                columns={page.testimonials.columns || 3}
                onChangeColumns={(cols) =>
                  updateP((p) => ({ ...p, testimonials: { ...p.testimonials, columns: cols } }))
                }
                align={page.testimonials.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, testimonials: { ...p.testimonials, align: a } }))
                }
                cardPadding={page.testimonials.cardPadding || "normal"}
                onChangeCardPadding={(pad) =>
                  updateP((p) => ({ ...p, testimonials: { ...p.testimonials, cardPadding: pad } }))
                }
                cardRadius={page.testimonials.cardRadius || "xl"}
                onChangeCardRadius={(rad) =>
                  updateP((p) => ({ ...p, testimonials: { ...p.testimonials, cardRadius: rad } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, testimonials: false } }))
                }
              />
            )}

            {/* Header */}
            <div className={`mb-12 ${getHeadingAlignClass(page.testimonials.align)}`}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>CASOS DE SUCESSO COMPROVADOS</span>
              </div>

              <div className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                <InlineEditableText
                  value={page.testimonials.title || "O Que Quem Já Chegou Lá Está Dizendo"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, testimonials: { ...p.testimonials, title: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="h2"
                  placeholder="Título dos Depoimentos..."
                  fieldLabel="Título dos Depoimentos"
                />
              </div>

              <div className="text-zinc-400 text-sm sm:text-base max-w-2xl">
                <InlineEditableText
                  value={page.testimonials.subtitle || "Resultados auditados e depoimentos reais dos nossos parceiros e mentorados:"}
                  onChange={(newVal) =>
                    updateP((p) => ({ ...p, testimonials: { ...p.testimonials, subtitle: newVal } }))
                  }
                  isEditorPreview={isEditorPreview}
                  tag="p"
                  placeholder="Subtítulo dos Depoimentos..."
                />
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className={`grid ${testColsClass} gap-4 sm:gap-6`}>
              {page.testimonials.items.map((item, idx) => {
                const isPinned = pinnedCardId === item.id;
                return (
                  <div
                    key={item.id || idx}
                    onClick={(e) => {
                      if (isEditorPreview) {
                        e.stopPropagation();
                        setPinnedCardId(item.id);
                        setFloatingCardConfig({
                          type: "testimonial",
                          id: item.id,
                          title: `Depoimento: ${item.name}`,
                          index: idx,
                        });
                      }
                    }}
                    style={{
                      backgroundColor: item.customBgColorHex && !item.customGradient ? item.customBgColorHex : undefined,
                      color: item.customTextColorHex ? item.customTextColorHex : undefined,
                    }}
                    className={`${getPaddingClass(page.testimonials.cardPadding)} ${getRadiusClass(
                      page.testimonials.cardRadius
                    )} ${
                      item.customGradient
                        ? item.customGradient
                        : "bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl"
                    } flex flex-col justify-between relative group/test hover:border-purple-500/40 hover:bg-zinc-900/80 transition-all cursor-pointer ${
                      isPinned
                        ? "ring-2 ring-purple-500 border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.4)] scale-[1.01]"
                        : ""
                    }`}
                  >
                    {/* Pinned Card Indicator Badge */}
                    {isPinned && isEditorPreview && (
                      <div className="absolute -top-3 left-4 z-40 px-3 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-xl border border-purple-400">
                        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>CARD SELECIONADO & FIXADO</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPinnedCardId(null);
                            setFloatingCardConfig(null);
                          }}
                          className="ml-1 text-purple-200 hover:text-white font-bold text-xs"
                          title="Desafixar Card"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  {/* Floating Action Controls on Card in Editor */}
                  {isEditorPreview && (
                    <div className="opacity-0 group-hover/test:opacity-100 transition-opacity absolute top-3 right-3 z-30 flex items-center gap-1 p-1 rounded-xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-md shadow-2xl">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx > 0) {
                            const next = [...page.testimonials.items];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx - 1, 0, m);
                            updateP((p) => ({ ...p, testimonials: { ...p.testimonials, items: next } }));
                          }
                        }}
                        className={`p-1.5 rounded-lg bg-zinc-900 ${
                          idx === 0
                            ? "opacity-30 cursor-not-allowed"
                            : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Depoimento para a Esquerda"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={idx >= page.testimonials.items.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx < page.testimonials.items.length - 1) {
                            const next = [...page.testimonials.items];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx + 1, 0, m);
                            updateP((p) => ({ ...p, testimonials: { ...p.testimonials, items: next } }));
                          }
                        }}
                        className={`p-1.5 rounded-lg bg-zinc-900 ${
                          idx >= page.testimonials.items.length - 1
                            ? "opacity-30 cursor-not-allowed"
                            : "text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        }`}
                        title="Mover Depoimento para a Direita"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Change Avatar Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImagePicker?.({
                            type: "testimonial",
                            currentUrl: item.avatarUrl || "",
                            itemId: item.id,
                            title: `Trocar Foto de "${item.name}"`,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        title="Trocar Foto do Depoimento"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const copyItem: TestimonialItem = {
                            ...item,
                            id: `test_${Date.now()}`,
                            name: `${item.name} (Cópia)`,
                          };
                          updateP((p) => ({
                            ...p,
                            testimonials: {
                              ...p.testimonials,
                              items: [
                                ...p.testimonials.items.slice(0, idx + 1),
                                copyItem,
                                ...p.testimonials.items.slice(idx + 1),
                              ],
                            },
                          }));
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white hover:bg-purple-600 cursor-pointer"
                        title="Duplicar Depoimento"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateP((p) => ({
                            ...p,
                            testimonials: {
                              ...p.testimonials,
                              items: p.testimonials.items.filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
                        title="Excluir Depoimento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Stars Rating (Interactive in editor) */}
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={!isEditorPreview}
                          onClick={(e) => {
                            if (isEditorPreview) {
                              e.stopPropagation();
                              updateP((p) => {
                                const nextItems = [...p.testimonials.items];
                                nextItems[idx] = { ...nextItems[idx], rating: star };
                                return { ...p, testimonials: { ...p.testimonials, items: nextItems } };
                              });
                            }
                          }}
                          className={`${isEditorPreview ? "hover:scale-125 cursor-pointer p-0.5" : ""}`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (item.rating || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Testimonial Quote */}
                    <div className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-medium italic">
                      <InlineEditableText
                        value={item.content}
                        onChange={(newVal) =>
                          updateP((p) => {
                            const nextItems = [...p.testimonials.items];
                            nextItems[idx] = { ...nextItems[idx], content: newVal };
                            return { ...p, testimonials: { ...p.testimonials, items: nextItems } };
                          })
                        }
                        isEditorPreview={isEditorPreview}
                        tag="p"
                        multiline={true}
                        placeholder="Depoimento do cliente..."
                        fieldLabel="Depoimento"
                      />
                    </div>
                  </div>

                  {/* Author Meta */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={(e) => {
                        if (isEditorPreview) {
                          e.stopPropagation();
                          onOpenImagePicker?.({
                            type: "testimonial",
                            currentUrl: item.avatarUrl || "",
                            itemId: item.id,
                            title: `Trocar Foto de "${item.name}"`,
                          });
                        }
                      }}
                      className={`relative ${isEditorPreview ? "hover:opacity-80 cursor-pointer" : ""}`}
                    >
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40"
                        style={{
                          objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`,
                          transform: `scale(${(item.imageZoom ?? 100) / 100})`,
                          transformOrigin: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`,
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {isEditorPreview && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate">
                        <InlineEditableText
                          value={item.name}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const nextItems = [...p.testimonials.items];
                              nextItems[idx] = { ...nextItems[idx], name: newVal };
                              return { ...p, testimonials: { ...p.testimonials, items: nextItems } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                          placeholder="Nome..."
                        />
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        <InlineEditableText
                          value={item.companyOrCity || item.role || "Cliente Verificado"}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const nextItems = [...p.testimonials.items];
                              nextItems[idx] = { ...nextItems[idx], companyOrCity: newVal };
                              return { ...p, testimonials: { ...p.testimonials, items: nextItems } };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="span"
                          placeholder="Cargo / Empresa..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Add Testimonial Button in Editor */}
            {isEditorPreview && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTest: TestimonialItem = {
                      id: `test_${Date.now()}`,
                      name: "Juliana Mendes",
                      role: "CEO & Fundadora",
                      companyOrCity: "Mendes Tech - São Paulo, SP",
                      content:
                        "Implementamos a metodologia e em menos de 30 dias triplicamos a taxa de conversão das nossas campanhas.",
                      avatarUrl:
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                      rating: 5,
                      resultHighlight: "3x Mais Vendas",
                      verified: true,
                    };
                    updateP((p) => ({
                      ...p,
                      testimonials: {
                        ...p.testimonials,
                        items: [...p.testimonials.items, newTest],
                      },
                    }));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Novo Depoimento</span>
                </button>
              </div>
            )}
          </section>
        );

      case "formSection":
        if (!visibility.formSection || !page.formSection) return null;
        const formIndex = sectionOrder.indexOf("formSection");
        return (
          <section
            key="formSection"
            id="form-section"
            onClick={() => isEditorPreview && onSelectSection?.("formSection")}
            className={`py-16 px-4 sm:px-6 ${getContainerWidthClass(
              page.formSection.containerWidth || page.formSection.cardWidth
            )} mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "formSection" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="formSection"
                sectionTitle="FORMULÁRIO DE OFERTA & CONVERSÃO"
                icon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
                sectionIndex={formIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("formSection", dir)}
                containerWidth={page.formSection.containerWidth || page.formSection.cardWidth || "normal"}
                onChangeContainerWidth={(w) =>
                  updateP((p) => ({
                    ...p,
                    formSection: { ...p.formSection, containerWidth: w, cardWidth: w },
                  }))
                }
                align={page.formSection.align || "center"}
                onChangeAlign={(a) =>
                  updateP((p) => ({ ...p, formSection: { ...p.formSection, align: a } }))
                }
                cardPadding={page.formSection.cardPadding || "normal"}
                onChangeCardPadding={(pad) =>
                  updateP((p) => ({ ...p, formSection: { ...p.formSection, cardPadding: pad } }))
                }
                cardRadius={page.formSection.cardRadius || "xl"}
                onChangeCardRadius={(rad) =>
                  updateP((p) => ({ ...p, formSection: { ...p.formSection, cardRadius: rad } }))
                }
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, formSection: false } }))
                }
              />
            )}

            <div
              className={`max-w-2xl mx-auto ${getRadiusClass(
                page.formSection.cardRadius
              )} ${getPaddingClass(
                page.formSection.cardPadding
              )} bg-zinc-900/90 border border-zinc-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden`}
            >
              {/* Glowing Background Accent */}
              <div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: theme.primaryColor }}
              />

              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Solicitação Enviada com Sucesso!</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Nossa equipe executiva entrará em contato via WhatsApp e e-mail nos próximos minutos para dar continuidade ao seu atendimento.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Enviar Outro Contato
                  </button>
                </div>
              ) : (
                <>
                  {/* Form Header */}
                  <div className={`mb-8 ${getHeadingAlignClass(page.formSection.align)}`}>
                    <DraggableElement
                      elementId="form-badge"
                      offset={getElementOffset("form-badge")}
                      onOffsetChange={(o) => setElementOffset("form-badge", o)}
                      isEditorPreview={isEditorPreview}
                      label="Selo SSL"
                      inline
                      className="mb-3"
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-semibold text-emerald-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span>CONEXÃO CRIPTOGRAFADA SSL 256-BIT</span>
                      </div>
                    </DraggableElement>

                    <DraggableElement
                      elementId="form-title"
                      offset={getElementOffset("form-title")}
                      onOffsetChange={(o) => setElementOffset("form-title", o)}
                      isEditorPreview={isEditorPreview}
                      label="Título do Formulário"
                      className="mb-2"
                    >
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        <InlineEditableText
                          value={page.formSection.title || "Garanta Sua Condição Exclusiva Agora"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, formSection: { ...p.formSection, title: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="h2"
                          placeholder="Título do Formulário..."
                          fieldLabel="Título do Formulário"
                        />
                      </div>
                    </DraggableElement>

                    <DraggableElement
                      elementId="form-subtitle"
                      offset={getElementOffset("form-subtitle")}
                      onOffsetChange={(o) => setElementOffset("form-subtitle", o)}
                      isEditorPreview={isEditorPreview}
                      label="Subtítulo do Formulário"
                    >
                      <div className="text-zinc-400 text-xs sm:text-sm">
                        <InlineEditableText
                          value={page.formSection.subtitle || "Preencha seus dados abaixo para receber acesso prioritário:"}
                          onChange={(newVal) =>
                            updateP((p) => ({ ...p, formSection: { ...p.formSection, subtitle: newVal } }))
                          }
                          isEditorPreview={isEditorPreview}
                          tag="p"
                          placeholder="Subtítulo do Formulário..."
                        />
                      </div>
                    </DraggableElement>
                  </div>

                  {submitError && (
                    <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo Silva"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                          WhatsApp / Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(formatBrazilianPhone(e.target.value))}
                          placeholder="(11) 98765-4321"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                          Melhor E-mail Corporativo *
                        </label>
                        <input
                          type="email"
                          required
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="carlos@empresa.com.br"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <VisualEditableButton
                        buttonId="form-submit-cta"
                        text={page.formSection.ctaButtonText || "Quero Garantir Minha Vaga Agora"}
                        onTextChange={(newVal) =>
                          updateP((p) => ({
                            ...p,
                            formSection: { ...p.formSection, ctaButtonText: newVal },
                          }))
                        }
                        buttonStyle={getButtonStyle("form-submit-cta")}
                        onStyleChange={(s) => setButtonStyle("form-submit-cta", s)}
                        isEditorPreview={isEditorPreview}
                        themeGlow={theme.ctaGlow}
                        nicheContext={page.niche}
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                      />
                    </div>

                    {/* Guarantee Text */}
                    <div className="pt-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <InlineEditableText
                        value={page.formSection.guaranteeText || "Seus dados estão 100% seguros e protegidos pela LGPD."}
                        onChange={(newVal) =>
                          updateP((p) => ({
                            ...p,
                            formSection: { ...p.formSection, guaranteeText: newVal },
                          }))
                        }
                        isEditorPreview={isEditorPreview}
                        tag="span"
                        placeholder="Texto da garantia..."
                      />
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        );

      case "faq":
        if (!visibility.faq || !page.faq || page.faq.length === 0) return null;
        const faqIndex = sectionOrder.indexOf("faq");
        return (
          <section
            key="faq"
            id="faq-section"
            onClick={() => isEditorPreview && onSelectSection?.("faq")}
            className={`py-16 px-4 sm:px-6 max-w-5xl mx-auto relative ${
              isEditorPreview
                ? "cursor-pointer ring-1 ring-zinc-800/80 hover:ring-purple-500/50 rounded-3xl transition-all p-4 mb-6"
                : ""
            } ${activeSection === "faq" && isEditorPreview ? "ring-2 ring-purple-500 bg-purple-950/10 shadow-2xl" : ""}`}
          >
            {/* Quick Floating Controls Bar in Editor */}
            {isEditorPreview && (
              <SectionControlToolbar
                sectionId="faq"
                sectionTitle="FAQ - PERGUNTAS FREQUENTES"
                icon={<HelpCircle className="w-3.5 h-3.5 text-purple-400" />}
                sectionIndex={faqIndex}
                totalSections={sectionOrder.length}
                onMoveSection={(dir) => handleMoveSection("faq", dir)}
                onHideSection={() =>
                  updateP((p) => ({ ...p, visibility: { ...p.visibility, faq: false } }))
                }
              />
            )}

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-purple-400 mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>TIRE TODAS AS SUAS DÚVIDAS</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Perguntas Frequentes
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
                Tudo o que você precisa saber antes de dar o próximo passo:
              </p>
            </div>

            {/* Accordion FAQ Items */}
            <div className="max-w-3xl mx-auto space-y-3">
              {page.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.id || idx}
                    className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 backdrop-blur-xl overflow-hidden relative group/faq"
                  >
                    {/* Move & Delete FAQ Buttons in Editor */}
                    {isEditorPreview && (
                      <div className="opacity-0 group-hover/faq:opacity-100 transition-opacity absolute top-3 right-12 z-20 flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/95 border border-zinc-800 shadow-xl">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (idx > 0) {
                              const nextFaq = [...page.faq];
                              const [m] = nextFaq.splice(idx, 1);
                              nextFaq.splice(idx - 1, 0, m);
                              updateP((p) => ({ ...p, faq: nextFaq }));
                            }
                          }}
                          className={`p-1 rounded bg-zinc-900 ${
                            idx === 0 ? "opacity-30 cursor-not-allowed" : "text-zinc-400 hover:text-white cursor-pointer"
                          }`}
                          title="Subir Pergunta"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx >= page.faq.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (idx < page.faq.length - 1) {
                              const nextFaq = [...page.faq];
                              const [m] = nextFaq.splice(idx, 1);
                              nextFaq.splice(idx + 1, 0, m);
                              updateP((p) => ({ ...p, faq: nextFaq }));
                            }
                          }}
                          className={`p-1 rounded bg-zinc-900 ${
                            idx >= page.faq.length - 1 ? "opacity-30 cursor-not-allowed" : "text-zinc-400 hover:text-white cursor-pointer"
                          }`}
                          title="Descer Pergunta"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const copy = { ...item, id: `faq_${Date.now()}`, question: `${item.question} (Cópia)` };
                            const next = [
                              ...page.faq.slice(0, idx + 1),
                              copy,
                              ...page.faq.slice(idx + 1),
                            ];
                            updateP((p) => ({ ...p, faq: next }));
                          }}
                          className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                          title="Duplicar Pergunta"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateP((p) => ({
                              ...p,
                              faq: p.faq.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 rounded bg-zinc-900 text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
                          title="Excluir Pergunta"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="text-base sm:text-lg font-bold text-white pr-4 flex-1">
                        <InlineEditableText
                          value={item.question}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const nextFaq = [...page.faq];
                              nextFaq[idx] = { ...nextFaq[idx], question: newVal };
                              return { ...p, faq: nextFaq };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="h3"
                          placeholder="Pergunta..."
                          fieldLabel="Pergunta"
                        />
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? "rotate-180 text-purple-400" : ""
                        }`}
                      />
                    </div>

                    {(isOpen || isEditorPreview) && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-zinc-800/60">
                        <InlineEditableText
                          value={item.answer}
                          onChange={(newVal) =>
                            updateP((p) => {
                              const nextFaq = [...page.faq];
                              nextFaq[idx] = { ...nextFaq[idx], answer: newVal };
                              return { ...p, faq: nextFaq };
                            })
                          }
                          isEditorPreview={isEditorPreview}
                          tag="p"
                          multiline={true}
                          placeholder="Resposta detalhada e persuasiva..."
                          fieldLabel="Resposta"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add FAQ Button in Editor */}
            {isEditorPreview && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFaq: FaqItem = {
                      id: `faq_${Date.now()}`,
                      question: "Como funciona a garantia incondicional de satisfação?",
                      answer:
                        "Se por qualquer motivo dentro do prazo legal você não ficar 100% satisfeito com a entrega, basta um único e-mail para reembolsarmos 100% do seu investimento.",
                    };
                    updateP((p) => ({
                      ...p,
                      faq: [...p.faq, newFaq],
                    }));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Nova Pergunta Frequente</span>
                </button>
              </div>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        page.theme === "light"
          ? "bg-slate-50 text-slate-900"
          : "bg-zinc-950 text-white"
      } font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden`}
      style={
        page.backgroundType === "solid" && page.backgroundColorHex
          ? { backgroundColor: page.backgroundColorHex }
          : page.backgroundType === "gradient" && page.backgroundGradient
          ? { background: page.backgroundGradient }
          : page.backgroundType === "image" && page.backgroundImageUrl
          ? {
              backgroundImage: `url(${page.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : page.theme === "light"
          ? { background: "#f8fafc" }
          : {
              background: `radial-gradient(ellipse at 50% 0%, ${theme.glowColor} 0%, transparent 60%), #09090b`,
            }
      }
    >
      {/* Background Gradients */}
      {page.theme !== "light" && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-[140px] opacity-15"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="absolute top-2/3 -right-48 w-96 h-96 rounded-full blur-[140px] opacity-15"
            style={{ backgroundColor: theme.secondaryColor }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10">
        {/* HEADER NAVBAR (MENU SUPERIOR DE REPARTIÇÕES) */}
        {page.headerNav?.enabled && (
          <HeaderNavbar
            config={page.headerNav}
            accentColor={page.accentColor}
            theme={page.theme}
            isEditorPreview={isEditorPreview}
            onUpdateConfig={(newNav) => updateP((p) => ({ ...p, headerNav: newNav }))}
            onSelectSection={onSelectSection}
            onOpenImagePicker={onOpenImagePicker}
          />
        )}
        {sectionOrder.map((secName) => renderSection(secName))}

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 border-t border-zinc-900 bg-zinc-950/80 text-center text-xs text-zinc-500">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="font-bold text-sm text-zinc-300">
              <InlineEditableText
                value={page.title || "Landing Page Oficial"}
                onChange={(newVal) => updateP((p) => ({ ...p, title: newVal }))}
                isEditorPreview={isEditorPreview}
                tag="span"
                placeholder="Nome da Empresa..."
              />
            </div>
            <div>
              <InlineEditableText
                value="Todos os direitos reservados. Este site não faz parte nem é endossado pelo Facebook, Google ou qualquer entidade governamental."
                onChange={() => {}}
                isEditorPreview={false}
                tag="p"
                className="max-w-2xl mx-auto leading-relaxed"
              />
            </div>
            <div className="pt-2 text-[11px] text-zinc-600">
              © {new Date().getFullYear()} — Plataforma construída para alta conversão e escala.
            </div>
          </div>
        </footer>
      </div>

      {/* Sticky Mobile CTA Bar */}
      {visibility.stickyMobileCta && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800 z-40">
          <button
            type="button"
            onClick={() => {
              if (!isEditorPreview) {
                scrollToSection("form-section");
              }
            }}
            className={`w-full py-3.5 px-4 rounded-xl ${theme.ctaBg} text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2`}
          >
            <span>{page.hero?.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Draggable Floating Edit Panel for Selected Card */}
      {isEditorPreview && floatingCardConfig && (
        <DraggableFloatingCard
          isOpen={Boolean(floatingCardConfig)}
          title={floatingCardConfig.title}
          badge="PAINEL FLUTUANTE DE EDIÇÃO"
          icon={Sliders}
          initialX={Math.min(typeof window !== "undefined" ? window.innerWidth - 440 : 600, 60)}
          initialY={140}
          widthClass="w-96 sm:w-[420px]"
          onClose={() => {
            setFloatingCardConfig(null);
            setPinnedCardId(null);
          }}
        >
          {/* 1. BENTO CARD FLOATING EDITOR */}
          {floatingCardConfig.type === "bento" && (() => {
            const bentoIdx = page.bentoGrid.items.findIndex((i) => i.id === floatingCardConfig.id);
            if (bentoIdx === -1) return <p className="text-xs text-zinc-400">Card não encontrado.</p>;
            const item = page.bentoGrid.items[bentoIdx];

            return (
              <div className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-zinc-300 font-bold">Título do Card</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      updateP((p) => {
                        const next = [...p.bentoGrid.items];
                        next[bentoIdx] = { ...next[bentoIdx], title: newVal };
                        return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-zinc-300 font-bold">Descrição</label>
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      updateP((p) => {
                        const next = [...p.bentoGrid.items];
                        next[bentoIdx] = { ...next[bentoIdx], description: newVal };
                        return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                {/* Tag & Metric */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-bold">Selo / Tag</label>
                    <input
                      type="text"
                      value={item.tag || ""}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        updateP((p) => {
                          const next = [...p.bentoGrid.items];
                          next[bentoIdx] = { ...next[bentoIdx], tag: newVal };
                          return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                        });
                      }}
                      placeholder="Ex: Exclusivo"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-bold">Métrica / Destaque</label>
                    <input
                      type="text"
                      value={item.metric || ""}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        updateP((p) => {
                          const next = [...p.bentoGrid.items];
                          next[bentoIdx] = { ...next[bentoIdx], metric: newVal };
                          return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                        });
                      }}
                      placeholder="Ex: +450%"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Custom Card Color & Gradient Preset Selector */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-300 font-bold">Estilo de Cor do Card</label>
                    {(item.customGradient || item.customBgColorHex) && (
                      <button
                        type="button"
                        onClick={() => {
                          updateP((p) => {
                            const next = [...p.bentoGrid.items];
                            next[bentoIdx] = {
                              ...next[bentoIdx],
                              customGradient: undefined,
                              customBgColorHex: undefined,
                              customTextColorHex: undefined,
                            };
                            return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                          });
                        }}
                        className="text-[10px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
                      >
                        Resetar Cor
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CARD_PRESET_GRADIENTS.map((preset) => {
                      const isSel = (item.customGradient || "") === preset.gradient;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = {
                                ...next[bentoIdx],
                                customGradient: preset.gradient || undefined,
                              };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold text-left flex items-center gap-2 cursor-pointer transition-all ${
                            isSel
                              ? "border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500"
                              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: preset.colorHex }}
                          />
                          <span className="truncate">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual Hex Override */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 font-bold mb-1">Fundo (Hex)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={item.customBgColorHex || "#18181b"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = {
                                ...next[bentoIdx],
                                customBgColorHex: val,
                                customGradient: undefined,
                              };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={item.customBgColorHex || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = {
                                ...next[bentoIdx],
                                customBgColorHex: val,
                                customGradient: undefined,
                              };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          placeholder="#18181b"
                          className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 font-bold mb-1">Texto (Hex)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={item.customTextColorHex || "#ffffff"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = {
                                ...next[bentoIdx],
                                customTextColorHex: val,
                              };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={item.customTextColorHex || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = {
                                ...next[bentoIdx],
                                customTextColorHex: val,
                              };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          placeholder="#ffffff"
                          className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media & Icon Pickers */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenIconPicker?.({
                        currentIcon: item.iconName || "Zap",
                        onSelect: (newIcon) => {
                          updateP((p) => {
                            const next = [...p.bentoGrid.items];
                            next[bentoIdx] = { ...next[bentoIdx], iconName: newIcon };
                            return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                          });
                        },
                        title: `Trocar Ícone: ${item.title}`,
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Trocar Ícone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenImagePicker?.({
                        type: "bento",
                        currentUrl: item.imageUrl || "",
                        itemId: item.id,
                        title: `Trocar Imagem de "${item.title}"`,
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Trocar Foto</span>
                  </button>
                </div>

                {/* Column Size Selector */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  <label className="block text-zinc-300 font-bold">Proporção / Colunas no Grid</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "standard", label: "1x1", title: "Padrão" },
                      { id: "wide", label: "2x1", title: "Largo" },
                      { id: "tall", label: "1x2", title: "Alto" },
                      { id: "large", label: "2x2", title: "Destaque 2x2" },
                    ].map((sz) => {
                      const isSel = (item.size || "standard") === sz.id;
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => {
                            updateP((p) => {
                              const next = [...p.bentoGrid.items];
                              next[bentoIdx] = { ...next[bentoIdx], size: sz.id as any };
                              return { ...p, bentoGrid: { ...p.bentoGrid, items: next } };
                            });
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? "bg-purple-600 text-white shadow"
                              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                          }`}
                        >
                          {sz.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. TESTIMONIAL FLOATING EDITOR */}
          {floatingCardConfig.type === "testimonial" && (() => {
            const testIdx = page.testimonials.items.findIndex((i) => i.id === floatingCardConfig.id);
            if (testIdx === -1) return <p className="text-xs text-zinc-400">Depoimento não encontrado.</p>;
            const item = page.testimonials.items[testIdx];

            return (
              <div className="space-y-4 text-xs">
                {/* Name & Role */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-bold">Nome do Cliente</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateP((p) => {
                          const next = [...p.testimonials.items];
                          next[testIdx] = { ...next[testIdx], name: val };
                          return { ...p, testimonials: { ...p.testimonials, items: next } };
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-bold">Cargo / Cidade</label>
                    <input
                      type="text"
                      value={item.companyOrCity || item.role || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateP((p) => {
                          const next = [...p.testimonials.items];
                          next[testIdx] = { ...next[testIdx], companyOrCity: val, role: val };
                          return { ...p, testimonials: { ...p.testimonials, items: next } };
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="block text-zinc-300 font-bold">Depoimento Completo</label>
                  <textarea
                    rows={3}
                    value={item.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateP((p) => {
                        const next = [...p.testimonials.items];
                        next[testIdx] = { ...next[testIdx], content: val };
                        return { ...p, testimonials: { ...p.testimonials, items: next } };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                {/* Result highlight */}
                <div className="space-y-1">
                  <label className="block text-zinc-300 font-bold">Resultado de Destaque</label>
                  <input
                    type="text"
                    value={item.resultHighlight || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateP((p) => {
                        const next = [...p.testimonials.items];
                        next[testIdx] = { ...next[testIdx], resultHighlight: val };
                        return { ...p, testimonials: { ...p.testimonials, items: next } };
                      });
                    }}
                    placeholder="Ex: +300% de Lucro em 30 Dias"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                {/* Preset Colors */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <label className="block text-zinc-300 font-bold">Estilo de Cor do Card</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CARD_PRESET_GRADIENTS.map((preset) => {
                      const isSel = (item.customGradient || "") === preset.gradient;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateP((p) => {
                              const next = [...p.testimonials.items];
                              next[testIdx] = {
                                ...next[testIdx],
                                customGradient: preset.gradient || undefined,
                              };
                              return { ...p, testimonials: { ...p.testimonials, items: next } };
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold text-left flex items-center gap-2 cursor-pointer transition-all ${
                            isSel
                              ? "border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500"
                              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: preset.colorHex }}
                          />
                          <span className="truncate">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photo upload button */}
                <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenImagePicker?.({
                        type: "testimonial",
                        currentUrl: item.avatarUrl || "",
                        itemId: item.id,
                        title: `Trocar Foto de "${item.name}"`,
                      });
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Trocar Foto do Cliente</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </DraggableFloatingCard>
      )}
    </div>
  );
};
