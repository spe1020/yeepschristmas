/**
 * Day Content Types for Yeeps Advent Calendar
 * Defines the different types of content that can be unlocked each day
 */

export type DayContentType =
  | 'welcome'           // Welcome message / introduction
  | 'lore'              // Story/lore about Yeeps world
  | 'wallpaper'         // Downloadable wallpaper/image
  | 'code'              // Special code or password
  | 'mapInvite'         // Invitation to a map/world
  | 'eventInvite'       // Invitation to an event
  | 'fanArtShowcase'    // Showcase of fan art
  | 'badge'             // Unlockable badge
  | 'miniGameLink';     // Link to a mini-game

/**
 * Base structure for all day content types
 */
export interface BaseDayContent {
  day: number;
  unlockDate: string;
  title: string;
  type: DayContentType;
}

/**
 * Welcome content - First day introduction
 */
export interface WelcomeContent extends BaseDayContent {
  type: 'welcome';
  message: string;
  imageUrl?: string;
}

/**
 * Lore content - Story about Yeeps world
 */
export interface LoreContent extends BaseDayContent {
  type: 'lore';
  story: string;
  imageUrl?: string;
  character?: string;
}

/**
 * Wallpaper content - Downloadable image
 */
export interface WallpaperContent extends BaseDayContent {
  type: 'wallpaper';
  imageUrl: string;
  downloadUrl: string;
  description?: string;
}

/**
 * Code content - Special code or password
 */
export interface CodeContent extends BaseDayContent {
  type: 'code';
  code: string;
  description: string;
  redeemUrl?: string;
}

/**
 * Map Invite content - Invitation to a map/world
 */
export interface MapInviteContent extends BaseDayContent {
  type: 'mapInvite';
  mapName: string;
  mapUrl: string;
  description: string;
  imageUrl?: string;
}

/**
 * Event Invite content - Invitation to an event
 */
export interface EventInviteContent extends BaseDayContent {
  type: 'eventInvite';
  eventName: string;
  eventDate: string;
  eventTime?: string;
  eventUrl?: string;
  description: string;
}

/**
 * Fan Art Showcase content
 */
export interface FanArtShowcaseContent extends BaseDayContent {
  type: 'fanArtShowcase';
  artistName?: string;
  imageUrl: string;
  description: string;
  artistLink?: string;
}

/**
 * Badge content - Unlockable badge
 */
export interface BadgeContent extends BaseDayContent {
  type: 'badge';
  badgeName: string;
  badgeEmoji: string;
  description: string;
}

/**
 * Mini Game Link content
 */
export interface MiniGameLinkContent extends BaseDayContent {
  type: 'miniGameLink';
  gameName: string;
  gameUrl: string;
  description: string;
  imageUrl?: string;
}

/**
 * Union type for all possible day content
 */
export type DayContent =
  | WelcomeContent
  | LoreContent
  | WallpaperContent
  | CodeContent
  | MapInviteContent
  | EventInviteContent
  | FanArtShowcaseContent
  | BadgeContent
  | MiniGameLinkContent;

