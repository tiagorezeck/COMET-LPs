import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory submissions store for preview & testing
interface LeadSubmission {
  id: string;
  pageId: string;
  pageTitle: string;
  name: string;
  whatsapp: string;
  email: string;
  quizAnswers: Record<string, string>;
  utms: Record<string, string>;
  submittedAt: string;
  webhookStatus: "success" | "skipped" | "failed";
  webhookResponse?: string;
}

const leadSubmissions: LeadSubmission[] = [];

// Gemini Client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get leads submissions
app.get("/api/leads", (req, res) => {
  const pageId = req.query.pageId as string;
  if (pageId) {
    return res.json({ leads: leadSubmissions.filter((l) => l.pageId === pageId) });
  }
  res.json({ leads: leadSubmissions });
});

// Submit Lead endpoint with Webhook forwarding
app.post("/api/webhook/submit-lead", async (req, res) => {
  try {
    const { pageId, pageTitle, name, whatsapp, email, quizAnswers, utms, webhookUrl } = req.body;

    const lead: LeadSubmission = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pageId: pageId || "unknown",
      pageTitle: pageTitle || "Landing Page",
      name: name || "",
      whatsapp: whatsapp || "",
      email: email || "",
      quizAnswers: quizAnswers || {},
      utms: utms || {},
      submittedAt: new Date().toISOString(),
      webhookStatus: "skipped",
    };

    const targetWebhook = webhookUrl || process.env.VITE_SYSTEM_WEBHOOK_URL;

    if (targetWebhook && targetWebhook.trim().length > 0) {
      try {
        const payload = {
          event: "lead_converted",
          timestamp: lead.submittedAt,
          lead: {
            name: lead.name,
            whatsapp: lead.whatsapp,
            email: lead.email,
            quiz_diagnosis: lead.quizAnswers,
          },
          tracking: {
            page_id: lead.pageId,
            page_title: lead.pageTitle,
            ...lead.utms,
          },
        };

        const response = await fetch(targetWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "People-CRO-Builder/1.0",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          lead.webhookStatus = "success";
          lead.webhookResponse = `Status ${response.status} OK`;
        } else {
          lead.webhookStatus = "failed";
          lead.webhookResponse = `HTTP Error ${response.status}: ${response.statusText}`;
        }
      } catch (err: any) {
        console.error("Webhook forwarding error:", err);
        lead.webhookStatus = "failed";
        lead.webhookResponse = err?.message || "Webhook delivery failed";
      }
    }

    leadSubmissions.unshift(lead);
    // Keep max 200 leads in memory
    if (leadSubmissions.length > 200) {
      leadSubmissions.pop();
    }

    return res.json({
      success: true,
      leadId: lead.id,
      webhookStatus: lead.webhookStatus,
      message: "Lead registrado com sucesso!",
    });
  } catch (error: any) {
    console.error("Error saving lead:", error);
    return res.status(500).json({ error: error.message || "Failed to process lead" });
  }
});

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Candidate models in fallback order
const CANDIDATE_MODELS = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

// Multi-model call with automatic retries on 503/429/UNAVAILABLE
async function callGeminiWithWaterfall(
  ai: GoogleGenAI,
  generateParams: {
    contents: string;
    systemInstruction?: string;
    responseSchema?: any;
  }
) {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    // Try each model up to 2 times
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] Attempting model "${modelName}" (attempt ${attempt}/2)...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: generateParams.contents,
          config: {
            systemInstruction: generateParams.systemInstruction,
            responseMimeType: "application/json",
            responseSchema: generateParams.responseSchema,
          },
        });

        if (response && response.text) {
          const trimmed = response.text.trim();
          try {
            const parsed = JSON.parse(trimmed);
            console.log(`[Gemini API] Success with model "${modelName}"`);
            return { data: parsed, modelUsed: modelName };
          } catch (jsonErr) {
            // If response wrapped in markdown code blocks: ```json ... ```
            const extracted = trimmed.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
            const parsed = JSON.parse(extracted);
            console.log(`[Gemini API] Success parsing markdown JSON with model "${modelName}"`);
            return { data: parsed, modelUsed: modelName };
          }
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("high demand") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("Overloaded");

        console.warn(`[Gemini API] Error with model ${modelName} on attempt ${attempt}:`, errMsg);

        if (isTransient && attempt === 1) {
          // Quick backoff before retry
          await delay(1200);
        } else {
          // Break inner loop to try next model in waterfall
          break;
        }
      }
    }
  }

  throw lastError || new Error("Todos os modelos Gemini estão temporariamente indisponíveis.");
}

// Adaptive Heuristic CRO Landing Page Generator (Guaranteed zero-downtime fallback)
function generateAdaptiveLandingPage(params: {
  prompt?: string;
  niche?: string;
  cityOrRegion?: string;
  targetAudience?: string;
  offerDetails?: string;
  accentColor?: string;
}) {
  const niche = params.niche || "Mentoria & Serviços de Alto Impacto";
  const city = params.cityOrRegion || "São Paulo e Região";
  const audience = params.targetAudience || "Empresários, Profissionais e Líderes";
  const rawPrompt = params.prompt || "Solução completa e aceleradora de resultados";
  const color = params.accentColor || "purple";

  // Clean prompt snippet
  const promptSnippet = rawPrompt.length > 50 ? rawPrompt.substring(0, 50) + "..." : rawPrompt;

  return {
    title: `Aceleração CRO • ${niche}`,
    niche: niche,
    cityOrRegion: city,
    targetAudience: audience,
    accentColor: color,
    hero: {
      badgeText: `⚡ Exclusivo para ${city} • Vagas Abertas`,
      headline: `Multiplique seus Resultados com a Metodologia Definitiva para ${niche}`,
      subheadline: `Elimine a estagnação e implemente um ecossistema comprovado para atrair clientes de alto valor em ${city}.`,
      mediaType: "video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      ctaText: "QUERO MEU DIAGNÓSTICO GRATUITO AGORA",
      ctaSubtext: "⚡ Análise personalizada em menos de 2 minutos via WhatsApp",
      countdownMinutes: 15,
      ratingScore: "4.9/5",
      ratingText: "+14.500 clientes acelerados",
      socialProofAvatars: [
        { name: "Gabriel S.", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
        { name: "Mariana C.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
        { name: "Rodrigo F.", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
      ],
    },
    socialProof: {
      marqueeTitle: "EMPRESAS E LÍDERES QUE VALIDAM E APROVAM NOSSO MÉTODO",
      metrics: [
        { id: "m1", value: "+18.900", label: "Leads Qualificados", sublabel: "Gerados nos últimos 90 dias", iconName: "Users" },
        { id: "m2", value: "99.4%", label: "Taxa de Satisfação", sublabel: "Avaliações 5 estrelas verificadas", iconName: "ShieldCheck" },
        { id: "m3", value: "3.8x", label: "Aceleração Média", sublabel: "Retorno sobre investimento", iconName: "TrendingUp" },
        { id: "m4", value: "24/7", label: "Atendimento & Suporte", sublabel: "Acompanhamento direto", iconName: "Zap" },
      ],
      marqueeLogos: ["Forbes Brasil", "Exame", "InfoMoney", "Valor Econômico", "G1 Negócios", "Bloomberg Línea"],
    },
    quiz: {
      badge: "DIAGNÓSTICO PERSONALIZADO CRO",
      title: `Descubra se o seu perfil é ideal para o nosso programa em ${city}`,
      subtitle: "Responda 3 perguntas rápidas para liberar sua condição exclusiva com bônus de aceleração.",
      questions: [
        {
          id: "q1",
          question: "Qual é o principal desafio que você enfrenta hoje?",
          description: "Isso define o diagnóstico exato da sua aceleração.",
          options: [
            { id: "o1", label: "Escalar vendas com previsibilidade e lucro", iconName: "TrendingUp", badge: "Mais Escolhida" },
            { id: "o2", label: "Atrair clientes qualificados dispostos a pagar mais", iconName: "Target", badge: "Alta Prioridade" },
            { id: "o3", label: "Profissionalizar processos e economizar tempo", iconName: "ShieldCheck" },
          ],
        },
        {
          id: "q2",
          question: "Em quanto tempo você deseja ver os primeiros resultados?",
          description: "Nossa metodologia é adaptada para aceleração imediata.",
          options: [
            { id: "o4", label: "Imediatamente (nos próximos 7 a 14 dias)", iconName: "Zap", badge: "Aceleração Total" },
            { id: "o5", label: "Em até 30 dias com base sólida", iconName: "CheckCircle" },
            { id: "o6", label: "Estou estruturando para os próximos 60 dias", iconName: "Award" },
          ],
        },
        {
          id: "q3",
          question: `Qual é o seu nível de compromisso com a expansão em ${city}?`,
          description: "Selecionamos apenas perfis realmente comprometidos.",
          options: [
            { id: "o7", label: "100% comprometido em executar o plano", iconName: "Sparkles", badge: "Perfil VIP" },
            { id: "o8", label: "Quero conhecer a proposta e tirar dúvidas", iconName: "HelpCircle" },
          ],
        },
      ],
      resultTitle: "Perfil Qualificado com Sucesso! 🎉",
      resultDescription: `Seu diagnóstico foi aprovado para a turma exclusiva de ${city}. Finalize o cadastro abaixo para garantir as condições especiais.`,
    },
    bentoGrid: {
      badge: "ARQUITETURA DO MÉTODO COMPROVADO",
      title: "Como funciona o ecossistema de alta conversão",
      subtitle: "Uma esteira inteligente em blocos desenhada para transformar interesse em faturamento real.",
      items: [
        {
          id: "b1",
          size: "large",
          title: "Funil de Vendas de Alta Conversão",
          description: `Estrutura de páginas rápidas e persuasivas que convertem tráfego frio em clientes fiéis em ${city}.`,
          tag: "Pilar Principal",
          iconName: "Zap",
          metric: "+340% Conversão",
        },
        {
          id: "b2",
          size: "tall",
          title: "Qualificação Automática via Quiz",
          description: "Filtre curiosos e receba apenas leads prontos para comprar, prontos no seu WhatsApp.",
          tag: "Automação",
          iconName: "Target",
          metric: "98% Retenção",
        },
        {
          id: "b3",
          size: "standard",
          title: "Acompanhamento Individual",
          description: "Suporte dedicado e plano de ação passo a passo para garantir execução sem erros.",
          tag: "Suporte VIP",
          iconName: "CheckCircle",
        },
        {
          id: "b4",
          size: "standard",
          title: "Garantia Incondicional Blindada",
          description: "Risco zero: se você não aprovar os resultados nos primeiros 15 dias, devolvemos 100% do valor.",
          tag: "Segurança Total",
          iconName: "ShieldCheck",
        },
      ],
    },
    testimonials: {
      badge: "PROVA REAL & RESULTADOS",
      title: "Quem aplicou o método, transformou seus resultados",
      subtitle: `Veja depoimentos reais de pessoas e empresas que escalaram com a nossa estrutura em ${city}.`,
      items: [
        {
          id: "t1",
          name: "Dr. Marcelo Fagundes",
          role: "Diretor Clínico",
          companyOrCity: city,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          rating: 5,
          content: "A estrutura de Quiz e a copy regionalizada aumentaram nossa taxa de agendamento em 240% logo no primeiro mês.",
          resultHighlight: "+R$ 142.000 em 45 dias",
          verified: true,
        },
        {
          id: "t2",
          name: "Camila Nogueira",
          role: "Fundadora & Mentora",
          companyOrCity: "São Paulo, SP",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
          rating: 5,
          content: "O formulário integrado ao WhatsApp economizou horas da minha equipe e aumentou drasticamente o comparecimento nas reuniões.",
          resultHighlight: "Taxa de 89% de Comparecimento",
          verified: true,
        },
        {
          id: "t3",
          name: "Renato Silveira",
          role: "Empresário & Investidor",
          companyOrCity: city,
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          rating: 5,
          content: "Design impecável no padrão dark premium. Nossos clientes elogiam a sofisticação da página diariamente.",
          resultHighlight: "3.6x Mais Vendas",
          verified: true,
        },
      ],
    },
    formSection: {
      badge: `ETAPA FINAL • VAGAS LIMITADAS PARA ${city.toUpperCase()}`,
      title: "Preencha seus dados para receber o diagnóstico completo",
      subtitle: "Nossa equipe entrará em contato via WhatsApp em menos de 10 minutos com o seu plano personalizado.",
      ctaButtonText: "QUERO GARANTIR MINHA CONDIÇÃO ESPECIAL",
      guaranteeDays: 15,
      guaranteeText: "Garantia Incondicional de 15 Dias: Risco absolutamente zero para testar e validar.",
      securityBadges: [
        "Criptografia SSL 256-bit",
        "Atendimento Prioritário no WhatsApp",
        "Privacidade de Dados 100% Protegida",
        "Acesso Imediato aos Bônus",
      ],
      offerPrice: "R$ 497",
      originalPrice: "R$ 1.997",
      installmentsText: "ou 12x de R$ 49,90",
    },
    faq: [
      {
        id: "f1",
        question: "Como recebo o acesso e o diagnóstico após me cadastrar?",
        answer: "Assim que preencher seus dados, você receberá a confirmação imediatamente e nossa equipe enviará seu plano exclusivo diretamente no seu WhatsApp.",
      },
      {
        id: "f2",
        question: "Existe alguma garantia caso eu não fique satisfeito?",
        answer: "Sim! Você conta com 15 dias de garantia incondicional blindada. Se não gostar por qualquer motivo, basta uma mensagem para receber 100% do seu dinheiro de volta.",
      },
      {
        id: "f3",
        question: `O método funciona especificamente para o mercado de ${city}?`,
        answer: `Sim! Toda a nossa esteira foi desenvolvida e validada considerando as particularidades regionais e o perfil de clientes de ${city}.`,
      },
      {
        id: "f4",
        question: "Preciso de conhecimento técnico ou equipe para aplicar?",
        answer: "Não. A solução é 100% pronta para uso, intuitiva e acompanhada por suporte individual passo a passo.",
      },
    ],
  };
}

// AI Landing Page Generation Endpoint
app.post("/api/ai/generate-landing-page", async (req, res) => {
  try {
    const { prompt, niche, cityOrRegion, targetAudience, offerDetails, accentColor } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `Você é um Engenheiro de UI/UX Frontend de Elite e especialista em CRO (Conversion Rate Optimization), focado no padrão 'People', 'V0' e lançamentos de alto ticket.
Seu objetivo é gerar o blueprint JSON completo e impecável de uma Landing Page de altíssima conversão no estilo Dark/Hybrid Premium.

Regras de Copy e Estrutura:
1. Adapte fortemente a copy para a cidade/região ('${cityOrRegion || "Brasil"}') e nicho ('${niche || "Geral"}').
2. Crie badges de urgência e escassez regional (ex: "⚡ Vagas Abertas para [Cidade/Região] - Últimas 7 Vagas").
3. Headline ultra impactante, sem clichês genéricos. Foque na dor profunda e no benefício de alto valor.
4. Subtítulo que destrói as principais objeções.
5. Crie um Quiz de Qualificação de 3 perguntas interativas que qualifique o lead e gere curiosidade.
6. Crie uma estrutura Bento Grid de 4 a 5 blocos apresentando o método / benefícios com ícones do Lucide (como Zap, ShieldCheck, Target, TrendingUp, Sparkles, Award, Users, CheckCircle, BarChart3, Rocket).
7. Crie 3 depoimentos ultra realistas com nomes brasileiros, cidades, métricas de resultado e avatar de fotos reais de alta qualidade (Unsplash).
8. Configure formulário com garantia (7, 15 ou 30 dias) e botão CTA gigante de ação imediata.
9. Retorne APENAS o JSON no formato solicitado.`;

    const userPromptText = `Gere uma Landing Page de alta conversão completa para o seguinte briefing:
- Briefing / Ideia: ${prompt || "Programa de aceleração de resultados e mentoria premium"}
- Nicho de Mercado: ${niche || "Empreendedorismo / Serviços de Alto Valor"}
- Cidade / Região: ${cityOrRegion || "Nacional / São Paulo"}
- Público-Alvo: ${targetAudience || "Empresários, profissionais liberais e tomadores de decisão"}
- Oferta / Diferenciais: ${offerDetails || "Acesso imediato com garantia incondicional e suporte individualizado"}
- Cor de Acento sugerida: ${accentColor || "emerald"}`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        niche: { type: Type.STRING },
        cityOrRegion: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
        accentColor: {
          type: Type.STRING,
          enum: ["emerald", "purple", "cyan", "amber", "rose"],
        },
        hero: {
          type: Type.OBJECT,
          properties: {
            badgeText: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            mediaType: { type: Type.STRING, enum: ["video", "image"] },
            videoUrl: { type: Type.STRING },
            videoThumbnail: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            ctaSubtext: { type: Type.STRING },
            countdownMinutes: { type: Type.NUMBER },
            ratingText: { type: Type.STRING },
            ratingScore: { type: Type.STRING },
          },
          required: ["badgeText", "headline", "subheadline", "ctaText", "ctaSubtext"],
        },
        socialProof: {
          type: Type.OBJECT,
          properties: {
            marqueeTitle: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING },
                  sublabel: { type: Type.STRING },
                  iconName: { type: Type.STRING },
                },
                required: ["value", "label"],
              },
            },
            marqueeLogos: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["metrics", "marqueeLogos"],
        },
        quiz: {
          type: Type.OBJECT,
          properties: {
            badge: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  description: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        iconName: { type: Type.STRING },
                        badge: { type: Type.STRING },
                      },
                      required: ["id", "label"],
                    },
                  },
                },
                required: ["id", "question", "options"],
              },
            },
            resultTitle: { type: Type.STRING },
            resultDescription: { type: Type.STRING },
          },
          required: ["badge", "title", "subtitle", "questions"],
        },
        bentoGrid: {
          type: Type.OBJECT,
          properties: {
            badge: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  size: {
                    type: Type.STRING,
                    enum: ["large", "tall", "wide", "standard"],
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tag: { type: Type.STRING },
                  iconName: { type: Type.STRING },
                  metric: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                },
                required: ["id", "title", "description", "iconName"],
              },
            },
          },
          required: ["badge", "title", "subtitle", "items"],
        },
        testimonials: {
          type: Type.OBJECT,
          properties: {
            badge: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  companyOrCity: { type: Type.STRING },
                  avatarUrl: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  content: { type: Type.STRING },
                  resultHighlight: { type: Type.STRING },
                  verified: { type: Type.BOOLEAN },
                },
                required: ["name", "role", "content", "resultHighlight"],
              },
            },
          },
          required: ["badge", "title", "subtitle", "items"],
        },
        formSection: {
          type: Type.OBJECT,
          properties: {
            badge: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            ctaButtonText: { type: Type.STRING },
            guaranteeDays: { type: Type.NUMBER },
            guaranteeText: { type: Type.STRING },
            securityBadges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            offerPrice: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            installmentsText: { type: Type.STRING },
          },
          required: ["badge", "title", "subtitle", "ctaButtonText", "guaranteeText"],
        },
        faq: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
            required: ["question", "answer"],
          },
        },
      },
      required: [
        "title",
        "niche",
        "cityOrRegion",
        "hero",
        "socialProof",
        "quiz",
        "bentoGrid",
        "testimonials",
        "formSection",
      ],
    };

    if (ai) {
      try {
        const result = await callGeminiWithWaterfall(ai, {
          contents: userPromptText,
          systemInstruction,
          responseSchema,
        });

        return res.json({
          success: true,
          data: result.data,
          source: "gemini",
          modelUsed: result.modelUsed,
        });
      } catch (geminiErr: any) {
        console.warn(
          "Gemini waterfall failed or was unavailable, activating adaptive CRO engine:",
          geminiErr?.message
        );
        // Fallback to high-converting adaptive engine if all models unavailable
        const adaptivePage = generateAdaptiveLandingPage({
          prompt,
          niche,
          cityOrRegion,
          targetAudience,
          offerDetails,
          accentColor,
        });

        return res.json({
          success: true,
          data: adaptivePage,
          source: "adaptive_cro_engine",
          notice: "Página gerada pelo Motor Adaptativo de CRO devido a alta demanda temporária na nuvem.",
        });
      }
    } else {
      // Direct adaptive engine when no key
      const adaptivePage = generateAdaptiveLandingPage({
        prompt,
        niche,
        cityOrRegion,
        targetAudience,
        offerDetails,
        accentColor,
      });

      return res.json({
        success: true,
        data: adaptivePage,
        source: "adaptive_cro_engine",
      });
    }
  } catch (error: any) {
    console.error("Critical Landing page generation error:", error);
    // Even on error, provide graceful fallback
    const fallback = generateAdaptiveLandingPage(req.body || {});
    return res.json({
      success: true,
      data: fallback,
      source: "emergency_fallback",
    });
  }
});

// AI Copy Refinement / Assistant Endpoint
app.post("/api/ai/refine-copy", async (req, res) => {
  try {
    const { action, currentText, context, tone, cityOrRegion, customInstruction } = req.body;

    const ai = getGeminiClient();

    const prompt = `Você é um copywriter de elite de Conversion Rate Optimization (CRO).
Ação solicitada: ${action || "Melhorar copy"}
Texto atual: "${currentText || ""}"
Contexto: ${context || "Landing Page de Alta Conversão"}
Tom desejado: ${tone || "Agressivo, persuasivo e focado em benefícios"}
Região/Cidade: ${cityOrRegion || "Brasil"}
Instrução adicional: ${customInstruction || "Torne mais direto, atraente e com gatilhos de urgência."}

Retorne um JSON com:
- "result": O novo texto melhorado.
- "alternatives": Uma lista com 3 alternativas adicionais de alta conversão.
- "reasoning": Breve explicação de por que converte mais (1 frase).`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        result: { type: Type.STRING },
        alternatives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        reasoning: { type: Type.STRING },
      },
      required: ["result", "alternatives"],
    };

    if (ai) {
      try {
        const result = await callGeminiWithWaterfall(ai, {
          contents: prompt,
          responseSchema,
        });
        return res.json({ success: true, ...result.data });
      } catch (err: any) {
        console.warn("AI refine waterfall failed, using heuristic copy enhancer:", err?.message);
      }
    }

    // Heuristic Copy Enhancer Fallback
    const cleanText = (currentText || "").trim();
    const cityText = cityOrRegion ? ` em ${cityOrRegion}` : "";
    const improved = cleanText
      ? `⚡ [Aceleração Comprovada] ${cleanText}${cityText} com Garantia Total de Resultados`
      : `Transforme seus Resultados com Nossa Estrutura de Alta Conversão${cityText}`;

    return res.json({
      success: true,
      result: improved,
      alternatives: [
        `Como Multiplicar seus Resultados${cityText} em Menos de 14 Dias`,
        `O Método Definitivo para Escalar Vendas com Previsibilidade${cityText}`,
        `Últimas Vagas Abertas: Acesso Exclusivo à Metodologia de Alta Conversão`,
      ],
      reasoning: "Adiciona gatilho de escassez, especificidade geográfica e foco no benefício primário.",
    });
  } catch (err: any) {
    console.error("AI refine error:", err);
    return res.json({
      success: true,
      result: req.body?.currentText || "Transforme seus Resultados Agora",
      alternatives: [
        "Acelere seu Crescimento com o Método Comprovado",
        "A Solução Definitiva para o seu Negócio",
      ],
      reasoning: "Estrutura simplificada de alta conversão.",
    });
  }
});

// Setup Vite development or production middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`People CRO Builder Server running on http://localhost:${PORT}`);
  });
}

startServer();
