import { AccentColor } from "../types/landingPage";

export interface ThemeColors {
  name: string;
  primaryHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradientText: string;
  ctaBg: string;
  ctaHover: string;
  ctaGlow: string;
  cardBorderHover: string;
  neonGlow: string;
  quizSelectedBorder: string;
  quizSelectedBg: string;
  progressBar: string;
  iconBg: string;
  iconText: string;
  glowColor: string;
  primaryColor: string;
  secondaryColor: string;
  lightBadgeBg: string;
  lightBadgeText: string;
  lightBadgeBorder: string;
}

export const THEME_CONFIGS: Record<AccentColor, ThemeColors> = {
  orange: {
    name: "Laranja Degradê",
    primaryHex: "#ea580c",
    badgeBg: "bg-orange-950/70",
    badgeText: "text-orange-300",
    badgeBorder: "border-orange-500/50",
    gradientText: "from-orange-400 via-amber-300 to-red-400",
    ctaBg: "bg-gradient-to-r from-orange-600 via-amber-500 to-red-600",
    ctaHover: "hover:from-orange-500 hover:via-amber-400 hover:to-red-500",
    ctaGlow: "shadow-[0_0_35px_rgba(234,88,12,0.5)]",
    cardBorderHover: "hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(234,88,12,0.25)]",
    neonGlow: "rgba(234,88,12,0.35)",
    quizSelectedBorder: "border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]",
    quizSelectedBg: "bg-orange-950/50",
    progressBar: "bg-gradient-to-r from-orange-500 to-amber-500",
    iconBg: "bg-orange-500/15 border-orange-500/30",
    iconText: "text-orange-400",
    glowColor: "rgba(234,88,12,0.2)",
    primaryColor: "#ea580c",
    secondaryColor: "#f97316",
    lightBadgeBg: "bg-orange-50",
    lightBadgeText: "text-orange-700",
    lightBadgeBorder: "border-orange-200",
  },
  purple: {
    name: "Cyber Purple",
    primaryHex: "#a855f7",
    badgeBg: "bg-purple-950/60",
    badgeText: "text-purple-300",
    badgeBorder: "border-purple-500/40",
    gradientText: "from-purple-400 via-fuchsia-300 to-indigo-300",
    ctaBg: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600",
    ctaHover: "hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500",
    ctaGlow: "shadow-[0_0_35px_rgba(168,85,247,0.45)]",
    cardBorderHover: "hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]",
    neonGlow: "rgba(168,85,247,0.3)",
    quizSelectedBorder: "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]",
    quizSelectedBg: "bg-purple-950/40",
    progressBar: "bg-gradient-to-r from-purple-500 to-fuchsia-500",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconText: "text-purple-400",
    glowColor: "rgba(168,85,247,0.2)",
    primaryColor: "#a855f7",
    secondaryColor: "#c084fc",
    lightBadgeBg: "bg-purple-50",
    lightBadgeText: "text-purple-700",
    lightBadgeBorder: "border-purple-200",
  },
  emerald: {
    name: "Emerald Green",
    primaryHex: "#10b981",
    badgeBg: "bg-emerald-950/60",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/40",
    gradientText: "from-emerald-400 via-teal-300 to-cyan-300",
    ctaBg: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500",
    ctaHover: "hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-400",
    ctaGlow: "shadow-[0_0_35px_rgba(16,185,129,0.45)]",
    cardBorderHover: "hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
    neonGlow: "rgba(16,185,129,0.3)",
    quizSelectedBorder: "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    quizSelectedBg: "bg-emerald-950/40",
    progressBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconText: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.2)",
    primaryColor: "#10b981",
    secondaryColor: "#34d399",
    lightBadgeBg: "bg-emerald-50",
    lightBadgeText: "text-emerald-700",
    lightBadgeBorder: "border-emerald-200",
  },
  cyan: {
    name: "Electric Cyan",
    primaryHex: "#06b6d4",
    badgeBg: "bg-cyan-950/60",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-500/40",
    gradientText: "from-cyan-400 via-sky-300 to-blue-400",
    ctaBg: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600",
    ctaHover: "hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500",
    ctaGlow: "shadow-[0_0_35px_rgba(6,182,212,0.45)]",
    cardBorderHover: "hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]",
    neonGlow: "rgba(6,182,212,0.3)",
    quizSelectedBorder: "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.35)]",
    quizSelectedBg: "bg-cyan-950/40",
    progressBar: "bg-gradient-to-r from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconText: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.2)",
    primaryColor: "#06b6d4",
    secondaryColor: "#38bdf8",
    lightBadgeBg: "bg-cyan-50",
    lightBadgeText: "text-cyan-700",
    lightBadgeBorder: "border-cyan-200",
  },
  amber: {
    name: "Sunset Amber",
    primaryHex: "#f59e0b",
    badgeBg: "bg-amber-950/60",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/40",
    gradientText: "from-amber-400 via-yellow-300 to-orange-400",
    ctaBg: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600",
    ctaHover: "hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500",
    ctaGlow: "shadow-[0_0_35px_rgba(245,158,11,0.45)]",
    cardBorderHover: "hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
    neonGlow: "rgba(245,158,11,0.3)",
    quizSelectedBorder: "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    quizSelectedBg: "bg-amber-950/40",
    progressBar: "bg-gradient-to-r from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconText: "text-amber-400",
    glowColor: "rgba(245,158,11,0.2)",
    primaryColor: "#f59e0b",
    secondaryColor: "#fbbf24",
    lightBadgeBg: "bg-amber-50",
    lightBadgeText: "text-amber-700",
    lightBadgeBorder: "border-amber-200",
  },
  rose: {
    name: "Rosa Crimson",
    primaryHex: "#f43f5e",
    badgeBg: "bg-rose-950/60",
    badgeText: "text-rose-300",
    badgeBorder: "border-rose-500/40",
    gradientText: "from-rose-400 via-pink-300 to-orange-300",
    ctaBg: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600",
    ctaHover: "hover:from-rose-500 hover:via-pink-500 hover:to-red-500",
    ctaGlow: "shadow-[0_0_35px_rgba(244,63,94,0.45)]",
    cardBorderHover: "hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]",
    neonGlow: "rgba(244,63,94,0.3)",
    quizSelectedBorder: "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]",
    quizSelectedBg: "bg-rose-950/40",
    progressBar: "bg-gradient-to-r from-rose-500 to-pink-500",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconText: "text-rose-400",
    glowColor: "rgba(244,63,94,0.2)",
    primaryColor: "#f43f5e",
    secondaryColor: "#fb7185",
    lightBadgeBg: "bg-rose-50",
    lightBadgeText: "text-rose-700",
    lightBadgeBorder: "border-rose-200",
  },
  blue: {
    name: "Azul Royal",
    primaryHex: "#2563eb",
    badgeBg: "bg-blue-950/60",
    badgeText: "text-blue-300",
    badgeBorder: "border-blue-500/40",
    gradientText: "from-blue-400 via-sky-300 to-indigo-400",
    ctaBg: "bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600",
    ctaHover: "hover:from-blue-500 hover:via-sky-400 hover:to-indigo-500",
    ctaGlow: "shadow-[0_0_35px_rgba(37,99,235,0.45)]",
    cardBorderHover: "hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(37,99,235,0.2)]",
    neonGlow: "rgba(37,99,235,0.3)",
    quizSelectedBorder: "border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.35)]",
    quizSelectedBg: "bg-blue-950/40",
    progressBar: "bg-gradient-to-r from-blue-500 to-indigo-500",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconText: "text-blue-400",
    glowColor: "rgba(37,99,235,0.2)",
    primaryColor: "#2563eb",
    secondaryColor: "#60a5fa",
    lightBadgeBg: "bg-blue-50",
    lightBadgeText: "text-blue-700",
    lightBadgeBorder: "border-blue-200",
  },
  indigo: {
    name: "Índigo Profundo",
    primaryHex: "#4f46e5",
    badgeBg: "bg-indigo-950/60",
    badgeText: "text-indigo-300",
    badgeBorder: "border-indigo-500/40",
    gradientText: "from-indigo-400 via-purple-300 to-pink-300",
    ctaBg: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
    ctaHover: "hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500",
    ctaGlow: "shadow-[0_0_35px_rgba(79,70,229,0.45)]",
    cardBorderHover: "hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(79,70,229,0.2)]",
    neonGlow: "rgba(79,70,229,0.3)",
    quizSelectedBorder: "border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.35)]",
    quizSelectedBg: "bg-indigo-950/40",
    progressBar: "bg-gradient-to-r from-indigo-500 to-purple-500",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconText: "text-indigo-400",
    glowColor: "rgba(79,70,229,0.2)",
    primaryColor: "#4f46e5",
    secondaryColor: "#818cf8",
    lightBadgeBg: "bg-indigo-50",
    lightBadgeText: "text-indigo-700",
    lightBadgeBorder: "border-indigo-200",
  },
  red: {
    name: "Vermelho Fogo",
    primaryHex: "#dc2626",
    badgeBg: "bg-red-950/60",
    badgeText: "text-red-300",
    badgeBorder: "border-red-500/40",
    gradientText: "from-red-400 via-orange-300 to-rose-400",
    ctaBg: "bg-gradient-to-r from-red-600 via-orange-600 to-rose-600",
    ctaHover: "hover:from-red-500 hover:via-orange-500 hover:to-rose-500",
    ctaGlow: "shadow-[0_0_35px_rgba(220,38,38,0.45)]",
    cardBorderHover: "hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(220,38,38,0.2)]",
    neonGlow: "rgba(220,38,38,0.3)",
    quizSelectedBorder: "border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)]",
    quizSelectedBg: "bg-red-950/40",
    progressBar: "bg-gradient-to-r from-red-500 to-orange-500",
    iconBg: "bg-red-500/10 border-red-500/20",
    iconText: "text-red-400",
    glowColor: "rgba(220,38,38,0.2)",
    primaryColor: "#dc2626",
    secondaryColor: "#f87171",
    lightBadgeBg: "bg-red-50",
    lightBadgeText: "text-red-700",
    lightBadgeBorder: "border-red-200",
  },
  teal: {
    name: "Verde Água",
    primaryHex: "#0d9488",
    badgeBg: "bg-teal-950/60",
    badgeText: "text-teal-300",
    badgeBorder: "border-teal-500/40",
    gradientText: "from-teal-400 via-cyan-300 to-emerald-300",
    ctaBg: "bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600",
    ctaHover: "hover:from-teal-500 hover:via-cyan-500 hover:to-emerald-500",
    ctaGlow: "shadow-[0_0_35px_rgba(13,148,136,0.45)]",
    cardBorderHover: "hover:border-teal-500/50 hover:shadow-[0_0_25px_rgba(13,148,136,0.2)]",
    neonGlow: "rgba(13,148,136,0.3)",
    quizSelectedBorder: "border-teal-500 shadow-[0_0_20px_rgba(13,148,136,0.35)]",
    quizSelectedBg: "bg-teal-950/40",
    progressBar: "bg-gradient-to-r from-teal-500 to-cyan-500",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconText: "text-teal-400",
    glowColor: "rgba(13,148,136,0.2)",
    primaryColor: "#0d9488",
    secondaryColor: "#2dd4bf",
    lightBadgeBg: "bg-teal-50",
    lightBadgeText: "text-teal-700",
    lightBadgeBorder: "border-teal-200",
  },
  gray: {
    name: "Grafite",
    primaryHex: "#4b5563",
    badgeBg: "bg-zinc-800",
    badgeText: "text-zinc-200",
    badgeBorder: "border-zinc-700/60",
    gradientText: "from-zinc-400 via-zinc-200 to-zinc-500",
    ctaBg: "bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-850",
    ctaHover: "hover:from-zinc-600 hover:via-zinc-500 hover:to-zinc-700",
    ctaGlow: "shadow-[0_0_35px_rgba(75,85,99,0.35)]",
    cardBorderHover: "hover:border-zinc-500/50 hover:shadow-[0_0_25px_rgba(75,85,99,0.15)]",
    neonGlow: "rgba(75,85,99,0.2)",
    quizSelectedBorder: "border-zinc-400 shadow-[0_0_20px_rgba(75,85,99,0.25)]",
    quizSelectedBg: "bg-zinc-800/50",
    progressBar: "bg-gradient-to-r from-zinc-500 to-zinc-600",
    iconBg: "bg-zinc-800 border-zinc-700/50",
    iconText: "text-zinc-300",
    glowColor: "rgba(75,85,99,0.15)",
    primaryColor: "#4b5563",
    secondaryColor: "#9ca3af",
    lightBadgeBg: "bg-zinc-100",
    lightBadgeText: "text-zinc-700",
    lightBadgeBorder: "border-zinc-300",
  },
};

export function getShadedColor(baseHex: string, shade?: "light" | "normal" | "dark"): string {
  if (!shade || shade === "normal") return baseHex;
  try {
    let r = parseInt(baseHex.slice(1, 3), 16);
    let g = parseInt(baseHex.slice(3, 5), 16);
    let b = parseInt(baseHex.slice(5, 7), 16);
    
    if (shade === "light") {
      r = Math.min(255, Math.round(r + (255 - r) * 0.45));
      g = Math.min(255, Math.round(g + (255 - g) * 0.45));
      b = Math.min(255, Math.round(b + (255 - b) * 0.45));
    } else if (shade === "dark") {
      r = Math.max(0, Math.round(r * 0.55));
      g = Math.max(0, Math.round(g * 0.55));
      b = Math.max(0, Math.round(b * 0.55));
    }
    const toHex = (num: number) => {
      const hex = num.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (e) {
    return baseHex;
  }
}

export function getRadiusClass(radius?: string): string {
  switch (radius) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-lg";
    case "md":
      return "rounded-xl";
    case "lg":
      return "rounded-2xl";
    case "xl":
      return "rounded-3xl";
    case "2xl":
      return "rounded-[2rem]";
    case "3xl":
      return "rounded-[2.5rem]";
    case "full":
      return "rounded-[3rem]";
    default:
      return "rounded-3xl";
  }
}

