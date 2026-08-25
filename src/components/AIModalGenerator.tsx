import React, { useState } from "react";
import { LandingPage, AccentColor } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  MapPin,
  Target,
  Layers,
  Palette,
  X,
  ArrowRight,
  Flame,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface AIModalGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onPageGenerated: (page: LandingPage) => void;
}

const REGIONAL_PRESETS = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Curitiba, PR",
  "Belo Horizonte, MG",
  "Brasília, DF",
  "Florianópolis, SC",
  "Todo o Brasil (Nacional)",
];

const NICHE_PRESETS = [
  "Mentoria High-Ticket & Infoprodutos",
  "Clínica de Estética & Médica",
  "SaaS & Automação com Inteligência Artificial",
  "Imóveis de Alto Padrão / Energia Solar",
  "Consultoria Financeira & Investimentos",
  "Academia & Personal Trainer VIP",
  "Franquia & Oportunidade de Negócio",
];

const PROMPT_SUGGESTIONS = [
  {
    title: "Mentoria de Tráfego Direto & CRO",
    prompt: "Landing Page para mentoria de tráfego direto de R$ 5.000 focada em infoprodutores de São Paulo.",
    niche: "Mentoria High-Ticket & Infoprodutos",
    city: "São Paulo, SP",
    color: "purple" as AccentColor,
  },
  {
    title: "Clínica Dermatológica & Harmonização",
    prompt: "Página de conversão para procedimentos de Botox e Ultraformer sem dor para público classe A em Curitiba.",
    niche: "Clínica de Estética & Médica",
    city: "Curitiba, PR",
    color: "emerald" as AccentColor,
  },
  {
    title: "SaaS de IA para WhatsApp",
    prompt: "Página de captura B2B para plataforma que agenda reuniões automáticas 24/7 com agentes inteligentes.",
    niche: "SaaS & Automação com Inteligência Artificial",
    city: "Todo o Brasil (Nacional)",
    color: "cyan" as AccentColor,
  },
];

export const AIModalGenerator: React.FC<AIModalGeneratorProps> = ({
  isOpen,
  onClose,
  onPageGenerated,
}) => {
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState(NICHE_PRESETS[0]);
  const [cityOrRegion, setCityOrRegion] = useState("São Paulo, SP");
  const [targetAudience, setTargetAudience] = useState("");
  const [offerDetails, setOfferDetails] = useState("");
  const [accentColor, setAccentColor] = useState<AccentColor>("purple");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const generationSteps = [
    "Pesquisando dores locais e dados de mercado...",
    "Redigindo headline agressiva e quebra de objeções...",
    "Estruturando Quiz de Qualificação interativo...",
    "Montando Bento Grid do método e prova social...",
    "Configurando formulário de alta conversão e integrador...",
  ];

  if (!isOpen) return null;

  const handleUseSuggestion = (s: (typeof PROMPT_SUGGESTIONS)[0]) => {
    setPrompt(s.prompt);
    setNiche(s.niche);
    setCityOrRegion(s.city);
    setAccentColor(s.color);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage("Por favor, descreva o que você deseja na Landing Page.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setGenerationStep(0);

    // Simulate animated steps
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
          accentColor,
        }),
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Falha ao gerar página com IA");
      }

      const generatedData = json.data;

      // Construct full LandingPage object
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
        accentColor: generatedData.accentColor || accentColor,
        theme: "dark",
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
        sectionOrder: ["hero", "socialProof", "quiz", "bentoGrid", "testimonials", "formSection", "faq"],
        hero: {
          badgeText: generatedData.hero?.badgeText || `⚡ Vagas Abertas para ${cityOrRegion}`,
          badgeIcon: "Zap",
          headline: generatedData.hero?.headline || "Acelere Seus Resultados com o Método Definitivo",
          subheadline: generatedData.hero?.subheadline || "A solução completa para transformar seus resultados com segurança e rapidez.",
          mediaType: generatedData.hero?.mediaType || "video",
          videoUrl: generatedData.hero?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
          videoThumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
          imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
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

      onPageGenerated(newPage);
      onClose();
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err?.message || "Ocorreu um erro ao gerar a página. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Agente de IA CRO • Criar Nova Landing Page
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Padrão People / V0 com copy de alta conversão, Quiz, Bento Grid e Webhook.
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Sugestões Rápidas de Alta Demanda:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUseSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500/50 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-purple-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Main Prompt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              1. Briefing / Ideia Principal da Oferta *
            </label>
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Landing page para mentoria de faturamento acelerado com foco em infoprodutores de ticket médio R$ 3.000 que querem escalar no perpétuo..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Niche */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Nicho de Mercado</span>
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500"
              >
                {NICHE_PRESETS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Regional Context */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cidade ou Região Alvo</span>
              </label>
              <input
                type="text"
                value={cityOrRegion}
                onChange={(e) => setCityOrRegion(e.target.value)}
                placeholder="Ex: São Paulo, SP ou Todo o Brasil"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Público-Alvo Específico
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Médicos, Donos de Agência, Mulheres 30-50"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paleta de Acento Neon</span>
              </label>
              <div className="flex gap-2 pt-1">
                {(["purple", "emerald", "cyan", "amber", "rose"] as AccentColor[]).map((c) => {
                  const cfg = THEME_CONFIGS[c];
                  const isSelected = accentColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "border-white text-white shadow-lg shadow-black/40 scale-105"
                          : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                      style={{
                        backgroundColor: isSelected ? cfg.primaryHex + "33" : "#18181b",
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

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Generation Animation Box */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-purple-500/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-purple-300">
                  {generationSteps[generationStep]}
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
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
            className="w-full py-4 sm:py-5 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {isGenerating ? (
              <span>Gerando com IA de Elite...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Gerar Landing Page com IA</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
