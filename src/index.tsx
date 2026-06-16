import { Platform, Dimensions, AppState } from 'react-native';
import { useEffect, useRef, useState } from 'react';
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
      navigationBarHeight: 0, // iOS doesn't have a navigation bar like Android
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
 * Get the navigation bar height in dp
 * @returns Promise<number> - navigation bar height in dp
 */
export function getNavigationBarHeight(): Promise<number> {
  // null check is redundant as it's always null for iOS but it's there to satisfy TypeScript
  if (Platform.OS === 'ios' || NavigationModeModule === null) {
    // iOS doesn't have a navigation bar like Android
    return Promise.resolve(0);
  }

  // Only call native module on Android
  return NavigationModeModule.getNavigationBarHeight();
}

/**
 * Hook for React components to get navigation mode.
 *
 * Re-fetches automatically when:
 *  - the device rotates / the window is resized (the navigation bar height
 *    differs between portrait and landscape, and on phones the 3-/2-button bar
 *    even moves to a different edge), and
 *  - the app returns to the foreground (the user may switch the system
 *    navigation mode in Settings while the app is backgrounded).
 */
export function useNavigationMode() {
  const [navigationMode, setNavigationMode] =
    useState<NavigationModeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Tracks whether the hook is still mounted so async resolves that land after
  // unmount (or after a superseding re-fetch) don't call setState.
  const mountedRef = useRef(true);
  // Latest-wins guard: rotation can fire several events in quick succession, so
  // ignore the result of any fetch that has been superseded by a newer one.
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    // Note: we intentionally do NOT set `loading` back to true on re-fetch.
    // `loading` reflects the initial load only; flipping it on every rotation
    // would flash consumer UIs (spinners) on each orientation change.
    async function fetchNavigationMode() {
      const requestId = ++requestIdRef.current;
      try {
        const mode = await getNavigationMode();
        if (mountedRef.current && requestId === requestIdRef.current) {
          setNavigationMode(mode);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current && requestId === requestIdRef.current) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    // Initial fetch.
    fetchNavigationMode();

    // Re-fetch on orientation / window-size change (rotation).
    const dimensionsSub = Dimensions.addEventListener('change', () => {
      fetchNavigationMode();
    });

    // Re-fetch when the app returns to the foreground.
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        fetchNavigationMode();
      }
    });

    return () => {
      mountedRef.current = false;
      // RN 0.79+: addEventListener returns an EventSubscription with .remove().
      // Always wrap in an arrow (do not return the bare `.remove` reference) to
      // avoid the lost-`this` crash in facebook/react-native#34508.
      dimensionsSub.remove();
      appStateSub.remove();
    };
  }, []);

  return { navigationMode, loading, error };
}

export default {
  getNavigationMode,
  isGestureNavigation,
  getNavigationBarHeight,
  useNavigationMode,
} as const;
