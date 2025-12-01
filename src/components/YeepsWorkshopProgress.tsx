import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkshopStage {
  id: number;
  name: string;
  emoji: string;
  description: string;
  minDays: number;
  maxDays: number;
}

const WORKSHOP_STAGES: WorkshopStage[] = [
  {
    id: 0,
    name: 'The Quiet Hideout',
    emoji: '🌙',
    description: 'The Yeeps hideout is quiet and dark. The community is getting ready for adventures!',
    minDays: 0,
    maxDays: 1,
  },
  {
    id: 1,
    name: 'Lights Turn On!',
    emoji: '💡',
    description: 'The hideout lights up! The magic of Yeeps is beginning to sparkle.',
    minDays: 2,
    maxDays: 5,
  },
  {
    id: 2,
    name: 'Builders Arrive!',
    emoji: '🛠️',
    description: 'Creative builders have arrived! They\'re busy crafting amazing worlds.',
    minDays: 6,
    maxDays: 9,
  },
  {
    id: 3,
    name: 'Explorers Join!',
    emoji: '🗺️',
    description: 'Adventurous explorers have joined! They\'re ready to discover new worlds.',
    minDays: 10,
    maxDays: 13,
  },
  {
    id: 4,
    name: 'The Portal Opens!',
    emoji: '🌀',
    description: 'A magical portal has opened! It\'s time to explore new dimensions.',
    minDays: 14,
    maxDays: 17,
  },
  {
    id: 5,
    name: 'Treasures Collect!',
    emoji: '💎',
    description: 'The hideout is filling with amazing treasures! The adventure continues!',
    minDays: 18,
    maxDays: 21,
  },
  {
    id: 6,
    name: 'The Grand Quest Begins!',
    emoji: '⚔️',
    description: 'The ultimate quest is starting! All Yeeps are preparing for the big adventure!',
    minDays: 22,
    maxDays: 23,
  },
  {
    id: 7,
    name: 'The Ultimate Adventure!',
    emoji: '🚀',
    description: 'Amazing! You\'ve unlocked the ultimate Yeeps adventure! You completed all 24 days!',
    minDays: 24,
    maxDays: 24,
  },
];

interface YeepsWorkshopProgressProps {
  completedDays: number;
}

export function YeepsWorkshopProgress({ completedDays }: YeepsWorkshopProgressProps) {
  const currentStage = useMemo(() => {
    return WORKSHOP_STAGES.find(
      stage => completedDays >= stage.minDays && completedDays <= stage.maxDays
    ) || WORKSHOP_STAGES[0];
  }, [completedDays]);

  const progressPercentage = Math.min((completedDays / 24) * 100, 100);

  return (
    <Card className="overflow-hidden w-full max-w-4xl mx-auto border-2 border-yeep-primary/50 bg-gradient-to-br from-yeep-bg-light to-yeep-primary/10 dark:from-yeep-bg-dark dark:to-yeep-primary/20">
      <CardHeader className="pb-3 bg-gradient-to-r from-yeep-primary/20 to-yeep-secondary/20">
        <CardTitle className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-yeep-primary to-yeep-secondary bg-clip-text text-transparent">
          🟦 Yeeps Adventure Progress 🟦
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="text-center space-y-4">
          {/* Main Stage Visual */}
          <div className="relative">
            <div 
              className="text-8xl md:text-9xl mb-4 transition-all duration-500 ease-out animate-fade-in-scale"
              key={currentStage.id}
            >
              {currentStage.emoji}
            </div>
            
            {/* Stage Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
              {currentStage.name}
            </h3>
            
            {/* Stage Description */}
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in">
              {currentStage.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Adventure Progress:</span>
              <span className="font-semibold text-yeep-primary">
                {completedDays} / 24 days
              </span>
            </div>
            <div className="w-full max-w-md mx-auto h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yeep-primary via-yeep-secondary to-yeep-rare transition-all duration-700 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Next Stage Preview (if not at final stage) */}
          {currentStage.id < WORKSHOP_STAGES.length - 1 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete {currentStage.maxDays + 1} days to unlock: <span className="font-semibold text-yeep-primary">{WORKSHOP_STAGES[currentStage.id + 1].name}</span> {WORKSHOP_STAGES[currentStage.id + 1].emoji}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


