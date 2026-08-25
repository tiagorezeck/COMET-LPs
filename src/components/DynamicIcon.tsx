import React from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name?: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name = "Zap",
  className = "w-5 h-5",
  size,
}) => {
  // Normalize name
  const cleanName = name ? name.trim() : "Zap";
  
  // Try direct lookup
  let IconComponent = (LucideIcons as any)[cleanName];

  // Try PascalCase
  if (!IconComponent) {
    const pascalCase = cleanName
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toUpperCase());
    IconComponent = (LucideIcons as any)[pascalCase];
  }

  // Fallback to Zap
  if (!IconComponent) {
    IconComponent = LucideIcons.Zap;
  }

  return <IconComponent className={className} size={size} />;
};
