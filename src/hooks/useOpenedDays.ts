import { useLocalStorage } from './useLocalStorage';

/**
 * Hook to track which Yeeps calendar days have been opened/viewed
 */
export function useOpenedDays() {
  const [openedDays, setOpenedDays] = useLocalStorage<number[]>(
    'yeeps:calendar:opened-days',
    []
  );

  const markDayAsOpened = (day: number) => {
    setOpenedDays((prev) => {
      if (!prev.includes(day)) {
        return [...prev, day].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const isDayOpened = (day: number): boolean => {
    return openedDays.includes(day);
  };

  return {
    openedDays,
    markDayAsOpened,
    isDayOpened,
  };
}

