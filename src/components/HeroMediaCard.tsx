import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Play,
  Volume2,
  Maximize2,
  Sparkles,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  Sliders,
  Check,
  Star,
  CheckCircle2,
  Layers,
  LayoutTemplate,
  Smartphone,
  Tv,
  Square,
  ArrowUp,
  ArrowDown,
  GripHorizontal,
} from "lucide-react";
import {
  HeroSection,
  MediaOrientation,
  MediaPosition,
  CardRadius,
} from "../types/landingPage";
import { getRadiusClass } from "../utils/theme";

interface HeroMediaCardProps {
  hero: HeroSection;
  isEditorPreview?: boolean;
  neonGlowColor?: string;
  themeGlow?: string;
  ctaBgClass?: string;
  ctaGlowClass?: string;
  onUpdateHero: (updatedHero: Partial<HeroSection> | ((prev: HeroSection) => Partial<HeroSection>)) => void;
  onOpenImagePicker?: (config: {
    type: "hero" | "logo" | "bento" | "testimonial";
    currentUrl: string;
    targetId?: string;
    title?: string;
  }) => void;
  childrenOverlay?: React.ReactNode;
}

export const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  hero,
  isEditorPreview = false,
  neonGlowColor,
  themeGlow,
  ctaBgClass = "bg-gradient-to-r from-purple-600 to-indigo-600",
  ctaGlowClass = "shadow-purple-500/50",
  onUpdateHero,
  onOpenImagePicker,
  childrenOverlay,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<"width" | "height" | "both" | null>(null);
  const [isMovingY, setIsMovingY] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ x: number; y: number; startWidth: number; startHeight: number }>({
    x: 0,
    y: 0,
    startWidth: 0,
    startHeight: 0,
  });
  const startMoveYRef = useRef<{ startClientY: number; startOffsetY: number }>({
    startClientY: 0,
    startOffsetY: 0,
  });

  const effectiveGlow = neonGlowColor || themeGlow || "rgba(168, 85, 247, 0.4)";

  // Safe updater helper that works whether onUpdateHero expects an object or updater callback
  const safeUpdate = (partial: Partial<HeroSection>) => {
    try {
      if (typeof onUpdateHero === "function") {
        onUpdateHero(partial);
      }
    } catch (err) {
      console.error("Failed to update hero media:", err);
    }
  };

  // Current values or defaults
  const orientation: MediaOrientation = hero.mediaOrientation || (hero.model === "split_video" ? "vertical" : "horizontal");
  const position: MediaPosition = hero.mediaPosition || "right";
  const widthPercent = hero.mediaWidthPercent ?? (hero.model === "split_video" ? 38 : 45);
  const maxHeightPx = hero.mediaMaxHeightPx ?? (hero.model === "split_video" ? 540 : 480);
  const offsetY = hero.mediaOffsetY ?? 0;
  const radius = hero.mediaBorderRadius || "2xl";
  const objectFit = hero.mediaObjectFit || "cover";

  // Aspect ratio class calculation based on orientation
  const getAspectRatioClass = () => {
    switch (orientation) {
      case "vertical":
        return "aspect-[9/16] sm:aspect-[4/5]";
      case "horizontal":
        return "aspect-[16/9]";
      case "square":
        return "aspect-[1/1]";
      case "custom":
      case "auto":
      default:
        return "";
    }
  };

  // Reset to original default size and position
  const handleResetOriginal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    safeUpdate({
      mediaWidthPercent: undefined,
      mediaMaxHeightPx: undefined,
      mediaOrientation: hero.model === "split_video" ? "vertical" : "horizontal",
      mediaOffsetY: 0,
    });
  };

  // Drag-to-resize handlers
  const handleStartResize = (e: React.MouseEvent, dir: "width" | "height" | "both") => {
    if (!isEditorPreview) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(dir);

    const rect = containerRef.current?.getBoundingClientRect();
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      startWidth: rect?.width || 400,
      startHeight: rect?.height || maxHeightPx,
    };
  };

  // Drag-to-move-Y handlers (Moving card up / down)
  const handleStartMoveY = (e: React.MouseEvent) => {
    if (!isEditorPreview) return;
    e.preventDefault();
    e.stopPropagation();

    setIsMovingY(true);
    startMoveYRef.current = {
      startClientY: e.clientY,
      startOffsetY: offsetY,
    };
  };

  // Mouse move listener for resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      if (resizeDirection === "width" || resizeDirection === "both") {
        const parentWidth = containerRef.current?.parentElement?.parentElement?.clientWidth || 1000;
        const newWidthPx = Math.max(250, Math.min(parentWidth * 0.75, startPosRef.current.startWidth + (position === "left" ? deltaX : -deltaX)));
        const newPercent = Math.round((newWidthPx / parentWidth) * 100);
        const clampedPercent = Math.max(25, Math.min(70, newPercent));

        safeUpdate({
          mediaWidthPercent: clampedPercent,
        });
      }

      if (resizeDirection === "height" || resizeDirection === "both") {
        const newHeightPx = Math.max(200, Math.min(850, Math.round(startPosRef.current.startHeight + deltaY)));
        safeUpdate({
          mediaMaxHeightPx: newHeightPx,
          mediaOrientation: "custom",
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeDirection, position]);

  // Mouse move listener for vertical position moving (Up / Down)
  useEffect(() => {
    if (!isMovingY) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startMoveYRef.current.startClientY;
      const newOffsetY = Math.round(startMoveYRef.current.startOffsetY + deltaY);
      // Allow moving up to -350px (subir) and down to +350px (descer)
      const clampedOffset = Math.max(-350, Math.min(350, newOffsetY));

      safeUpdate({
        mediaOffsetY: clampedOffset,
      });
    };

    const handleMouseUp = () => {
      setIsMovingY(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMovingY]);

  const isCustomized =
    hero.mediaWidthPercent !== undefined ||
    hero.mediaMaxHeightPx !== undefined ||
    (hero.mediaOffsetY !== undefined && hero.mediaOffsetY !== 0) ||
    (hero.mediaOrientation && hero.mediaOrientation !== (hero.model === "split_video" ? "vertical" : "horizontal"));

  return (
    <div
      ref={containerRef}
      className="relative group/media w-full select-none"
      style={{
        transform: offsetY !== 0 ? `translateY(${offsetY}px)` : undefined,
        transition: isMovingY ? "none" : "transform 0.15s ease-out",
      }}
      onMouseEnter={() => isEditorPreview && setShowControls(true)}
      onMouseLeave={() => isEditorPreview && !isResizing && !isMovingY && setShowControls(false)}
    >
      {/* Editor Floating Action Bar - Positioned BELOW the media card */}
      {isEditorPreview && (
        <div
          className={`absolute top-full mt-3 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-zinc-950/98 border border-purple-500/80 shadow-2xl backdrop-blur-xl text-xs font-semibold text-white transition-all ${
            showControls || isResizing || isMovingY ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left group: Orientation pills */}
          <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOrientation: "horizontal" });
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                orientation === "horizontal"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Formato Horizontal (16:9 Widescreen)"
            >
              <Tv className="w-3 h-3" />
              <span>Horizontal</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOrientation: "vertical" });
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                orientation === "vertical"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Formato Vertical (9:16 Reels / VSL)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Vertical</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOrientation: "square" });
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                orientation === "square"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Formato Quadrado (1:1)"
            >
              <Square className="w-3 h-3" />
              <span>1:1</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOrientation: "custom" });
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                orientation === "custom"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Altura Livre / Customizada"
            >
              <Sliders className="w-3 h-3" />
              <span>Livre</span>
            </button>
          </div>

          {/* Middle Group: Vertical Position (Up / Down) Controls */}
          <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOffsetY: offsetY - 20 });
              }}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1 transition-colors cursor-pointer"
              title="Mover o Card para Cima (-20px)"
            >
              <ArrowUp className="w-3 h-3 text-cyan-400" />
              <span>Subir</span>
            </button>

            <div
              onMouseDown={handleStartMoveY}
              className="px-1.5 py-0.5 rounded bg-zinc-950 text-[10px] font-mono font-bold text-cyan-300 border border-zinc-700 cursor-ns-resize flex items-center gap-1"
              title="Arraste aqui para Mover Livremente para Cima/Baixo"
            >
              <MoveVertical className="w-2.5 h-2.5 text-cyan-400" />
              <span>{offsetY > 0 ? `+${offsetY}px` : offsetY < 0 ? `${offsetY}px` : "0px"}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({ mediaOffsetY: offsetY + 20 });
              }}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1 transition-colors cursor-pointer"
              title="Mover o Card para Baixo (+20px)"
            >
              <ArrowDown className="w-3 h-3 text-cyan-400" />
              <span>Descer</span>
            </button>
          </div>

          {/* Right group: Flip Position, Reset Original, and Change Image */}
          <div className="flex items-center gap-1">
            {/* Position Flip Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                safeUpdate({
                  mediaPosition: position === "left" ? "right" : "left",
                });
              }}
              className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-purple-600 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Alternar posição: Esquerda ⇋ Direita"
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{position === "left" ? "Direita ➡" : "⬅ Esquerda"}</span>
            </button>

            {/* Reset to Original Size & Position Button */}
            <button
              type="button"
              onClick={handleResetOriginal}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isCustomized
                  ? "bg-amber-950/80 hover:bg-amber-600 text-amber-200 hover:text-white border-amber-500/50"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800"
              }`}
              title="Restaurar tamanho e posição original padrão da Hero"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Tamanho Original</span>
            </button>

            {/* Change Image / Media Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenImagePicker?.({
                  type: "hero",
                  currentUrl: hero.videoThumbnail || hero.imageUrl,
                  title: "Trocar Imagem / Capa do Hero",
                });
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-purple-950/50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Trocar</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Media Card Frame */}
      <div
        className={`relative overflow-hidden ${
          radius === "3xl" ? "rounded-[2.5rem]" : radius === "2xl" ? "rounded-[2rem]" : "rounded-3xl"
        } bg-zinc-900/70 backdrop-blur-xl p-2 sm:p-3 border border-zinc-800/80 shadow-2xl transition-all ${
          isEditorPreview ? "hover:border-purple-500/60" : ""
        }`}
        style={{
          boxShadow: `0 0 45px ${effectiveGlow}`,
          maxHeight: orientation === "custom" ? `${maxHeightPx}px` : undefined,
        }}
      >
        {/* Top Center Drag Handle for Moving Up/Down (Editor Only) */}
        {isEditorPreview && (
          <div
            onMouseDown={handleStartMoveY}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-zinc-950/90 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-200 hover:text-white flex items-center gap-1.5 cursor-ns-resize shadow-xl text-[10px] font-bold transition-all hover:scale-105 select-none group/draghandle"
            title="Clique e arraste para CIMA ou para BAIXO para posicionar verticalmente"
          >
            <GripHorizontal className="w-3 h-3 text-cyan-400 group-hover/draghandle:animate-pulse" />
            <span>Arraste para Mover Verticalmente</span>
            {offsetY !== 0 && (
              <span className="text-cyan-300 font-mono">({offsetY > 0 ? `+${offsetY}px` : `${offsetY}px`})</span>
            )}
          </div>
        )}

        {/* MEDIA CONTENT (Image vs Video) */}
        {hero.mediaType === "video" || hero.model === "split_video" ? (
          <div
            className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden bg-zinc-950 relative`}
            style={{
              maxHeight: `${maxHeightPx}px`,
            }}
          >
            {isVideoPlaying && !isEditorPreview ? (
              <iframe
                src={
                  hero.videoUrl?.includes("?")
                    ? `${hero.videoUrl}&autoplay=1`
                    : `${hero.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}?autoplay=1`
                }
                title="VSL Video Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => !isEditorPreview && setIsVideoPlaying(true)}
                className="w-full h-full relative cursor-pointer group"
              >
                <img
                  src={hero.videoThumbnail || hero.imageUrl}
                  alt="Video Showcase"
                  className={`w-full h-full object-${objectFit} transition-transform duration-500 opacity-90`}
                  referrerPolicy="no-referrer"
                  style={{
                    maxHeight: `${maxHeightPx}px`,
                    objectPosition: `${hero.imagePositionX ?? 50}% ${hero.imagePositionY ?? 50}%`,
                    transform: `scale(${(hero.imageZoom ?? 100) / 100})`,
                    transformOrigin: `${hero.imagePositionX ?? 50}% ${hero.imagePositionY ?? 50}%`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 flex flex-col items-center justify-center p-6">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full ${ctaBgClass} flex items-center justify-center text-white shadow-2xl ${ctaGlowClass} mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-xl">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Clique para assistir com áudio</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden bg-zinc-950/60 relative flex items-center justify-center`}
            style={{
              maxHeight: `${maxHeightPx}px`,
            }}
          >
            <img
              src={hero.imageUrl}
              alt="Hero Showcase"
              className={`w-full h-full object-${objectFit} rounded-2xl transition-transform duration-500`}
              referrerPolicy="no-referrer"
              style={{
                maxHeight: `${maxHeightPx}px`,
                objectPosition: `${hero.imagePositionX ?? 50}% ${hero.imagePositionY ?? 50}%`,
                transform: `scale(${(hero.imageZoom ?? 100) / 100})`,
                transformOrigin: `${hero.imagePositionX ?? 50}% ${hero.imagePositionY ?? 50}%`,
              }}
            />
          </div>
        )}

        {/* Optional Custom Overlays (e.g. Model 2 Floating Review Badge) */}
        {childrenOverlay}

        {/* INTERACTIVE DRAG-TO-RESIZE HANDLES (Editor Only) */}
        {isEditorPreview && (
          <>
            {/* Bottom-Right Corner Handle (Both Width & Height) */}
            <div
              onMouseDown={(e) => handleStartResize(e, "both")}
              className="absolute bottom-1 right-1 z-30 w-6 h-6 rounded-br-2xl bg-purple-600/80 hover:bg-purple-500 text-white flex items-center justify-center cursor-se-resize shadow-lg transition-transform hover:scale-110"
              title="Arraste para redimensionar Largura e Altura livremente"
            >
              <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-white rounded-br-xs" />
            </div>

            {/* Bottom Edge Handle (Height Resize) */}
            <div
              onMouseDown={(e) => handleStartResize(e, "height")}
              className="absolute bottom-0 left-12 right-12 z-20 h-3 flex items-center justify-center cursor-s-resize group/edge"
              title="Arraste para aumentar/diminuir Altura"
            >
              <div className="w-12 h-1 bg-purple-500/50 group-hover/edge:bg-purple-400 rounded-full" />
            </div>

            {/* Right or Left Edge Handle (Width Resize) */}
            <div
              onMouseDown={(e) => handleStartResize(e, "width")}
              className={`absolute top-12 bottom-12 z-20 w-3 flex items-center justify-center cursor-e-resize group/side ${
                position === "left" ? "right-0" : "left-0"
              }`}
              title="Arraste para aumentar/diminuir Largura da Coluna"
            >
              <div className="h-12 w-1 bg-purple-500/50 group-hover/side:bg-purple-400 rounded-full" />
            </div>

            {/* Resizing Floating Tooltip */}
            {isResizing && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 pointer-events-none">
                <Sliders className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Largura: {widthPercent}% • Altura: {maxHeightPx}px</span>
              </div>
            )}

            {/* Moving Y Floating Tooltip */}
            {isMovingY && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-3.5 py-2 rounded-xl bg-indigo-950/95 border border-cyan-400 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 pointer-events-none">
                <MoveVertical className="w-4 h-4 text-cyan-300 animate-bounce" />
                <span>Posição Vertical: {offsetY > 0 ? `+${offsetY}px (Para Baixo)` : offsetY < 0 ? `${offsetY}px (Para Cima)` : "0px (Padrão)"}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

