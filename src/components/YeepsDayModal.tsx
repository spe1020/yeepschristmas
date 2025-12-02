import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Flame, Film, CheckCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCompletedDays } from '@/hooks/useCompletedDays';
import { Button } from '@/components/ui/button';
import { useBadges } from '@/hooks/useBadges';
import { useStreak } from '@/hooks/useStreak';
import { useAvatar } from '@/hooks/useAvatar';
import { useToast } from '@/hooks/useToast';
import { getAssetUrl } from '@/lib/utils';
import { DragonAnimation } from '@/components/DragonAnimation';

// Temporary interface for backward compatibility with existing data structure
// Will be replaced with full DayContent types from dayContentTypes.ts when content is ready
export interface DayContent {
  day: number;
  unlockDate: string;
  title: string;
  // Content section - Yeeps lore, story, or information
  learn: string;
  // Optional additional content sections
  culture?: {
    country: string;
    tradition: string;
    description: string;
  };
  funFact?: string;
  movie?: {
    title: string;
    year?: number;
    description: string;
  };
  // Video content - path to video file in public/videos/ folder
  video?: {
    src: string; // Path relative to public folder, e.g., "/videos/day1.mp4"
    poster?: string; // Optional thumbnail image path
    title?: string; // Optional video title
    description?: string; // Optional video description
  };
  // Discord link - link to Discord server
  discordLink?: {
    url: string; // Discord invite URL
    title?: string; // Optional button title
    description?: string; // Optional description text
  };
}

interface YeepsDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayContent: DayContent | null;
  onDayCompleted?: () => void;
}

export function YeepsDayModal({ isOpen, onClose, dayContent, onDayCompleted }: YeepsDayModalProps) {
  const { isDayCompleted, markDayAsCompleted } = useCompletedDays();
  const { hasBadge, earnBadge } = useBadges();
  const { currentStreak, updateStreak } = useStreak();
  const { avatar } = useAvatar();
  const { toast } = useToast();
  
  // Local state to force immediate UI update
  const [localCompleted, setLocalCompleted] = useState(false);
  const [localHasBadge, setLocalHasBadge] = useState(false);

  // Sync with hook state when modal opens or day changes
  useEffect(() => {
    if (dayContent) {
      const completed = isDayCompleted(dayContent.day);
      const hasBadgeForDay = hasBadge(dayContent.day);
      setLocalCompleted(completed);
      setLocalHasBadge(hasBadgeForDay);
    }
  }, [dayContent, isDayCompleted, hasBadge, isOpen]);

  if (!dayContent) return null;

  // Use local state for immediate UI feedback, fallback to hook state
  const isCompleted = localCompleted || isDayCompleted(dayContent.day);
  const hasEarnedBadge = localHasBadge || hasBadge(dayContent.day);

  const handleQuizComplete = () => {
    if (!isCompleted) {
      // Update local state immediately for instant UI feedback
      setLocalCompleted(true);
      setLocalHasBadge(true);
      
      // Update persistent state
      markDayAsCompleted(dayContent.day);
      
      // Update streak
      const streakResult = updateStreak(dayContent.unlockDate);
      
      // Earn badge with emoji based on day - Yeeps themed
      // Special dragon badge for day 3 (Dragon Fest!)
      let emoji: string;
      let badgeTitle: string;
      
      if (dayContent.day === 3) {
        emoji = '🐉';
        badgeTitle = 'Dragon Fest Champion! 🐉';
      } else {
        const badgeEmojis = ['🟦', '🟫', '🟩', '🟨', '🟧', '🟪', '💎', '🗺️', '🛠️', '🌀', '⚔️', '🏰', '🎮', '🎨', '🎭', '🎯', '🎲', '🎸', '🎺', '🎻', '🥁', '🎤', '🎬', '🚀'];
        emoji = badgeEmojis[(dayContent.day - 1) % badgeEmojis.length];
        badgeTitle = `Day ${dayContent.day} Complete!`;
      }
      
      earnBadge(dayContent.day, badgeTitle, emoji);
      
      // Enhanced toast with streak information
      const streakMessage = streakResult.newStreak > 1
        ? ` You're on a ${streakResult.newStreak}-day streak! 🔥`
        : streakResult.newStreak === 1
        ? ' You started a new streak! 🔥'
        : '';
      
      toast({
        title: '🎉 Congratulations!',
        description: `You earned a badge for completing Day ${dayContent.day}!${streakMessage}`,
      });
      
      // Notify parent component to refresh
      if (onDayCompleted) {
        // Use setTimeout to ensure state updates are flushed
        setTimeout(() => {
          onDayCompleted();
        }, 0);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yeep-primary to-yeep-secondary bg-clip-text text-transparent">
            {dayContent.title}
          </DialogTitle>
          <DialogDescription className="text-base flex items-center gap-2 flex-wrap">
            <span>
              Day {dayContent.day} • {new Date(dayContent.unlockDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{avatar}</span>
              {currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yeep-secondary to-yeep-primary text-white shadow-sm">
                  <Flame className="w-3 h-3" />
                  Streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 w-full min-w-0">
          {/* Dragon Fest Animation for Day 3 */}
          {dayContent.day === 3 && (
            <Card className="overflow-hidden w-full border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardHeader className="pb-3 bg-gradient-to-r from-orange-500/20 to-red-500/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">🐉</span>
                  <span>We are celebrating Dragon Fest on Yeeps! 🐉</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-b from-sky-100 to-purple-100 dark:from-sky-900/30 dark:to-purple-900/30">
                  <DragonAnimation className="w-full h-full" />
                </div>
                <p className="text-center mt-4 text-lg font-semibold text-orange-700 dark:text-orange-300">
                  🎉 Happy Dragon Fest! 🎉
                </p>
              </CardContent>
            </Card>
          )}

          {/* Learn Section */}
          <Card className="overflow-hidden w-full border-2 border-yeep-primary/50">
            <CardHeader className="pb-3 bg-gradient-to-r from-yeep-primary/20 to-yeep-secondary/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🎄</span>
                Yeeps Christmas Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                {dayContent.learn}
              </p>
            </CardContent>
          </Card>

          {/* Video Section */}
          {dayContent.video && (
            <Card className="overflow-hidden w-full border-2 border-yeep-secondary/50">
              <CardHeader className="pb-3 bg-gradient-to-r from-yeep-secondary/20 to-yeep-rare/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">🎥</span>
                  <span>{dayContent.video.title || 'Video'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="w-full rounded-lg overflow-hidden bg-black">
                  <video
                    controls
                    className="w-full h-auto max-h-[500px]"
                    poster={dayContent.video.poster ? getAssetUrl(dayContent.video.poster) : undefined}
                    preload="metadata"
                  >
                    {(() => {
                      const videoSrc = getAssetUrl(dayContent.video.src);
                      return (
                        <>
                          <source src={videoSrc} type="video/mp4" />
                          <source src={videoSrc} type="video/quicktime" />
                          <source src={videoSrc} type="video/webm" />
                          <source src={videoSrc} type="video/ogg" />
                        </>
                      );
                    })()}
                    Your browser does not support the video tag.
                  </video>
                </div>
                {dayContent.video.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {dayContent.video.description}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Culture Section */}
          {dayContent.culture && (
            <Card className="overflow-hidden w-full border-2 border-yeep-secondary/50">
              <CardHeader className="pb-3 bg-gradient-to-r from-yeep-secondary/20 to-yeep-rare/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-yeep-secondary" />
                  <span>Yeeps World</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌍</span>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {dayContent.culture.country}
                    </h3>
                  </div>
                  <div className="pl-7 space-y-2">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {dayContent.culture.tradition}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {dayContent.culture.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movie of the Day Section */}
          {dayContent.movie && (
            <Card className="overflow-hidden w-full border-2 border-yeep-primary/50">
              <CardHeader className="pb-3 bg-gradient-to-r from-yeep-primary/20 to-yeep-secondary/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Film className="w-5 h-5 text-yeep-primary" />
                  <span>🎬 Feature of the Day</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎥</span>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {dayContent.movie.title}
                      {dayContent.movie.year && (
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                          ({dayContent.movie.year})
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
                    {dayContent.movie.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discord Link Section */}
          {dayContent.discordLink && (
            <Card className="overflow-hidden w-full border-2 border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <CardHeader className="pb-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                  <span>Join the Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {dayContent.discordLink.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {dayContent.discordLink.description}
                  </p>
                )}
                <a
                  href={dayContent.discordLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {dayContent.discordLink.title || 'Join Discord Server'}
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* Mark as Complete Button - Only show if not completed */}
          {!isCompleted && (
            <Card className="overflow-hidden w-full border-2 border-yeep-primary/50">
              <CardContent className="pt-6 pb-6">
                <Button
                  onClick={handleQuizComplete}
                  className="w-full bg-gradient-to-r from-yeep-primary to-yeep-secondary hover:opacity-90 text-white"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark Day as Complete
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Completion Badge Display */}
          {isCompleted && (
            <Card className="overflow-hidden w-full border-2 border-yeep-primary bg-gradient-to-br from-yeep-primary/20 to-yeep-secondary/20">
              <CardContent className="pt-6 pb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-6xl">{avatar}</span>
                  <div className="text-6xl animate-bounce">
                    {hasEarnedBadge ? '🏆' : '✅'}
                  </div>
                </div>
                <p className="text-lg font-semibold text-yeep-primary">
                  Day {dayContent.day} Completed!
                </p>
                <p className="text-sm text-yeep-secondary mt-1">
                  Great job exploring Yeeps Christmas, {avatar}! 🎉
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
