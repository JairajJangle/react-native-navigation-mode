# react-native-navigation-mode

🧭 Detect Android navigation mode (3-button, 2-button, or gesture navigation) with native precision using Turbo modules.

[![npm version](https://img.shields.io/npm/v/react-native-navigation-mode)](https://badge.fury.io/js/react-native-navigation-mode) [![License](https://img.shields.io/github/license/JairajJangle/react-native-navigation-mode)](https://github.com/JairajJangle/react-native-navigation-mode/blob/main/LICENSE) [![Workflow Status](https://github.com/JairajJangle/react-native-navigation-mode/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/react-native-navigation-mode/actions/workflows/ci.yml) ![Android](https://img.shields.io/badge/-Android-555555?logo=android&logoColor=3DDC84) ![iOS](https://img.shields.io/badge/-iOS-555555?logo=apple&logoColor=white) [![GitHub issues](https://img.shields.io/github/issues/JairajJangle/react-native-navigation-mode)](https://github.com/JairajJangle/react-native-navigation-mode/issues?q=is%3Aopen+is%3Aissue) ![TS](https://img.shields.io/badge/TypeScript-strict_💪-blue) ![Turbo Module](https://img.shields.io/badge/Turbo%20Module-⚡-orange) ![Expo](https://img.shields.io/badge/Expo-SDK_52+-000020?logo=expo) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-native-navigation-mode)

<table align="center">
  <tr>
    <td align="center"><img src=".github/assets/buttons.png" alt="Visibility Sensor demo" height="600"></td>
    <td align="center"><img src=".github/assets/gesture.png" alt="Visibility Sensor demo" height="600"></td>
  </tr>
</table>
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/3--Button-Navigation-blue?style=for-the-badge" alt="3-Button Navigation" />
        <br />
        <small>Traditional Android navigation</small>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/2--Button-Navigation-green?style=for-the-badge" alt="2-Button Navigation" />
        <br />
        <small>Home + Back buttons</small>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Gesture-Navigation-purple?style=for-the-badge" alt="Gesture Navigation" />
        <br />
        <small>Swipe-based navigation</small>
      </td>
    </tr>
  </table>
</div>

------

## ✨ Key Features

- 🎯 **Direct Native Detection** - No hacky workarounds or dimension-based guessing
- ⚡ **Turbo Module** - Built for React Native New Architecture
- 🔄 **Real-time Detection** - Accurate navigation mode identification
- 📏 **Navigation Bar Height** - Get exact navigation bar height in dp for precise UI calculations
- 📱 **Cross Platform** - Android detection + iOS compatibility
- 🎣 **React Hooks** - Easy integration with `useNavigationMode()`
- 📦 **Zero Dependencies** - Lightweight and performant
- 🛡️ **TypeScript** - Full type safety out of the box
- ↕️ **Edge To Edge Support** - Full support for `react-native-edge-to-edge`
- 📲 **Expo Support** - Works with Expo SDK 52+ managed workflow and development builds

## 🚀 Quick Start

### Installation

#### React Native (Bare Workflow)

Using yarn:

```sh
yarn add react-native-navigation-mode
```

Using npm:

```sh
npm install react-native-navigation-mode
```

> **Note:** Auto-linking should handle setup automatically for all newer RN versions.

#### Expo (Managed Workflow)

```sh
npx expo install react-native-navigation-mode
```

##### Expo Configuration

Add the plugin to your `app.json` or `app.config.ts`:

```json
{
  "expo": {
    "plugins": [
      "react-native-navigation-mode"
    ]
  }
}
```

For bare workflow or custom native code, you'll need to prebuild:

```sh
npx expo prebuild
```

##### Development Builds

Since this library contains native code, it requires a custom development build. You cannot use it with standard Expo Go.

#### Requirements

- **React Native**: 0.77.0+
- **Expo SDK**: 52+ (for managed workflow)
- **Android**: API 21+ (Android 5.0+)
- **iOS**: Any version (returns gesture navigation)
- **New Architecture**: Required (enabled by default in RN 0.77+ and Expo SDK 52+)

---

### Basic Usage

```tsx
import { useNavigationMode } from 'react-native-navigation-mode';

export default function App() {
  const { navigationMode, loading, error } = useNavigationMode();

  if (loading) return (<Text>Detecting navigation mode...</Text>);
  if (error) return (<Text>Error: {error.message}</Text>);

  return (
    <View>
      <Text>Navigation Type: {navigationMode?.type}</Text>
      <Text>Gesture Navigation: {navigationMode?.isGestureNavigation ? 'Yes' : 'No'}</Text>
      <Text>Navigation Bar Height: {navigationMode?.navigationBarHeight}dp</Text>
    </View>
  );
}
```

---

## 🔧 API Reference

### React Hook (Recommended)

#### `useNavigationMode(): { navigationMode, loading, error }`

- Returned property types:

| Property      | Type                           | Description                                                  |
| ------------- | ------------------------------ | ------------------------------------------------------------ |
| navigatioMode | `NavigationModeInfo` or `null` | All properties mentioned in [NavigationModeInfo](#navigationmodeinfo). |
| loading       | `boolean`                      | Indicates if navigation mode info is being fetched.          |
| error         | `Error`                        | Typescript error object containing the cause of the error.   |

The easiest way to detect navigation mode with loading and error states.

```tsx
import { useNavigationMode } from 'react-native-navigation-mode';

function MyComponent() {
  const { navigationMode, loading, error } = useNavigationMode();
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      <Text>Navigation Type: {navigationMode?.type}</Text>
      <Text>Is Gesture: {navigationMode?.isGestureNavigation ? 'Yes' : 'No'}</Text>
      <Text>Bar Height: {navigationMode?.navigationBarHeight}dp</Text>
    </View>
  );
}
```

### Functions

#### `getNavigationMode(): Promise<`[NavigationModeInfo](#navigationmodeinfo)`>`

Returns comprehensive navigation mode information.

```typescript
import { getNavigationMode } from 'react-native-navigation-mode';

const navInfo = await getNavigationMode();
console.log('Navigation type:', navInfo.type); // '3_button', '2_button', 'gesture', or 'unknown'
```

#### `isGestureNavigation(): Promise<boolean>`

Quick check if device is using gesture navigation.

```typescript
import { isGestureNavigation } from 'react-native-navigation-mode';

const isGesture = await isGestureNavigation();
console.log('Gesture navigation:', isGesture); // true/false
```

#### `getNavigationBarHeight(): Promise<number>`

Returns the navigation bar height in density-independent pixels (dp).

```typescript
import { getNavigationBarHeight } from 'react-native-navigation-mode';

const height = await getNavigationBarHeight();
console.log('Navigation bar height:', height); // number (dp)
```

### Types

#### `NavigationModeInfo`

| Property            | Type                                                        | Description                                               |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| type                | `'3_button'` or `'2_button'` or `'gesture'` or  `'unknown'` | 4 possible Android navigation modes that can be detected. |
| isGestureNavigation | `boolean`                                                   | Whether gesture navigation is active.                     |
| interactionMode     | `number` or `undefined`                                     | See [Interaction Mode Values](#interaction-mode-values)     |
| navigationBarHeight | `number` or `undefined`                                     | Navigation bar height in density-independent pixels (dp). |

### Interaction Mode Values

| Android Mode | Type       | Description                                         |
| ------------ | ---------- | --------------------------------------------------- |
| 0            | `3_button` | Traditional Android navigation (Back, Home, Recent) |
| 1            | `2_button` | Two-button navigation (Back, Home)                  |
| 2            | `gesture`  | Full gesture navigation                             |
| -1           | `unknown`  | Could not determine navigation mode                 |

---

## 💡 Usage Examples

### Adaptive UI Layout

```tsx
import { useNavigationMode } from 'react-native-navigation-mode';

export default function AdaptiveUI() {
  const { navigationMode } = useNavigationMode();

  return (
    <View 
      style={{
        // paddingBottom using real navigation bar height
        paddingBottom: navigationMode?.navigationBarHeight || 0,
      }}>
      {/* Your content */}
    </View>
  );
}
```

### Conditional Rendering

```tsx
import { useNavigationMode } from 'react-native-navigation-mode';

export default function ConditionalUI() {
  const { navigationMode } = useNavigationMode();

  return (
    <View>
      {navigationMode?.isGestureNavigation && (
        <Text>Swipe gestures are available!</Text>
      )}
      
      {navigationMode?.type === '3_button' && (
        <Text>Traditional navigation buttons detected</Text>
      )}
    </View>
  );
}
```

### Manual Detection

```typescript
import { 
  getNavigationMode, 
  isGestureNavigation, 
  getNavigationBarHeight 
} from 'react-native-navigation-mode';

const checkNavigation = async () => {
  // Get all info at once
  const navInfo = await getNavigationMode();
  
  // Or get specific info
  const isGesture = await isGestureNavigation();
  const barHeight = await getNavigationBarHeight();
  
  console.log('Navigation info:', navInfo);
  console.log('Is gesture:', isGesture);
  console.log('Bar height:', barHeight);
};
```

---

## 🤔 Why This Library?

Android devices can use different navigation modes, but detecting which one is active has been a major pain point for React Native developers. Most existing solutions rely on unreliable workarounds:

### ❌ Common Bad Approaches

- **Screen dimension calculations** - Breaks on different screen sizes and orientations
- **Safe area inset guessing** - Inconsistent across devices and Android versions
- **Margin-based detection** - Fragile and depends on UI layout changes
- **Manual device databases** - Impossible to maintain for all Android devices

### ✅ This Library's Solution

This library uses **official Android APIs** to directly query the system's navigation configuration:

- **`config_navBarInteractionMode`** - The actual system resource Android uses internally
- **Settings.Secure provider** - Fallback method for reliable detection
- **WindowInsets API** - Accurate navigation bar height detection
- **Zero guesswork** - No calculations, no assumptions, just direct system queries

### 🚀 Critical for Edge-to-Edge Mode

With Android 15 enforcing edge-to-edge display for apps targeting API 35 and Google mandating this for Play Store updates starting August 31, 2025, proper navigation detection is now **essential**:

- **Edge-to-edge enforcement** - Android 16 will remove the opt-out entirely
- **Expo SDK 52+** - New projects use edge-to-edge by default
- **React Native 0.79+** - Built-in support for 16KB page size and edge-to-edge
- **Safe area management** - Critical for preventing content overlap with system bars

### Real-World Impact

```typescript
// Before: Unreliable dimension-based guessing
const isGesture = screenHeight === windowHeight; // 😢 Breaks easily

// After: Direct system detection  
const isGesture = await isGestureNavigation(); // 🎯 Always accurate
```

**Perfect for:**

- 🎨 Adaptive UI layouts based on navigation type
- 📱 Bottom sheet positioning and safe areas
- 🧭 Navigation-aware component design
- 🔄 Edge-to-edge layout compatibility
- 📊 Analytics and user experience tracking

---

## 🛠️ Technical Details

### Platform Support

| Platform | Support      | Notes                                                        |
| -------- | ------------ | ------------------------------------------------------------ |
| Android  | ✅ Full       | Detects all navigation modes and navigation bar height via native Android APIs |
| iOS      | ✅ Compatible | Always returns `gesture` and `navigationBarHeight: 0` (iOS uses gesture navigation) |
| Expo     | ✅ Full       | Supported in managed workflow with SDK 52+                   |

### Android Compatibility

- **API 21+** - Basic navigation bar detection
- **API 29+** - Full navigation mode detection (`config_navBarInteractionMode`)
- **All versions** - Fallback detection methods included
- **API 30+** - WindowInsets-based navigation bar height detection
- **API 24-29** - Resource-based navigation bar height fallback

### How It Works

The library uses multiple detection methods for maximum accuracy:

1. **`config_navBarInteractionMode`** - Official Android configuration (API 29+)
2. **Settings Provider** - Checks `navigation_mode` system setting
3. **WindowInsets API** - Accurate navigation bar height detection (API 30+)
4. **Resource-based fallback** - Navigation bar height for older devices

### Performance Notes

1. 🍎 **iOS Behavior** - iOS always returns `isGestureNavigation: true` and `navigationBarHeight: 0` since iOS doesn't have Android-style navigation bars
2. ⚡ **Performance** - Turbo module ensures minimal performance impact
3. 🔄 **Real-time** - Navigation mode is detected at call time, reflecting current device settings

---

## 🐛 Troubleshooting

### Common Issues

**"TurboModuleRegistry.getEnforcing(...) is not a function"**

- Ensure you're using React Native 0.68+ with new architecture enabled
- For older RN versions, the module will fallback gracefully

**Always returns `'unknown'` on Android**

- Check if your device/emulator supports the navigation mode APIs
- Some custom ROMs may not expose standard Android navigation settings

**Navigation bar height returns `0`**

- This is normal on devices without navigation bars (some tablets)
- On older Android versions, fallback detection may not work on all devices

**Expo: "Package does not contain a valid config plugin"**

- Ensure you've installed the latest version of the library
- Try clearing your cache: `npx expo start --clear`
- Make sure the plugin is added to your `app.json`

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT

## 💖 Support the Project

<p align="center" valign="center">
  <a href="https://liberapay.com/FutureJJ/donate">
    <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" > 
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">
    <img src=".github/assets/upi.png" alt="UPI_Donation_Button" height="50" >
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">
    <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >
  </a>
</p>

## ❤️ Thanks to

- Module built using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
- Readme is edited using [Typora](https://typora.io/)

---
