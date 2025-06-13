import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface NavigationModeInfo {
  type: '3_button' | '2_button' | 'gesture' | 'unknown';
  isGestureNavigation: boolean;
  interactionMode?: number;
}

export interface Spec extends TurboModule {
  getNavigationMode(): Promise<NavigationModeInfo>;
  isGestureNavigation(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NavigationMode');
