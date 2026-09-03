import React, { useState, useEffect } from "react";
import { LandingPage, AccentColor, HeroModel } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { applyThematicImagesToPage } from "../utils/imageResolver";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  MapPin,
  Target,
  Palette,
  X,
  ArrowRight,
  AlertCircle,
  Lightbulb,
  Plus,
  Trash2,
  Navigation,
  Loader2,
  Briefcase,
  GraduationCap,
  Laptop,
  Building2,
  UserCheck,
  Check,
  Layout,
  SunMoon,
  Sliders,
} from "lucide-react";

interface AIModalGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onPageGenerated: (page: LandingPage) => void;
}

export interface NicheGroup {
  category: string;
  icon: any;
  items: string[];
}

export const CATEGORIZED_NICHES: NicheGroup[] = [
  {
    category: "Consultoria",
    icon: Briefcase,
    items: [
      "Consultoria Empresarial & Gestão",
      "Consultoria Financeira & Patrimônio",
      "Consultoria Comercial & Processos de Vendas",
      "Consultoria de Marketing Digital & CRO",
      "Consultoria de TI, Software & Operações",
      "Consultoria de Recursos Humanos & Gestão de Pessoas",
    ],
  },
  {
    category: "Mentoria",
    icon: UserCheck,
    items: [
      "Mentoria High-Ticket & Infoprodutos",
      "Mentoria de Liderança & Gestão Executiva",
      "Mentoria Pessoal & High Performance",
      "Coaching de Carreira, Vida & Negócios",
      "Mentoria de Vendas & Tráfego Direto",
    ],
  },
  {
    category: "Treinamento & Cursos",
    icon: GraduationCap,
    items: [
      "Treinamento & Imersão Presencial",
      "Curso Online & Formação Profissional",
      "Escola / Academia de Capacitação",
      "Palestra & Workshop de Alto Impacto",
      "Certificação Profissionalizante",
    ],
  },
  {
    category: "SaaS & Tecnologia",
    icon: Laptop,
    items: [
      "SaaS de IA para WhatsApp & Atendimento",
      "SaaS de CRM & Gestão de Vendas",
      "SaaS de Automação & Marketing Tech",
      "SaaS ERP & Gestão Empresarial",
      "Plataforma B2B de Tecnologia",
    ],
  },
  {
    category: "Empresa & Serviços Físicos",
    icon: Building2,
    items: [
      "Clínica de Estética & Harmonização Facial",
      "Clínica Médica & Saúde Integrada",
      "Empresa de Construção, Arquitetura & Engenharia",
      "Empresa de Energia Solar & Sustentabilidade",
      "Comércio, Varejo & Distribuição",
      "Escritório de Advocacia & Serviços Jurídicos",
      "Gastronomia & Restaurantes VIP",
    ],
  },
];

const DEFAULT_AUDIENCE_TAGS = [
  "Empresários & CEOs",
  "Donos de Agência",
  "Médicos & Donos de Clínica",
  "Infoprodutores & Afiliados",
  "Profissionais Liberais",
  "Gerentes de Vendas",
  "Mulheres 25-50 Anos",
  "Advogados & Contadores",
  "Engenheiros & Construtores",
  "Founders & Executivos",
];

const QUICK_REGIONS = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Barra Mansa, RJ",
  "Belo Horizonte, MG",
  "Curitiba, PR",
  "Brasília, DF",
  "Florianópolis, SC",
  "Todo o Brasil (Nacional)",
];

const PROMPT_SUGGESTIONS = [
  {
    title: "Mentoria High-Ticket & CRO",
    prompt: 'Landing page para mentoria de "vendas e tráfego direto" com foco em "infoprodutores e agências" para "escalar no perpétuo com ticket de R$ 5.000" e "multiplicar a taxa de conversão".',
    niche: "Mentoria High-Ticket & Infoprodutos",
    city: "São Paulo, SP",
    audience: "Infoprodutores & Afiliados",
    color: "purple" as AccentColor,
  },
  {
    title: "Consultoria Empresarial & Vendas",
    prompt: 'Landing page para consultoria de "processos de vendas e gestão comercial" com foco em "donos de PMEs" para "duplicar o faturamento da equipe" e "organizar processos de vendas em 90 dias".',
    niche: "Consultoria Comercial & Processos de Vendas",
    city: "Rio de Janeiro, RJ",
    audience: "Empresários & CEOs",
    color: "cyan" as AccentColor,
  },
  {
    title: "SaaS de IA para WhatsApp",
    prompt: 'Página de captura B2B para SaaS de "agentes de IA no WhatsApp" com foco em "gerentes de vendas e e-commerce" para "atender clientes e agendar reuniões 24 horas por dia sem equipe humana".',
    niche: "SaaS de IA para WhatsApp & Atendimento",
    city: "Todo o Brasil (Nacional)",
    audience: "Gerentes de Vendas",
    color: "emerald" as AccentColor,
  },
  {
    title: "Treinamento / Imersão de Liderança",
    prompt: 'Landing page para mentoria de "liderança" com foco em "guiar times para alta performance", "cultura organizacional forte" e "autonomia da gestão".',
    niche: "Treinamento & Imersão Presencial",
    city: "Belo Horizonte, MG",
    audience: "Founders & Executivos",
    color: "amber" as AccentColor,
  },
  {
    title: "Clínica de Estética & Harmonização",
    prompt: 'Página de conversão para clínica de "harmonização facial e estética avançada" com foco em "mulheres de 25 a 50 anos" para "agendar avaliação de Botox e Ultraformer sem dor e com resultado natural".',
    niche: "Clínica de Estética & Harmonização Facial",
    city: "Curitiba, PR",
    audience: "Mulheres 25-50 Anos",
    color: "rose" as AccentColor,
  },
  {
    title: "Consultoria Financeira & Patrimônio",
    prompt: 'Landing page para consultoria de "planejamento financeiro e gestão patrimonial" com foco em "empresários de alto faturamento" para "reduzir impostos legalmente e blindar o patrimônio familiar".',
    niche: "Consultoria Financeira & Patrimônio",
    city: "Brasília, DF",
    audience: "Empresários & CEOs",
    color: "purple" as AccentColor,
  },
  {
    title: "Escola / Curso Online Profissional",
    prompt: 'Página de vendas de curso online de "Marketing e Vendas de Alto Impacto" com foco em "profissionais liberais e autônomos" para "conquistar clientes recorrentes e emitir certificado profissional".',
    niche: "Curso Online & Formação Profissional",
    city: "Todo o Brasil (Nacional)",
    audience: "Profissionais Liberais",
    color: "emerald" as AccentColor,
  },
  {
    title: "Empresa de Engenharia & Energia Solar",
    prompt: 'Página de captação para empresa de "energia solar e engenharia elétrica" com foco em "donos de residências e comércios" para "economizar até 95% na conta de luz com garantia de 25 anos".',
    niche: "Empresa de Energia Solar & Sustentabilidade",
    city: "Barra Mansa, RJ",
    audience: "Engenheiros & Construtores",
    color: "amber" as AccentColor,
  },
  {
    title: "Mentoria Pessoal & High Performance",
    prompt: 'Landing page para mentoria individual de "alta performance, rotina e biohacking" com foco em "founders e CEOs sobrecarregados" para "eliminar o esgotamento mental e operar em hiperfoco diário".',
    niche: "Mentoria Pessoal & High Performance",
    city: "Florianópolis, SC",
    audience: "Founders & Executivos",
    color: "cyan" as AccentColor,
  },
  {
    title: "Clínica Médica & Saúde Integrada",
    prompt: 'Página de agendamento para clínica de "medicina integrada e check-up preventivo" com foco em "pacientes que buscam saúde longeva" para "fazer exames e acompanhamento personalizado no mesmo dia".',
    niche: "Clínica Médica & Saúde Integrada",
    city: "São Paulo, SP",
    audience: "Médicos & Donos de Clínica",
    color: "emerald" as AccentColor,
  },
];

export const AIModalGenerator: React.FC<AIModalGeneratorProps> = ({
  isOpen,
  onClose,
  onPageGenerated,
}) => {
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState("Mentoria High-Ticket & Infoprodutos");
  const [cityOrRegion, setCityOrRegion] = useState("São Paulo, SP");
  const [targetAudience, setTargetAudience] = useState("");
  const [offerDetails, setOfferDetails] = useState("");

  // Design & Art Direction state (Auto by LAN vs Manual override)
  const [designMode, setDesignMode] = useState<"auto" | "manual">("auto");
  const [selectedTheme, setSelectedTheme] = useState<"auto" | "dark" | "light" | "midnight" | "hybrid">("auto");
  const [selectedHeroModel, setSelectedHeroModel] = useState<"auto" | HeroModel>("auto");
  const [accentColor, setAccentColor] = useState<"auto" | AccentColor>("auto");

  // Custom persistent states
  const [customNiches, setCustomNiches] = useState<string[]>([]);
  const [customAudiences, setCustomAudiences] = useState<string[]>([]);

  // UI state for adding new entries
  const [isAddingNiche, setIsAddingNiche] = useState(false);
  const [newNicheInput, setNewNicheInput] = useState("");

  const [isAddingAudience, setIsAddingAudience] = useState(false);
  const [newAudienceInput, setNewAudienceInput] = useState("");

  // Location detection state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const generationSteps = [
    "LAN analisando briefing, público-alvo e nicho de mercado...",
    "Definindo direção de arte, tema (Claro / Escuro / Midnight) e paleta cromática ideal...",
    "Selecionando o melhor modelo estrutural de Hero e arquitetura do funil...",
    "Redigindo headline agressiva, Quiz de Qualificação e quebra de objeções...",
    "Montando Bento Grid, prova social e integrador webhook...",
  ];

  // Load custom saved niches and audiences from localStorage
  useEffect(() => {
    try {
      const savedNiches = localStorage.getItem("lan_custom_niches");
      if (savedNiches) setCustomNiches(JSON.parse(savedNiches));

      const savedAudiences = localStorage.getItem("lan_custom_audiences");
      if (savedAudiences) setCustomAudiences(JSON.parse(savedAudiences));
    } catch (e) {
      console.error("Error loading custom LAN parameters:", e);
    }
  }, []);

  if (!isOpen) return null;

  // Add custom niche
  const handleSaveCustomNiche = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newNicheInput.trim();
    if (!trimmed) return;

    if (!customNiches.includes(trimmed)) {
      const updated = [...customNiches, trimmed];
      setCustomNiches(updated);
      try {
        localStorage.setItem("lan_custom_niches", JSON.stringify(updated));
      } catch {}
    }
    setNiche(trimmed);
    setNewNicheInput("");
    setIsAddingNiche(false);
  };

  const handleDeleteCustomNiche = (target: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customNiches.filter((n) => n !== target);
    setCustomNiches(updated);
    try {
      localStorage.setItem("lan_custom_niches", JSON.stringify(updated));
    } catch {}
    if (niche === target) {
      setNiche("Mentoria High-Ticket & Infoprodutos");
    }
  };

  // Add custom audience
  const handleSaveCustomAudience = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newAudienceInput.trim();
    if (!trimmed) return;

    if (!customAudiences.includes(trimmed)) {
      const updated = [...customAudiences, trimmed];
      setCustomAudiences(updated);
      try {
        localStorage.setItem("lan_custom_audiences", JSON.stringify(updated));
      } catch {}
    }

    setTargetAudience((prev) => (prev ? `${prev}, ${trimmed}` : trimmed));
    setNewAudienceInput("");
    setIsAddingAudience(false);
  };

  const handleDeleteCustomAudience = (target: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customAudiences.filter((a) => a !== target);
    setCustomAudiences(updated);
    try {
      localStorage.setItem("lan_custom_audiences", JSON.stringify(updated));
    } catch {}
  };

  // Toggle or select audience tag
  const handleToggleAudienceTag = (tag: string) => {
    if (!targetAudience) {
      setTargetAudience(tag);
      return;
    }
    if (targetAudience.includes(tag)) {
      // Remove
      const parts = targetAudience
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== tag);
      setTargetAudience(parts.join(", "));
    } else {
      // Append
      setTargetAudience(`${targetAudience}, ${tag}`);
    }
  };

  // Geolocation detection
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus("Obtendo coordenadas...");

    const finishWithLocation = (city: string, state: string) => {
      const formatted = state ? `${city}, ${state}` : city;
      setCityOrRegion(formatted);
      setLocationStatus(`Localizado: ${formatted}`);
      setIsDetectingLocation(false);
      setTimeout(() => setLocationStatus(null), 3000);
    };

    if (!navigator.geolocation) {
      // IP Fallback
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.city && data.region_code) {
          finishWithLocation(data.city, data.region_code);
          return;
        }
      } catch {}
      setLocationStatus("Geolocalização não disponível.");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLocationStatus("Consultando cidade...");
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.municipality ||
            data.address?.village ||
            data.address?.suburb;
          const state = data.address?.state || data.address?.["ISO3166-2-lvl4"] || "";

          if (city) {
            finishWithLocation(city, state);
            return;
          }
        } catch (err) {
          console.warn("Reverse geocode failed:", err);
        }

        // IP Fallback
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data && data.city) {
            finishWithLocation(data.city, data.region_code || data.region);
            return;
          }
        } catch {}

        setLocationStatus("Não foi possível identificar a cidade.");
        setIsDetectingLocation(false);
      },
      async () => {
        // Fallback to IP lookup if position denied or timed out
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data && data.city) {
            finishWithLocation(data.city, data.region_code || data.region);
            return;
          }
        } catch {}
        setLocationStatus("Permissão de localização negada.");
        setIsDetectingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleUseSuggestion = (s: (typeof PROMPT_SUGGESTIONS)[0]) => {
    setPrompt(s.prompt);
    setNiche(s.niche);
    setCityOrRegion(s.city);
    setTargetAudience(s.audience);
    setAccentColor(s.color);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage("Por favor, descreva a ideia principal da sua oferta para o LAN.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/ai/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          niche,
          cityOrRegion,
          targetAudience: targetAudience || "Público qualificado buscando soluções de alto impacto",
          offerDetails: offerDetails || "Garantia incondicional, bônus imediatos e suporte individual",
          theme: selectedTheme === "auto" ? undefined : selectedTheme,
          heroModel: selectedHeroModel === "auto" ? undefined : selectedHeroModel,
          accentColor: accentColor === "auto" ? undefined : accentColor,
        }),
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Falha ao gerar página com o LAN.");
      }

      const generatedData = json.data;

      // Smart theme fallback if not set
      const resolvedTheme = generatedData.theme || (selectedTheme !== "auto" ? selectedTheme : "dark");
      const resolvedColor = generatedData.accentColor || (accentColor !== "auto" ? accentColor : "purple");
      const resolvedHeroModel = generatedData.hero?.model || (selectedHeroModel !== "auto" ? selectedHeroModel : "split_image");
      const resolvedSectionOrder = generatedData.sectionOrder && Array.isArray(generatedData.sectionOrder) && generatedData.sectionOrder.length > 0
        ? generatedData.sectionOrder
        : ["hero", "socialProof", "quiz", "bentoGrid", "testimonials", "formSection", "faq"];

      const newPage: LandingPage = {
        id: `lp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: generatedData.title || `Landing Page ${niche}`,
        slug: (generatedData.title || "nova-pagina")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        niche: generatedData.niche || niche,
        cityOrRegion: generatedData.cityOrRegion || cityOrRegion,
        targetAudience: generatedData.targetAudience || targetAudience,
        accentColor: resolvedColor,
        theme: resolvedTheme,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        webhookUrl: "",
        status: "published",
        viewsCount: 0,
        leadsCount: 0,
        visibility: {
          hero: true,
          socialProof: true,
          quiz: true,
          bentoGrid: true,
          testimonials: true,
          formSection: true,
          faq: true,
          stickyMobileCta: true,
        },
        sectionOrder: resolvedSectionOrder,
        hero: {
          model: resolvedHeroModel,
          badgeText: generatedData.hero?.badgeText || `⚡ Vagas Abertas para ${cityOrRegion}`,
          badgeIcon: "Zap",
          headline: generatedData.hero?.headline || "Acelere Seus Resultados com o Método Definitivo",
          subheadline: generatedData.hero?.subheadline || "A solução completa para transformar seus resultados com segurança e rapidez.",
          mediaType: generatedData.hero?.mediaType || (resolvedHeroModel === "split_video" ? "video" : "image"),
          videoUrl: generatedData.hero?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
          videoThumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
          imageUrl: generatedData.hero?.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
          ctaText: generatedData.hero?.ctaText || "QUERO FAZER O DIAGNÓSTICO GRATUITO",
          ctaSubtext: generatedData.hero?.ctaSubtext || "⚡ Vagas limitadas para a turma atual",
          countdownMinutes: generatedData.hero?.countdownMinutes || 15,
          ratingScore: "4.9/5",
          ratingText: "+12.000 clientes satisfeitos",
          socialProofAvatars: [
            { name: "Lucas M.", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
            { name: "Beatriz R.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            { name: "Carlos E.", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
          ],
          b2bMetrics: generatedData.hero?.b2bMetrics || [
            { id: "b2b_1", value: "+340%", label: "Crescimento Médio", sublabel: "Em menos de 90 dias" },
            { id: "b2b_2", value: "99.4%", label: "Satisfação Verificada", sublabel: "Avaliações auditadas" },
            { id: "b2b_3", value: "10 Min", label: "Tempo de Resposta", sublabel: "Atendimento direto" },
          ],
          showcaseMetrics: generatedData.hero?.showcaseMetrics || [
            { id: "sm_1", value: "99.9%", label: "Disponibilidade" },
            { id: "sm_2", value: "3.8x", label: "Mais Conversões" },
            { id: "sm_3", value: "24/7", label: "Agendamento Ativo" },
          ],
          scarcityLabel: generatedData.hero?.scarcityLabel || `Vagas Restantes para ${cityOrRegion}`,
          scarcityRemainingSlots: generatedData.hero?.scarcityRemainingSlots || 7,
          scarcityTotalSlots: generatedData.hero?.scarcityTotalSlots || 20,
        },
        socialProof: {
          marqueeTitle: generatedData.socialProof?.marqueeTitle || "EMPRESAS E CLIENTES QUE APROVAM NOSSO MÉTODO",
          metrics: generatedData.socialProof?.metrics || [
            { id: "m1", value: "+14.850", label: "Clientes Atendidos", sublabel: "Em todo território nacional", iconName: "Users" },
            { id: "m2", value: "99.4%", label: "Taxa de Satisfação", sublabel: "Avaliações 5 estrelas", iconName: "ShieldCheck" },
            { id: "m3", value: "3.4x", label: "Média de Crescimento", sublabel: "Resultados comprovados", iconName: "TrendingUp" },
            { id: "m4", value: "24/7", label: "Suporte VIP", sublabel: "Acompanhamento diário", iconName: "Zap" },
          ],
          marqueeLogos: generatedData.socialProof?.marqueeLogos || ["Forbes Brasil", "Exame", "InfoMoney", "Valor Econômico", "G1 Negócios"],
        },
        quiz: {
          badge: generatedData.quiz?.badge || "DIAGNÓSTICO PERSONALIZADO",
          title: generatedData.quiz?.title || "Descubra se este programa é para você",
          subtitle: generatedData.quiz?.subtitle || "Responda 3 perguntas rápidas para liberar sua condição especial.",
          questions: generatedData.quiz?.questions || [
            {
              id: "q1",
              question: "Qual é o seu principal objetivo agora?",
              description: "Isso define o ritmo da sua aceleração.",
              options: [
                { id: "o1", label: "Aumentar faturamento e lucro", iconName: "TrendingUp", badge: "Alta Demanda" },
                { id: "o2", label: "Atrair clientes qualificados", iconName: "Target" },
                { id: "o3", label: "Profissionalizar e estruturar processos", iconName: "ShieldCheck" },
              ],
            },
          ],
          resultTitle: generatedData.quiz?.resultTitle || "Diagnóstico Aprovado!",
          resultDescription: generatedData.quiz?.resultDescription || "Seu perfil está 100% qualificado para a nossa esteira de aceleração.",
        },
        bentoGrid: {
          badge: generatedData.bentoGrid?.badge || "ARQUITETURA DO MÉTODO",
          title: generatedData.bentoGrid?.title || "Como funciona o ecossistema de alta conversão",
          subtitle: generatedData.bentoGrid?.subtitle || "Uma estrutura em blocos desenhada para gerar resultados imediatos.",
          items: generatedData.bentoGrid?.items || [
            {
              id: "b1",
              size: "large",
              title: "Funil de Vendas de Alta Conversão",
              description: "Estrutura desenhada para converter tráfego frio em clientes fiéis com alta margem de lucro.",
              tag: "Pilar Principal",
              iconName: "Zap",
              metric: "+340% Conversão",
            },
            {
              id: "b2",
              size: "standard",
              title: "Acompanhamento Individualizado",
              description: "Suporte dedicado para tirar todas as dúvidas e garantir a aplicação correta.",
              tag: "Suporte",
              iconName: "CheckCircle",
            },
            {
              id: "b3",
              size: "standard",
              title: "Garantia Blindada",
              description: "Você não assume risco nenhum. Se não gostar, devolvemos seu dinheiro.",
              tag: "Segurança",
              iconName: "ShieldCheck",
            },
          ],
        },
        testimonials: {
          badge: generatedData.testimonials?.badge || "PROVA SOCIAL",
          title: generatedData.testimonials?.title || "O que dizem os nossos clientes",
          subtitle: generatedData.testimonials?.subtitle || "Veja depoimentos reais de quem aplicou o método.",
          items: (generatedData.testimonials?.items || []).map((t: any, i: number) => ({
            id: t.id || `t_${i}`,
            name: t.name || "Cliente Satisfeito",
            role: t.role || "Empresário",
            companyOrCity: t.companyOrCity || cityOrRegion,
            avatarUrl:
              t.avatarUrl ||
              `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&w=200&q=80`,
            rating: t.rating || 5,
            content: t.content || "Os resultados superaram todas as minhas expectativas em poucas semanas.",
            resultHighlight: t.resultHighlight || "+300% de Retorno",
            verified: true,
          })),
        },
        formSection: {
          badge: generatedData.formSection?.badge || "ETAPA FINAL: GARANTA SUA VAGA",
          title: generatedData.formSection?.title || "Preencha seus dados para receber o diagnóstico",
          subtitle: generatedData.formSection?.subtitle || "Entraremos em contato via WhatsApp em menos de 10 minutos.",
          ctaButtonText: generatedData.formSection?.ctaButtonText || "QUERO GARANTIR MINHA VAGA AGORA",
          guaranteeDays: generatedData.formSection?.guaranteeDays || 15,
          guaranteeText:
            generatedData.formSection?.guaranteeText ||
            "Garantia Incondicional de 15 Dias: Risco zero para testar e validar.",
          securityBadges: generatedData.formSection?.securityBadges || [
            "Criptografia SSL 256-bit",
            "Atendimento Imediato via WhatsApp",
            "Acesso Imediato",
          ],
        },
        faq: generatedData.faq || [
          {
            id: "f1",
            question: "Como recebo o acesso após preencher?",
            answer: "Nossa equipe envia seu diagnóstico e acesso diretamente no seu WhatsApp em menos de 10 minutos.",
          },
          {
            id: "f2",
            question: "Existe alguma garantia?",
            answer: "Sim, você conta com garantia incondicional total.",
          },
        ],
      };

      const finalPage = applyThematicImagesToPage(newPage);

      onPageGenerated(finalPage);
      onClose();
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err?.message || "Ocorreu um erro ao gerar a página com o LAN. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const allAudienceTags = Array.from(new Set([...DEFAULT_AUDIENCE_TAGS, ...customAudiences]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-6 text-zinc-100 max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding: LAN */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-zinc-850 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 border border-purple-400/40 flex items-center justify-center text-white shadow-lg shadow-purple-950/60 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                LAN • Agente de IA CRO
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                v2.5 High-Ticket
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Especialista em copy de alta conversão, Quiz interativo, Bento Grid e estéticas premium.
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-6 pr-1 flex-1">
          {/* Quick Models Presets */}
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Modelos Recomendados por LAN (Sugestões Rápidas):</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">Clique para auto-preencher</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUseSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500/60 hover:bg-purple-950/30 transition-all text-left flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* 1. Main Briefing Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <span>1. Briefing / Ideia Principal da Oferta *</span>
                </label>
                <span className="text-[10px] text-zinc-400 font-normal">
                  Dica: edite os termos entre <strong className="text-purple-400">"aspas"</strong>
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Ex: Landing page para mentoria de "liderança" com foco em "guiar times para alta performance"...'
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors text-sm leading-relaxed"
              />

              {/* Editable Quoted Keywords Helper Badge */}
              {prompt.includes('"') && (
                <div className="mt-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Palavras-chave do Modelo (substitua o texto entre aspas no campo acima):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(prompt.matchAll(/"([^"]+)"/g)).map((match, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 font-mono text-[11px] text-purple-200 font-medium"
                      >
                        "{match[1]}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Nicho de Mercado (Categorized + Add Custom) */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>2. Nicho de Mercado & Subnicho</span>
                </label>

                {!isAddingNiche && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNiche(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Novo Nicho</span>
                  </button>
                )}
              </div>

              {/* Inline input for creating new custom Niche */}
              {isAddingNiche ? (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-fadeIn">
                  <p className="text-xs text-purple-200 font-bold">
                    Digite o novo nicho/subnicho para salvar no seu acervo do LAN:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNicheInput}
                      onChange={(e) => setNewNicheInput(e.target.value)}
                      placeholder="Ex: Consultoria em TI para Saúde, Gestão de Franquias..."
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomNiche}
                      className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Salvar Nicho
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNiche(false)}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Niche Select */}
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {/* Custom User Saved Niches */}
                {customNiches.length > 0 && (
                  <optgroup label="⭐ Meus Nichos Personalizados">
                    {customNiches.map((cn) => (
                      <option key={cn} value={cn}>
                        {cn} (Personalizado)
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Standard Categorized Niches */}
                {CATEGORIZED_NICHES.map((group) => (
                  <optgroup key={group.category} label={`📍 ${group.category.toUpperCase()}`}>
                    {group.items.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Display custom user niches badges if any exist */}
              {customNiches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-zinc-400 font-medium self-center">
                    Seus nichos salvos:
                  </span>
                  {customNiches.map((cn) => (
                    <span
                      key={cn}
                      onClick={() => setNiche(cn)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-all ${
                        niche === cn
                          ? "bg-purple-600/30 border-purple-400 text-purple-200"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span>{cn}</span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomNiche(cn, e)}
                        className="hover:text-red-400 ml-1 cursor-pointer"
                        title="Remover nicho salvo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Cidade ou Região Alvo (com Geolocalização) */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>3. Cidade ou Região Alvo</span>
                </label>

                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Detectar sua cidade e estado automaticamente por GPS/IP"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{isDetectingLocation ? "Detectando..." : "Detectar Minha Localização"}</span>
                </button>
              </div>

              {locationStatus && (
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>{locationStatus}</span>
                </div>
              )}

              <input
                type="text"
                value={cityOrRegion}
                onChange={(e) => setCityOrRegion(e.target.value)}
                placeholder="Ex: Barra Mansa, RJ, São Paulo, SP ou Todo o Brasil"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500"
              />

              {/* Quick location chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-medium self-center">
                  Cidades rápidas:
                </span>
                {QUICK_REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCityOrRegion(r)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      cityOrRegion === r
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-200"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Público-Alvo Específico (Com Exemplos + Adicionar Novos) */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>4. Público-Alvo Específico</span>
                </label>

                {!isAddingAudience && (
                  <button
                    type="button"
                    onClick={() => setIsAddingAudience(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Criar Novo Público</span>
                  </button>
                )}
              </div>

              {/* Inline input for creating new custom Audience */}
              {isAddingAudience && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 animate-fadeIn">
                  <p className="text-xs text-cyan-200 font-bold">
                    Adicione um novo segmento de público-alvo para o LAN:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAudienceInput}
                      onChange={(e) => setNewAudienceInput(e.target.value)}
                      placeholder="Ex: Cirurgiões Dentistas, Gestores de Tráfego, Estudantes..."
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomAudience}
                      className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Salvar Público
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAudience(false)}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Donos de Agência, Médicos, Infoprodutores de R$ 3k+"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500"
              />

              {/* Clickable Example Tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-medium">
                  Clique nas sugestões de público para selecionar ou combinar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allAudienceTags.map((tag) => {
                    const isSelected = targetAudience.includes(tag);
                    const isCustom = customAudiences.includes(tag);

                    return (
                      <span
                        key={tag}
                        onClick={() => handleToggleAudienceTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-cyan-950/70 border-cyan-400 text-cyan-200 font-bold shadow-sm"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span>{tag}</span>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomAudience(tag, e)}
                            className="hover:text-red-400 ml-1 cursor-pointer"
                            title="Remover público personalizado"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Direção de Arte & Modelo pelo LAN */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <SunMoon className="w-4 h-4 text-purple-400" />
                  <span>5. Direção de Arte, Tema & Modelo de LP</span>
                </label>
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setDesignMode("auto");
                      setSelectedTheme("auto");
                      setSelectedHeroModel("auto");
                      setAccentColor("auto");
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      designMode === "auto"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto pelo LAN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDesignMode("manual")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      designMode === "manual"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Personalizar</span>
                  </button>
                </div>
              </div>

              {designMode === "auto" ? (
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200/90 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-purple-200">
                      O LAN definirá o melhor design para não criar tudo igual:
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      O agente analisará o nicho e público-alvo para decidir se a página deve ser{" "}
                      <strong className="text-zinc-200">Clara (White Pro)</strong>,{" "}
                      <strong className="text-zinc-200">Escura (Dark CRO)</strong>,{" "}
                      <strong className="text-zinc-200">Midnight Luxo</strong> ou{" "}
                      <strong className="text-zinc-200">Híbrida</strong>, além de escolher o modelo de Hero (Split, Vídeo VSL, Centered SaaS, B2B Métricas, etc.) e a paleta ideal.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3.5">
                  {/* Tema */}
                  <div>
                    <span className="block text-[11px] font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
                      <SunMoon className="w-3 h-3 text-cyan-400" />
                      <span>Tema & Luminosidade:</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {[
                        { id: "auto", label: "Auto (LAN)", desc: "Inteligente" },
                        { id: "dark", label: "Escuro Pro", desc: "Cyber Dark" },
                        { id: "light", label: "Claro Clean", desc: "White Pro" },
                        { id: "midnight", label: "Midnight", desc: "Luxo Black" },
                        { id: "hybrid", label: "Híbrido", desc: "Alternado" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTheme(t.id as any)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            selectedTheme === t.id
                              ? "bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-sm"
                              : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <div className="text-xs font-semibold">{t.label}</div>
                          <div className="text-[10px] text-zinc-500">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modelo de Hero */}
                  <div>
                    <span className="block text-[11px] font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
                      <Layout className="w-3 h-3 text-purple-400" />
                      <span>Modelo Estrutural de Hero:</span>
                    </span>
                    <select
                      value={selectedHeroModel}
                      onChange={(e) => setSelectedHeroModel(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="auto">✨ Auto (LAN escolhe o melhor modelo para o nicho)</option>
                      <option value="split_image">🖼️ Split com Foto / Mockup Lateral (Produtos & Serviços)</option>
                      <option value="split_video">🎥 Split com Vídeo VSL (Lançamentos & Mentorias)</option>
                      <option value="centered_showcase">💻 Centered Showcase (SaaS & Aplicativos)</option>
                      <option value="white_pro">🩺 White Pro Clean (Médicos, Estética & Alto Padrão)</option>
                      <option value="b2b_metrics">📊 B2B com Métricas de Autoridade (Consultorias & Gestão)</option>
                      <option value="editorial_ebook">📚 Editorial / E-book / Metodologia de Autor</option>
                      <option value="urgency_counter">⏱️ Urgência & Escassez com Contador ao Vivo</option>
                      <option value="split_lead_form">📝 Split com Captura Direta no Topo</option>
                      <option value="minimal_glow">✨ Minimal Glow Tecnológico</option>
                    </select>
                  </div>

                  {/* Paleta Cromática */}
                  <div>
                    <span className="block text-[11px] font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-emerald-400" />
                      <span>Cor de Destaque:</span>
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAccentColor("auto")}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          accentColor === "auto"
                            ? "border-white bg-zinc-800 text-white shadow-sm"
                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        Auto (LAN)
                      </button>
                      {(["purple", "emerald", "cyan", "amber", "rose"] as AccentColor[]).map((c) => {
                        const cfg = THEME_CONFIGS[c];
                        const isSelected = accentColor === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setAccentColor(c)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "border-white text-white shadow-sm scale-105"
                                : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                            }`}
                            style={{
                              backgroundColor: isSelected ? cfg.primaryHex + "33" : "#09090b",
                              borderColor: isSelected ? cfg.primaryHex : undefined,
                            }}
                          >
                            {cfg.name.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generation Progress Animation */}
            {isGenerating && (
              <div className="p-5 rounded-2xl bg-zinc-900 border border-purple-500/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-purple-300">
                    {generationSteps[generationStep]}
                  </span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 h-full transition-all duration-500"
                    style={{
                      width: `${((generationStep + 1) / generationSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 sm:py-5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 shadow-xl shadow-purple-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isGenerating ? (
                <span>LAN Construindo Sua Landing Page...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Gerar Landing Page com LAN</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
