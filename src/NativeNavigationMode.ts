import type { TurboModule } from 'react-native';
import { TurboModuleRegistry, Platform } from 'react-native';

export interface NavigationModeInfo {
  type: '3_button' | '2_button' | 'gesture' | 'unknown';
  isGestureNavigation: boolean;
  interactionMode?: number;
  navigationBarHeight: number;
}

export interface Spec extends TurboModule {
  getNavigationMode(): Promise<NavigationModeInfo>;
  isGestureNavigation(): Promise<boolean>;
  getNavigationBarHeight(): Promise<number>;
}

// Only get the native module on Android
// On iOS, we'll handle everything in JavaScript
const NativeModule =
  Platform.OS === 'android'
    ? TurboModuleRegistry?.getEnforcing
      ? TurboModuleRegistry.getEnforcing<Spec>('NavigationMode')
      : (() => {
        console.error(
          "['react-native-navigation-mode'] TurboModuleRegistry.getEnforcing is not available. Make sure you have enabled the New Architecture (TurboModules) in your project."
        );
        return null;
      })()
    : null;

export default NativeModule;
