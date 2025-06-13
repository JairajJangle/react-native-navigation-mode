import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface NavigationModeInfo {
  interactionMode?: number;
  type: '3_button' | '2_button' | 'gesture' | 'unknown';
  isGestureNavigation: boolean;
  hasNavigationBar: boolean;
  sdkVersion: number;
  deviceModel: string;
}

export interface Spec extends TurboModule {
  getNavigationMode(): Promise<NavigationModeInfo>;
  isGestureNavigation(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NavigationMode');
