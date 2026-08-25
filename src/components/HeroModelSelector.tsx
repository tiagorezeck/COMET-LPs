import React from "react";
import { HeroModel, AccentColor } from "../types/landingPage";
import {
  Layout,
  Video,
  FileText,
  Briefcase,
  BookOpen,
  Sparkles,
  Check,
  Smartphone,
  Eye,
  Sliders,
  X,
} from "lucide-react";

export interface HeroModelDefinition {
  id: HeroModel;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  bestFor: string;
  diagram: "split_image" | "split_video" | "centered_showcase" | "split_lead_form" | "b2b_metrics" | "editorial_ebook";
}

export const HERO_MODELS: HeroModelDefinition[] = [
  {
    id: "split_image",
    title: "Modelo 1: Split com Imagem",
    subtitle: "Clássico 2 Colunas",
    badge: "Alta Conversão",
    icon: Layout,
    description: "Headline e CTA de alto impacto à esquerda; card flutuante com imagem ou mockup do produto à direita.",
    bestFor: "Cursos, Mentorias, E-commerces e SaaS",
    diagram: "split_image",
  },
  {
    id: "split_video",
    title: "Modelo 2: VSL & Vídeo Vertical",
    subtitle: "Player 4:5 com Avaliação Flutuante",
    badge: "Mais Vendido",
    icon: Video,
    description: "Headline e avatares de alunos à esquerda; player de vídeo/VSL vertical com botão play circular e nota 4.9/5 sobreposta.",
    bestFor: "Infoprodutos, VSLs, Lançamentos e Produtos Digitais",
    diagram: "split_video",
  },
  {
    id: "centered_showcase",
    title: "Modelo 3: Vitrine Centralizada",
    subtitle: "Com Barra de Métricas na Base",
    badge: "Tech & Modern",
    icon: Sparkles,
    description: "Headline gigante centralizada no topo e vitrine ampla com 3 métricas embutidas na base do card (+42% Conversão, 14min SLA).",
    bestFor: "Softwares, Plataformas, CRMs e Soluções Tecnológicas",
    diagram: "centered_showcase",
  },
  {
    id: "split_lead_form",
    title: "Modelo 4: Captura Direta na Hero",
    subtitle: "Lead Magnet com Form Embutido",
    badge: "Geração de Leads",
    icon: Smartphone,
    description: "Mockup 3D de tablet/e-book à esquerda e formulário direto de captura (Nome, Whats, E-mail) à direita para download imediato.",
    bestFor: "E-books Gratuitos, Iscas Digitais, Vouchers e Inscrições",
    diagram: "split_lead_form",
  },
  {
    id: "b2b_metrics",
    title: "Modelo 5: Consultoria & B2B",
    subtitle: "2 Botões + Linha de Métricas & Vagas",
    badge: "Corporativo & High-Ticket",
    icon: Briefcase,
    description: "Headline executiva, 2 botões de ação (Reunião + WhatsApp), linha de números de autoridade e card com barra de vagas restantes.",
    bestFor: "Consultorias, Agências, Escolas Técnicas e Serviços B2B",
    diagram: "b2b_metrics",
  },
  {
    id: "editorial_ebook",
    title: "Modelo 6: Editorial & Autor",
    subtitle: "Fundo Imersivo & Tipografia Elegante",
    badge: "Refinado & Clássico",
    icon: BookOpen,
    description: "Imagem imersiva de fundo com overlay elegante, nome do autor, badge de formatos (PDF, ePub) e botão de download outline.",
    bestFor: "Livros, Biografias, E-books Premium e Autores",
    diagram: "editorial_ebook",
  },
];

interface HeroModelSelectorProps {
  currentModel?: HeroModel;
  onSelectModel: (model: HeroModel) => void;
  accentColor?: AccentColor;
  className?: string;
  isCompact?: boolean;
  onClose?: () => void;
}

export const HeroModelSelector: React.FC<HeroModelSelectorProps> = ({
  currentModel = "split_image",
  onSelectModel,
  accentColor = "purple",
  className = "",
  isCompact = false,
  onClose,
}) => {
  const content = (
    <div className={`space-y-4 ${className}`}>
      {!isCompact && !onClose && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Modelos de Hero Pré-Definidos</span>
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Escolha o formato visual ideal para a sua proposta de valor.
            </p>
          </div>
        </div>
      )}

      <div className={isCompact ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        {HERO_MODELS.map((model) => {
          const isSelected = currentModel === model.id;
          const Icon = model.icon;

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? "bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-950/50 ring-1 ring-purple-500/50"
                  : "bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
              }`}
            >
              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "bg-zinc-800 text-zinc-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                    {model.badge}
                  </span>
                </div>

                {/* Title and Subtitle */}
                <h5 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {model.title}
                </h5>
                <p className="text-[11px] font-medium text-zinc-400 mb-2">
                  {model.subtitle}
                </p>

                {/* Visual Mini Diagram Wireframe */}
                <div className="w-full h-14 rounded-xl bg-zinc-950/80 border border-zinc-800/70 p-1.5 flex items-center justify-center overflow-hidden mb-2">
                  {model.diagram === "split_image" && (
                    <div className="w-full h-full flex items-center gap-1.5">
                      <div className="flex-1 space-y-1">
                        <div className="w-3/4 h-1.5 rounded bg-purple-500/60" />
                        <div className="w-full h-1 rounded bg-zinc-700" />
                        <div className="w-1/2 h-1 rounded bg-zinc-700" />
                        <div className="w-2/3 h-2 rounded bg-purple-600" />
                      </div>
                      <div className="w-12 h-full rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-zinc-700/60" />
                      </div>
                    </div>
                  )}

                  {model.diagram === "split_video" && (
                    <div className="w-full h-full flex items-center gap-1.5">
                      <div className="flex-1 space-y-1">
                        <div className="w-4/5 h-1.5 rounded bg-purple-500/60" />
                        <div className="w-full h-1 rounded bg-zinc-700" />
                        <div className="w-1/2 h-2 rounded bg-purple-600" />
                      </div>
                      <div className="w-11 h-full rounded-lg bg-zinc-800 border border-zinc-700 relative flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-2 border-t-transparent border-b-2 border-b-transparent border-l-3 border-l-white translate-x-0.5" />
                        </div>
                        <div className="absolute -bottom-1 -left-1 px-1 rounded bg-amber-400 text-[6px] text-black font-bold">
                          ★ 4.9
                        </div>
                      </div>
                    </div>
                  )}

                  {model.diagram === "centered_showcase" && (
                    <div className="w-full h-full flex flex-col items-center justify-between py-0.5">
                      <div className="w-2/3 h-1.5 rounded bg-purple-500/60" />
                      <div className="w-1/3 h-1.5 rounded bg-purple-600" />
                      <div className="w-4/5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-end justify-around px-1 pb-0.5">
                        <div className="w-3 h-1 rounded bg-zinc-600 text-[5px]" />
                        <div className="w-3 h-1 rounded bg-zinc-600 text-[5px]" />
                        <div className="w-3 h-1 rounded bg-zinc-600 text-[5px]" />
                      </div>
                    </div>
                  )}

                  {model.diagram === "split_lead_form" && (
                    <div className="w-full h-full flex items-center gap-1.5">
                      <div className="w-10 h-full rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 space-y-1 bg-zinc-900 p-1 rounded border border-zinc-800">
                        <div className="w-full h-1.5 rounded bg-zinc-700" />
                        <div className="w-full h-1.5 rounded bg-zinc-700" />
                        <div className="w-full h-2 rounded bg-emerald-500" />
                      </div>
                    </div>
                  )}

                  {model.diagram === "b2b_metrics" && (
                    <div className="w-full h-full flex items-center gap-1.5">
                      <div className="flex-1 space-y-1">
                        <div className="w-4/5 h-1.5 rounded bg-purple-500/60" />
                        <div className="flex gap-1">
                          <div className="w-1/2 h-2 rounded bg-purple-600" />
                          <div className="w-1/2 h-2 rounded bg-zinc-700" />
                        </div>
                        <div className="flex gap-1 pt-0.5">
                          <div className="w-1/3 h-1 rounded bg-zinc-600" />
                          <div className="w-1/3 h-1 rounded bg-zinc-600" />
                          <div className="w-1/3 h-1 rounded bg-zinc-600" />
                        </div>
                      </div>
                      <div className="w-11 h-full rounded-lg bg-zinc-800 border border-zinc-700 p-1 flex flex-col justify-end">
                        <div className="w-full h-1 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  )}

                  {model.diagram === "editorial_ebook" && (
                    <div className="w-full h-full rounded bg-zinc-900 border border-zinc-800 p-1.5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="w-1/3 h-1 rounded bg-zinc-600 mb-1" />
                      <div className="w-3/4 h-2 rounded bg-purple-400/80 font-serif mb-1" />
                      <div className="w-1/2 h-1.5 rounded border border-purple-400 text-[6px]" />
                    </div>
                  )}
                </div>

                {!isCompact && (
                  <p className="text-[10px] text-zinc-400 leading-snug line-clamp-2">
                    {model.description}
                  </p>
                )}
              </div>

              {!isCompact && (
                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-medium text-zinc-400">Indicado para:</span>
                  <span className="text-purple-300 font-semibold truncate max-w-[150px]">{model.bestFor}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div
        data-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      >
        <div className="relative w-full max-w-4xl bg-zinc-950 border border-purple-500/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 my-auto text-zinc-100 max-h-[90vh] overflow-y-auto">
          {/* Top Modal Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Escolher Modelo da Seção Hero</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Selecione entre os 6 formatos de alta conversão para transformar o topo da sua página.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {content}
        </div>
      </div>
    );
  }

  return content;
};
