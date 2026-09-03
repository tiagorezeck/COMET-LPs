import React, { useState, useEffect } from "react";
import { LandingPage, LeadSubmission } from "../types/landingPage";
import { THEME_CONFIGS } from "../utils/theme";
import { PRESET_TEMPLATES } from "../data/templates";
import { loadStoredLeads, duplicateLandingPage } from "../utils/storage";
import { generateStandaloneHtml } from "../utils/htmlExporter";
import { NetworkPreviewModal } from "./NetworkPreviewModal";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Plus,
  Play,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Download,
  Users,
  TrendingUp,
  Target,
  Zap,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  FileCode,
  Shield,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Globe,
} from "lucide-react";

interface DashboardProps {
  pages: LandingPage[];
  onSelectPage: (page: LandingPage) => void;
  onOpenAiGenerator: () => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (page: LandingPage) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pages,
  onSelectPage,
  onOpenAiGenerator,
  onDeletePage,
  onDuplicatePage,
}) => {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [networkPreviewPage, setNetworkPreviewPage] = useState<LandingPage | null>(null);

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

  useEffect(() => {
    // Load leads
    const stored = loadStoredLeads();
    setLeads(stored);

    // Also fetch from API
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.leads) && data.leads.length > 0) {
          setLeads(data.leads);
        }
      })
      .catch(() => {});
  }, []);

  const totalLeads = leads.length + pages.reduce((acc, p) => acc + (p.leadsCount || 0), 0);
  const totalViews = pages.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const avgConversionRate =
    totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "12.4";

  const handleDownloadHtml = (e: React.MouseEvent, page: LandingPage) => {
    e.stopPropagation();
    const html = generateStandaloneHtml(page);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug || "landing-page"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden antialiased">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.15),rgba(255,255,255,0))]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div className="flex flex-col items-start gap-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-purple-300 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>COMET LPs - Alta conversão</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight whitespace-nowrap">
              Construtor de Landing Pages
            </h1>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleToggleFullscreen}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isFullscreen
                  ? "bg-purple-600 border-purple-500 text-white shadow-purple-950/50"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
              }`}
              title={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
              <span>{isFullscreen ? "Sair da Tela Cheia" : "Expandir tela"}</span>
            </button>

            <button
              onClick={() => setIsLeadsModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Meus leads ({leads.length})</span>
            </button>

            <button
              onClick={onOpenAiGenerator}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-purple-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar com IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Key Metrics Bento */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Páginas Criadas</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">{pages.length}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Prontas para conversão</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Leads Qualificados</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">{totalLeads.toLocaleString("pt-BR")}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Via Quiz & Formulário</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Taxa Média CRO</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400">{avgConversionRate}%</div>
            <div className="text-[11px] text-zinc-400 mt-1">Padrão People High-Ticket</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Integrações Webhook</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">HTTP POST</div>
            <div className="text-[11px] text-zinc-400 mt-1">n8n, Make, Typebot, CRM</div>
          </div>
        </section>

        {/* AI Prompt Hero Card */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Zap className="w-3.5 h-3.5" />
              <span>GERAÇÃO COM LAN • AGENTE DE IA CRO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Descreva sua oferta e o LAN gera uma Landing Page pronta para rodar tráfego
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              O LAN pesquisa as dores do seu público, cria headlines agressivas, monta o Quiz de 3 etapas, estrutura o Bento Grid e configura o formulário de conversão final.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAiGenerator}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-purple-950/60 inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="w-5 h-5" />
                <span>Abrir LAN • Agente de IA CRO</span>
              </button>
            </div>
          </div>
        </section>

        {/* My Saved Landing Pages Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Minhas Landing Pages Salvas</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Clique para abrir no Editor em Tempo Real (Lovable Engine).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((p) => {
              const themeCfg = THEME_CONFIGS[p.accentColor] || THEME_CONFIGS.purple;

              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectPage(p)}
                  className="rounded-3xl overflow-hidden bg-zinc-900/70 border border-zinc-800/90 hover:border-purple-500/50 transition-all flex flex-col justify-between group cursor-pointer shadow-xl relative"
                >
                  {/* Thumbnail / Header Area */}
                  <div>
                    <div className="aspect-[16/9] w-full bg-zinc-950 relative overflow-hidden border-b border-zinc-800/80">
                      <img
                        src={p.hero.videoThumbnail || p.hero.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${themeCfg.badgeBg} ${themeCfg.badgeText} border ${themeCfg.badgeBorder}`}
                        >
                          {p.niche}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          <span className="truncate max-w-[180px]">{p.cityOrRegion}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {p.leadsCount ? `+${p.leadsCount} leads` : "Pronta"}
                        </span>
                      </div>
                    </div>

                    {/* Info Body */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.hero.headline}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 border-t border-zinc-800/60 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNetworkPreviewPage(p);
                        }}
                        className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 transition-colors cursor-pointer"
                        title="Link de Teste (Celular / Outro Navegador)"
                      >
                        <Globe className="w-3.5 h-3.5 text-purple-400" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePage(p);
                        }}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                        title="Duplicar Página"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownloadHtml(e, p)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                        title="Baixar HTML"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Deseja excluir "${p.title}"?`)) {
                            onDeletePage(p.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPage(p)}
                      className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Preset Templates Showcase */}
        <section className="space-y-6 pt-6 border-t border-zinc-800/80">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
              MODELOS PRÉ-CONFIGURADOS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Templates Prontos para Testar e Duplicar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => onDuplicatePage(tmpl)}
                className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-500/20">
                      {tmpl.niche}
                    </span>
                    <span className="text-[11px] text-zinc-400">{tmpl.cityOrRegion}</span>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {tmpl.hero.subheadline}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                  <span>Duplicar e Usar Modelo</span>
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Leads Submissions Modal / Drawer */}
      <AnimatePresence>
        {isLeadsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>Leads e Diagnósticos Capturados ({leads.length})</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Dados coletados no formulário, respostas do Quiz de qualificação e UTMs de tráfego.
                  </p>
                </div>
                <button
                  onClick={() => setIsLeadsModalOpen(false)}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">
                  Nenhum lead capturado ainda. Abra uma Landing Page e envie um formulário de teste!
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{lead.name}</div>
                            <div className="text-xs text-zinc-400">{lead.pageTitle}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{lead.whatsapp}</span>
                          </a>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(lead.submittedAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Quiz Answers Details */}
                      {lead.quizAnswers && Object.keys(lead.quizAnswers).length > 0 && (
                        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                            Diagnóstico do Quiz:
                          </div>
                          {Object.entries(lead.quizAnswers).map(([k, ans]) => (
                            <div key={k} className="flex items-center justify-between text-zinc-300">
                              <span className="text-zinc-500 capitalize">{k.replace("_", " ")}:</span>
                              <span className="font-semibold text-white">{ans}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* UTMs Tags */}
                      {lead.utms && Object.keys(lead.utms).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-zinc-400">
                          {Object.entries(lead.utms).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                              <strong className="text-zinc-300">{k}:</strong> {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Network / Standalone Preview Modal */}
      {networkPreviewPage && (
        <NetworkPreviewModal
          isOpen={!!networkPreviewPage}
          onClose={() => setNetworkPreviewPage(null)}
          page={networkPreviewPage}
        />
      )}
    </div>
  );
};
