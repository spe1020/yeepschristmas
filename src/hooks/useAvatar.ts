import { useLocalStorage } from './useLocalStorage';

export type AvatarType = '🟦' | '🟫' | '🟩' | '🟨' | '🟧' | '🟪';

export const AVAILABLE_AVATARS: { emoji: AvatarType; name: string }[] = [
  { emoji: '🟦', name: 'Blue Yeep' },
  { emoji: '🟫', name: 'Brown Yeep' },
  { emoji: '🟩', name: 'Green Yeep' },
  { emoji: '🟨', name: 'Yellow Yeep' },
  { emoji: '🟧', name: 'Orange Yeep' },
  { emoji: '🟪', name: 'Purple Yeep' },
];

/**
 * Hook to manage user's selected avatar
 */
export function useAvatar() {
  const [avatar, setAvatar] = useLocalStorage<AvatarType>(
    'yeeps:calendar:avatar',
    '🟦' // Default avatar
  );

  const selectAvatar = (newAvatar: AvatarType) => {
    setAvatar(newAvatar);
  };

  return {
    avatar,
    selectAvatar,
  };
}


