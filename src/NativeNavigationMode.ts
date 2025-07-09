import type { TurboModule } from 'react-native';
import { TurboModuleRegistry, Platform } from 'react-native';

export interface NavigationModeInfo {
  type: '3_button' | '2_button' | 'gesture' | 'unknown';
  isGestureNavigation: boolean;
  interactionMode?: number;
}

export interface Spec extends TurboModule {
  getNavigationMode(): Promise<NavigationModeInfo>;
  isGestureNavigation(): Promise<boolean>;
}

// Only get the native module on Android
// On iOS, we'll handle everything in JavaScript
const NativeModule =
  Platform.OS === 'android'
    ? TurboModuleRegistry.getEnforcing<Spec>('NavigationMode')
    : null;

export default NativeModule;
