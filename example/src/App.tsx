import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform } from 'react-native';
import {
  getNavigationMode,
  isGestureNavigation,
  useNavigationMode,
  type NavigationModeInfo,
} from 'react-native-navigation-mode';

export default function App() {
  const [navMode, setNavMode] = useState<NavigationModeInfo | null>(null);
  const [isGesture, setIsGesture] = useState<boolean | null>(null);

  // Using the hook
  const { navigationMode, loading, error } = useNavigationMode();

  const checkNavigationMode = async () => {
    try {
      const mode = await getNavigationMode();
      setNavMode(mode);
    } catch (err) {
      console.error('Error getting navigation mode:', err);
    }
  };

  const checkGestureNavigation = async () => {
    try {
      const gesture = await isGestureNavigation();
      setIsGesture(gesture);
    } catch (err) {
      console.error('Error checking gesture navigation:', err);
    }
  };

  useEffect(() => {
    checkNavigationMode();
    checkGestureNavigation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Mode Detector</Text>
      <Text style={styles.platform}>Platform: {Platform.OS}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Using Hook:</Text>
        {loading && <Text style={styles.loading}>Loading...</Text>}
        {error && <Text style={styles.error}>Error: {error.message}</Text>}
        {navigationMode && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Type: {navigationMode.type}</Text>
            <Text style={styles.info}>
              Gesture Nav: {navigationMode.isGestureNavigation ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Check:</Text>
        {navMode && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Navigation Type: {navMode.type}</Text>
            <Text style={styles.info}>
              Interaction Mode: {navMode.interactionMode}
            </Text>
            <Text style={styles.info}>
              Is Gesture: {navMode.isGestureNavigation ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
        {isGesture !== null && (
          <Text style={styles.info}>
            Quick Gesture Check: {isGesture ? 'Yes' : 'No'}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Refresh Navigation Mode" onPress={checkNavigationMode} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Check Gesture Navigation"
          onPress={checkGestureNavigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  platform: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoContainer: {
    gap: 5,
  },
  info: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 2,
  },
  loading: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  error: {
    fontSize: 14,
    color: '#e74c3c',
  },
  buttonContainer: {
    marginBottom: 10,
    width: '100%',
  },
});
