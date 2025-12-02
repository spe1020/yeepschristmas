/**
 * Calendar Configuration
 * Controls unlock dates and preview mode for development
 */

export const calendarConfig = {
  // Preview mode: Set to true to unlock all days for development/testing
  // Set to false to use actual unlock dates
  previewMode: true,
  
  // Base year for unlock dates
  year: 2025,
  
  // Month (1-12, where 1 = January)
  month: 12,
  
  // Starting day of the month
  startDay: 1,
  
  // Total number of days in the calendar
  totalDays: 24,
} as const;

/**
 * Check if a day should be unlocked based on preview mode and unlock date
 * Uses UTC for date comparisons to ensure consistent unlocking across time zones
 */
export function isDayUnlocked(dayNumber: number, unlockDate: string): boolean {
  // Preview mode: unlock all days
  if (calendarConfig.previewMode) {
    return true;
  }
  
  // Day 1 is always unlocked (available today)
  if (dayNumber === 1) {
    return true;
  }
  
  // Get current UTC date (YYYY-MM-DD format)
  const now = new Date();
  const nowUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));
  const nowDateStr = nowUTC.toISOString().split('T')[0];
  
  // Parse unlock date (assumes YYYY-MM-DD format, already in UTC)
  const unlockDateStr = unlockDate;
  
  // Compare dates: unlock if today's UTC date >= unlock date
  return nowDateStr >= unlockDateStr;
}

/**
 * Generate unlock date for a specific day number
 */
export function getUnlockDate(dayNumber: number): string {
  const date = new Date(
    calendarConfig.year,
    calendarConfig.month - 1, // month is 0-indexed
    calendarConfig.startDay + dayNumber - 1
  );
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

