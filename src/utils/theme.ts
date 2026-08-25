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
  },
  rose: {
    name: "Rose Crimson",
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
  },
};

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

