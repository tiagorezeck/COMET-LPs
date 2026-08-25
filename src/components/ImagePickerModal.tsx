import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Search,
  Check,
  Sparkles,
  Layers,
  User,
  Building,
  TrendingUp,
  Activity,
  Laptop,
  ShoppingBag,
} from "lucide-react";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  initialPositionX?: number;
  initialPositionY?: number;
  initialZoom?: number;
  onSelectImage: (
    newUrl: string,
    imageCustomization?: { positionX: number; positionY: number; zoom: number }
  ) => void;
  title?: string;
  targetType?: "hero" | "bento" | "avatar" | "media";
}

interface ImagePreset {
  category: string;
  icon: any;
  items: { label: string; url: string; tag?: string }[];
}

export const IMAGE_PRESETS: ImagePreset[] = [
  {
    category: "Negócios & Executivo",
    icon: Building,
    items: [
      {
        label: "Executivo em Escritório Moderno",
        url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
        tag: "Alta Conversão",
      },
      {
        label: "Reunião de Diretoria de Alto Nível",
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        tag: "Mentoria",
      },
      {
        label: "Líder Corporativo Apresentando",
        url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Consultoria Estratégica Individual",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Mesa de Negociações e Contratos",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    category: "Métricas & Dashboards",
    icon: TrendingUp,
    items: [
      {
        label: "Gráficos de Crescimento e Vendas",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        tag: "CRO & Escala",
      },
      {
        label: "Analytics e Indicadores Financeiros",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Tela de Performance em Dark Mode",
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Planejamento Estratégico com Gráficos",
        url: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    category: "Saúde, Clínica & Estética",
    icon: Activity,
    items: [
      {
        label: "Clínica Médica & Especialista",
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
        tag: "Clínicas",
      },
      {
        label: "Procedimentos de Estética Avançada",
        url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
        tag: "Estética",
      },
      {
        label: "Consultório Odontológico Premium",
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Médica Especialista com Paciente",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    category: "Tecnologia, SaaS & IA",
    icon: Laptop,
    items: [
      {
        label: "Workstation Tecnológica com Telas",
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        tag: "Tech",
      },
      {
        label: "Time de Engenharia & Inovação",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Interface Futurista e Inteligência Artificial",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Desenvolvimento e Código de Alta Velocidade",
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    category: "Avatares & Depoimentos",
    icon: User,
    items: [
      {
        label: "Avatar Feminino Executivo",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Avatar Masculino Líder",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Avatar Masculino Especialista",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Avatar Feminino Médica / Diretora",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Avatar Masculino Empreendedor",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Avatar Feminino Consultora",
        url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
];

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  initialPositionX = 50,
  initialPositionY = 50,
  initialZoom = 100,
  onSelectImage,
  title = "Trocar Imagem do Elemento",
  targetType = "media",
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl || "");
  const [positionX, setPositionX] = useState<number>(initialPositionX);
  const [positionY, setPositionY] = useState<number>(initialPositionY);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [activeCategory, setActiveCategory] = useState<string>("Negócios & Executivo");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (selectedUrl.trim()) {
      onSelectImage(selectedUrl.trim(), {
        positionX,
        positionY,
        zoom,
      });
      onClose();
    }
  };

  // Filter presets based on search query or active category
  const filteredPresets = searchQuery
    ? IMAGE_PRESETS.flatMap((cat) =>
        cat.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : IMAGE_PRESETS.find((cat) => cat.category === activeCategory)?.items || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white">{title}</h3>
                <p className="text-xs text-zinc-400">
                  Insira uma URL direta, faça upload ou selecione um preset de alta conversão.
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
            {/* Direct URL & Upload Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  URL Direta da Imagem
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={selectedUrl}
                      onChange={(e) => setSelectedUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Current Preview Thumbnail with Zoom & Position Effect */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Prévia do Enquadramento
                </label>
                <div className="h-28 rounded-xl border border-purple-500/40 overflow-hidden bg-zinc-900 flex items-center justify-center relative group shadow-inner">
                  {selectedUrl ? (
                    <img
                      src={selectedUrl}
                      alt="Prévia selecionada"
                      className="w-full h-full object-cover transition-all duration-150"
                      style={{
                        objectPosition: `${positionX}% ${positionY}%`,
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: `${positionX}% ${positionY}%`,
                      }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" /> Nenhuma imagem
                    </span>
                  )}
                  <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-xl" />
                </div>
              </div>
            </div>

            {/* Position & Zoom Adjustment Box (Enquadramento & Rosto) */}
            {selectedUrl && (
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Enquadramento, Posição & Zoom
                    </span>
                  </div>
                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPositionX(50);
                        setPositionY(20);
                        setZoom(125);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-purple-600 transition-colors"
                      title="Foco e zoom no Rosto (Topo da imagem)"
                    >
                      <User className="w-3 h-3 text-purple-400" />
                      <span>👤 Centralizar Rosto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPositionX(50);
                        setPositionY(50);
                        setZoom(100);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold cursor-pointer hover:bg-zinc-700 transition-colors"
                    >
                      🎯 Centro Exato
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPositionX(50);
                        setPositionY(0);
                      }}
                      className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold cursor-pointer hover:bg-zinc-700 transition-colors"
                    >
                      ⬆ Topo
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPositionX(50);
                        setPositionY(100);
                      }}
                      className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold cursor-pointer hover:bg-zinc-700 transition-colors"
                    >
                      ⬇ Base
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Vertical Position Slider (Y) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                      <span>Posição Vertical (Y)</span>
                      <span className="font-mono text-purple-300 font-bold">{positionY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={positionY}
                      onChange={(e) => setPositionY(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500">
                      <span>0% (Topo/Rosto)</span>
                      <span>50%</span>
                      <span>100% (Base)</span>
                    </div>
                  </div>

                  {/* Horizontal Position Slider (X) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                      <span>Posição Horizontal (X)</span>
                      <span className="font-mono text-purple-300 font-bold">{positionX}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={positionX}
                      onChange={(e) => setPositionX(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500">
                      <span>0% (Esq)</span>
                      <span>50%</span>
                      <span>100% (Dir)</span>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                      <span>Nível de Zoom</span>
                      <span className="font-mono text-purple-300 font-bold">{zoom}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      step="5"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500">
                      <span>100% (Normal)</span>
                      <span>175%</span>
                      <span>250% (Aproximar)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Presets Navigation & Search */}
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {IMAGE_PRESETS.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.category && !searchQuery;
                    return (
                      <button
                        key={cat.category}
                        onClick={() => {
                          setActiveCategory(cat.category);
                          setSearchQuery("");
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                          isActive
                            ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                            : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.category}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar fotos..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredPresets.map((item, idx) => {
                  const isCurrent = selectedUrl === item.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedUrl(item.url)}
                      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                        isCurrent
                          ? "border-purple-500 ring-2 ring-purple-500/50 scale-[1.02] shadow-lg shadow-purple-950/50"
                          : "border-zinc-800 hover:border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-950 relative">
                        <img
                          src={item.url}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {isCurrent && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        {item.tag && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30">
                            {item.tag}
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 text-[11px] font-medium text-zinc-300 truncate bg-zinc-900/90">
                        {item.label}
                      </div>
                    </div>
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
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedUrl}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Imagem</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
