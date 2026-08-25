import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DynamicIcon } from "./DynamicIcon";
import { Search, X, Check, Sparkles } from "lucide-react";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIconName?: string;
  onSelectIcon: (iconName: string) => void;
  title?: string;
}

const POPULAR_ICONS = [
  // Conversion & Action
  "Zap", "Sparkles", "Flame", "Target", "TrendingUp", "Award", "Crown", "Trophy", "Rocket", "CheckCircle2", "ShieldCheck", "Lock",
  // Business & Finance
  "DollarSign", "CreditCard", "Wallet", "PiggyBank", "BarChart3", "PieChart", "Briefcase", "Building2", "LineChart", "Percent",
  // Communication & Users
  "Users", "UserCheck", "MessageSquare", "Phone", "Mail", "Send", "Headphones", "Bell", "HeartHandshake", "ThumbsUp",
  // Tech & Speed
  "Cpu", "Laptop", "Smartphone", "Globe", "Cloud", "Server", "Database", "Clock", "Hourglass", "Timer", "Layers", "Compass",
  // Health & Education
  "Heart", "Activity", "Stethoscope", "GraduationCap", "BookOpen", "FileText", "Lightbulb", "Compass", "MapPin", "Gift"
];

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  currentIconName = "Zap",
  onSelectIcon,
  title = "Escolher Ícone",
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredIcons = POPULAR_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-base text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ícone (ex: Shield, Target, Rocket)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Icon Grid */}
          <div className="p-4 overflow-y-auto flex-1 grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {filteredIcons.map((iconName) => {
              const isSelected = currentIconName.toLowerCase() === iconName.toLowerCase();
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onSelectIcon(iconName);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-purple-600/30 border-purple-500 text-purple-300 shadow-md ring-1 ring-purple-500"
                      : "bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white"
                  }`}
                  title={iconName}
                >
                  <DynamicIcon name={iconName} className="w-6 h-6" />
                  <span className="text-[10px] font-medium truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Icon Name entry */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ou digite o nome de qualquer ícone Lucide..."
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  onSelectIcon((e.target as HTMLInputElement).value.trim());
                  onClose();
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input && input.value.trim()) {
                  onSelectIcon(input.value.trim());
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
