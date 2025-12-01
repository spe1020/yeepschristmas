import { cn } from '@/lib/utils';
import { Lock, Check, Star } from 'lucide-react';
import { useState } from 'react';
import { LockedTileParticles } from '@/components/LockedTileParticles';
import { useCompletedDays } from '@/hooks/useCompletedDays';

export type TileState = 'locked' | 'today' | 'opened';

interface YeepsCalendarTileProps {
  day: number;
  state: TileState;
  onClick: () => void;
}

export function YeepsCalendarTile({ day, state, onClick }: YeepsCalendarTileProps) {
  const isClickable = state !== 'locked';
  const [isHovered, setIsHovered] = useState(false);
  const { isDayCompleted } = useCompletedDays();
  const isCompleted = isDayCompleted(day);

  // Base styles for all tiles - soft, rounded, plush feel
  const base = cn(
    "relative aspect-square rounded-2xl border-2 transition-all duration-300",
    "flex flex-col items-center justify-center gap-2"
  );

  // Determine if day is even (green) or odd (red) for Christmas alternating colors
  const isEvenDay = day % 2 === 0;
  
  // State-specific styling with Christmas theme - alternating red and green
  const stylesByState = cn(
    state === 'locked' && [
      "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
      "border-gray-400 dark:border-gray-600",
      "cursor-not-allowed opacity-50",
      "backdrop-blur-[2px]",
      "brightness-75",
      // Hover glow for locked tiles with Christmas colors
      "hover:opacity-70 hover:brightness-90",
      isEvenDay 
        ? "hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/20 hover:ring-2 hover:ring-green-400/30"
        : "hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20 hover:ring-2 hover:ring-red-400/30",
    ],
    state === 'today' && [
      isEvenDay
        ? "bg-gradient-to-br from-green-500 to-emerald-600"
        : "bg-gradient-to-br from-red-500 to-rose-600",
      "border-yellow-300 dark:border-yellow-400",
      "shadow-lg",
      "ring-2 ring-yellow-200 dark:ring-yellow-700 ring-opacity-60",
      "shadow-yellow-200/50 dark:shadow-yellow-900/50",
      "cursor-pointer",
    ],
    state === 'opened' && [
      isEvenDay
        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-300 dark:border-green-400"
        : "bg-gradient-to-br from-red-500 to-rose-600 border-red-300 dark:border-red-400",
      "shadow-md",
      "cursor-pointer",
    ]
  );

  // Hover effects (only for today & opened) - Christmas colors
  const hover = state === 'locked' 
    ? "" 
    : isEvenDay
      ? "hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40"
      : "hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40";

  // Click/press feedback (only for today & opened)
  const active = state === 'locked' 
    ? "" 
    : "active:scale-95 active:brightness-110";

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(base, stylesByState, hover, active)}
    >
      {/* Day Number */}
      <span className={cn(
        "text-3xl font-bold drop-shadow-md",
        state === 'locked' 
          ? "text-gray-500 dark:text-gray-400" 
          : "text-white"
      )}>
        {day}
      </span>

      {/* State-specific icon */}
      <div className="absolute bottom-2 right-2">
        {state === 'locked' && (
          <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
        {isCompleted && (
          <div className="relative">
            <Check className="w-5 h-5 text-white/90 bg-green-500 rounded-full p-0.5 animate-pulse" />
            <Star className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '2s' }} />
          </div>
        )}
        {state === 'opened' && !isCompleted && (
          <Check className="w-5 h-5 text-white/90 bg-green-500 rounded-full p-0.5" />
        )}
      </div>

      {/* Shimmer effect for today and opened tiles */}
      {state !== 'locked' && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
            state === 'today' && "animate-shimmer"
          )} />
        </div>
      )}

      {/* Soft particles for locked tiles on hover */}
      {state === 'locked' && <LockedTileParticles isHovered={isHovered} />}
    </button>
  );
}
