// components/level-badge.tsx
import React from 'react';
import { Award, ShieldCheck, Star, Gem } from 'lucide-react'; // Ícones
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number | null | undefined;
  size?: 'sm' | 'md'; 
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'sm' }) => {
  const currentLevel = level ?? 1;

  const getBadgeStyle = (lvl: number) => {
    if (lvl >= 10) return { Icon: Gem, color: "text-purple-500 dark:text-purple-400", label: "Explorador Diamante" };
    if (lvl >= 7) return { Icon: Star, color: "text-yellow-500 dark:text-yellow-400", label: "Explorador Ouro" };
    if (lvl >= 4) return { Icon: ShieldCheck, color: "text-gray-500 dark:text-gray-400", label: "Explorador Prata" };
    return { Icon: Award, color: "text-orange-600 dark:text-orange-400", label: "Explorador Bronze" }; // Níveis 1-3
  };

  const { Icon, color, label } = getBadgeStyle(currentLevel);
  const iconSizeClass = size === 'sm' ? "h-4 w-4" : "h-5 w-5";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Span para tooltip funcionar corretamente e aplicar cor */}
          <span className={cn("inline-flex items-center", color, "cursor-default")} aria-label={`Nível ${currentLevel} - ${label}`}>
            <Icon className={cn(iconSizeClass)} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p className="font-semibold">Nível {currentLevel} ({label})</p>
          <p className="text-muted-foreground">Crie ou grave rotas para subir de nível!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelBadge;