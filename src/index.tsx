import { Platform } from 'react-native';
import React from 'react';
import NavigationModeModule, {
  type NavigationModeInfo,
} from './NativeNavigationMode';

export type { NavigationModeInfo };

/**
 * Get detailed navigation mode information
 * Returns navigation type, interaction mode, and device info
 */
export function getNavigationMode(): Promise<NavigationModeInfo> {
  // null check is redundant as it's always null for iOS but it's there to satisfy TypeScript
  if (Platform.OS === 'ios' || NavigationModeModule === null) {
    // iOS always uses gesture navigation (no 3-button navigation exists)
    return Promise.resolve({
      type: 'gesture',
      isGestureNavigation: true,
    });
  }

  // Only call native module on Android
  return NavigationModeModule.getNavigationMode();
}

/**
 * Quick check if the device is using gesture-based navigation
 * @returns Promise<boolean> - true if gesture navigation is active
 */
export function isGestureNavigation(): Promise<boolean> {
  // null check is redundant as it's always null for iOS but it's there to satisfy TypeScript
  if (Platform.OS === 'ios' || NavigationModeModule === null) {
    // iOS always uses gesture navigation
    return Promise.resolve(true);
  }

  // Only call native module on Android
  return NavigationModeModule.isGestureNavigation();
}

/**
 * Hook for React components to get navigation mode
 */
export function useNavigationMode() {
  const [navigationMode, setNavigationMode] =
    React.useState<NavigationModeInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function fetchNavigationMode() {
      try {
        const mode = await getNavigationMode();
        if (mounted) {
          setNavigationMode(mode);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchNavigationMode();

    return () => {
      mounted = false;
    };
  }, []);

  return { navigationMode, loading, error };
}

export default {
  getNavigationMode,
  isGestureNavigation,
  useNavigationMode,
} as const;
