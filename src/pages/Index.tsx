import { useSeoMeta } from '@unhead/react';
import { useState, useEffect, useRef } from 'react';
import { YeepsCalendarTile, type TileState } from '@/components/YeepsCalendarTile';
import { YeepsDayModal, DayContent } from '@/components/YeepsDayModal';
import { useToast } from '@/hooks/useToast';
import { useOpenedDays } from '@/hooks/useOpenedDays';
import { useCompletedDays } from '@/hooks/useCompletedDays';
import { Calendar, Trophy, User, Award, Menu, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { YeepsProgressBar } from '@/components/YeepsProgressBar';
import { AvatarSelector } from '@/components/AvatarSelector';
import { useAvatar } from '@/hooks/useAvatar';
import { Button } from '@/components/ui/button';
import { isDayUnlocked } from '@/config/calendar';
import { Snowfall } from '@/components/Snowfall';

interface YeepsData {
  days: DayContent[];
}

const Index = () => {
  const [yeepsData, setYeepsData] = useState<YeepsData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();
  const { avatar } = useAvatar();
  const { isDayOpened, markDayAsOpened } = useOpenedDays();
  const { isDayCompleted, completedCount } = useCompletedDays();
  
  // Force re-render when a day is completed
  const handleDayCompleted = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Watch for changes in completed days to force re-render
  const prevCompletedCount = useRef(completedCount);
  
  useEffect(() => {
    // Only update if counts actually changed (avoid initial render)
    if (prevCompletedCount.current !== completedCount) {
      prevCompletedCount.current = completedCount;
      setRefreshKey(prev => prev + 1);
    }
  }, [completedCount]);

  useSeoMeta({
    title: 'Yeeps Christmas Advent Calendar 2025',
    description: 'Discover the magic of Yeeps Christmas! Unlock daily Yeeps-themed content, watch videos, and collect badges. A fun 24-day journey with the Yeeps community!',
  });

  // Load Yeeps calendar data
  useEffect(() => {
    // Use BASE_URL to ensure correct path on GitHub Pages
    const dataUrl = `${import.meta.env.BASE_URL}advent-data.json?v=${Date.now()}`;
    fetch(dataUrl) // Cache busting to ensure fresh data
      .then(res => res.json())
      .then(data => setYeepsData(data))
      .catch(err => {
        console.error('Failed to load Yeeps calendar data:', err);
        toast({
          title: 'Error',
          description: 'Failed to load Yeeps calendar data',
          variant: 'destructive',
        });
      });
  }, [toast]);

  // Check if a day is today
  const isToday = (unlockDate: string): boolean => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    now.setHours(0, 0, 0, 0);
    unlock.setHours(0, 0, 0, 0);
    return now.getTime() === unlock.getTime();
  };

  // Calculate tile state using calendar config
  const getTileState = (dayContent: DayContent): TileState => {
    if (!isDayUnlocked(dayContent.day, dayContent.unlockDate)) {
      return 'locked';
    }
    // If completed, show as opened
    if (isDayCompleted(dayContent.day)) {
      return 'opened';
    }
    if (!isDayOpened(dayContent.day)) {
      return 'today';
    }
    // Opened but not completed - treat as "today" for now
    return 'today';
  };

  const handleTileClick = (dayContent: DayContent) => {
    setSelectedDay(dayContent);
    setIsModalOpen(true);
    // Mark day as opened when modal is opened
    markDayAsOpened(dayContent.day);
  };


  if (!yeepsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-300 dark:text-gray-400">Loading Yeeps Christmas calendar...</p>
        </div>
      </div>
    );
  }

  // Check if any days are unlocked for snowfall
  const hasUnlockedDays = yeepsData.days.some(day => isDayUnlocked(day.day, day.unlockDate));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 relative">
      {/* Snowfall Effect */}
      <Snowfall hasUnlockedDays={hasUnlockedDays} />
      
      {/* Header */}
      <header className="border-b border-red-400/30 dark:border-red-700/30 bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Yeeps Logo */}
              <img 
                src="/images/yeeps-logo.png" 
                alt="Yeeps Logo" 
                className="h-8 w-auto sm:h-10 md:h-12 flex-shrink-0"
              />
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent truncate">
                  Christmas Calendar
                </h1>
              </div>
            </div>
            
            {/* Desktop Menu - Only show on large screens (xl and up) */}
            <div className="hidden xl:flex items-center gap-2">
              <Button
                onClick={() => setIsAvatarOpen(true)}
                variant="outline"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                title="Choose your avatar"
                size="sm"
              >
                <span className="text-xl mr-2">{avatar}</span>
                <User className="w-4 h-4" />
              </Button>
              <Link to="/achievements">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                  size="sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  My Achievements 🏅
                </Button>
              </Link>
            </div>

            {/* Mobile Menu - Show on all screens below xl (mobile, tablet, small desktop) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="xl:hidden bg-slate-800/60 border-slate-700 text-white hover:bg-slate-700/60 flex-shrink-0"
                  size="icon"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px] bg-slate-900 border-slate-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Navigate to different sections
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      setIsAvatarOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-auto py-3"
                  >
                    <span className="text-2xl mr-3">{avatar}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Choose Avatar</span>
                      <span className="text-xs opacity-80">Pick your holiday helper</span>
                    </div>
                  </Button>
                  
                  <Link to="/achievements" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 h-auto py-3"
                    >
                      <Award className="w-5 h-5 mr-3" />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">My Achievements</span>
                        <span className="text-xs opacity-80">View your progress</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-4">
          {/* Yeeps Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/images/yeeps-logo.png" 
              alt="Yeeps Logo" 
              className="h-16 w-auto sm:h-20 md:h-24"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-white">
            Yeeps Christmas Magic! 🎄
          </h2>
          <p className="text-xl text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock daily Yeeps-themed Christmas content, watch videos, and collect badges! Each day brings new holiday magic from the Yeeps community.
          </p>
          <p className="text-sm text-red-300 dark:text-red-400 flex items-center justify-center gap-2">
            <span className="text-xl">🎄</span>
            Join the Yeeps community and celebrate Christmas together!
          </p>
          <div className="flex justify-center mt-4">
            <a
              href="https://discord.gg/yeeps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Join Yeeps Discord
              </Button>
            </a>
          </div>
        </div>

        {/* Progress Indicator */}
        <YeepsProgressBar completed={completedCount} total={24} />

        {/* Calendar Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 max-w-6xl mx-auto" key={refreshKey}>
          {yeepsData.days.map((day) => (
            <YeepsCalendarTile
              key={`${day.day}-${isDayCompleted(day.day)}-${refreshKey}`}
              day={day.day}
              state={getTileState(day)}
              onClick={() => handleTileClick(day)}
            />
          ))}
        </div>
      </main>

      {/* Day Content Modal - key forces re-render when completion state changes */}
      <YeepsDayModal
        key={`${selectedDay?.day}-${selectedDay ? isDayCompleted(selectedDay.day) : ''}-${refreshKey}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayContent={selectedDay}
        onDayCompleted={handleDayCompleted}
      />

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
      />
    </div>
  );
};

export default Index;
