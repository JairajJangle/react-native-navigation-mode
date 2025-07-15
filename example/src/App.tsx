import { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  getNavigationMode,
  isGestureNavigation,
  getNavigationBarHeight,
  useNavigationMode,
  type NavigationModeInfo,
} from 'react-native-navigation-mode';
import { styles } from './app.styles';

export default function App() {
  // Using the hook
  const { navigationMode, loading, error } = useNavigationMode();

  const [navMode, setNavMode] = useState<NavigationModeInfo | null>(null);
  const [screenWidth] = useState(Dimensions.get('window').width);
  const [refreshing, setRefreshing] = useState(false);

  // Set navMode from hook when it loads
  useEffect(() => {
    if (navigationMode) {
      setNavMode(navigationMode);
    }
  }, [navigationMode]);

  const checkNavigationMode = async () => {
    try {
      setRefreshing(true);

      // Using manual method to get navigation mode
      const mode = await getNavigationMode();
      const gesture = await isGestureNavigation();
      const height = await getNavigationBarHeight();

      setNavMode({
        isGestureNavigation: gesture,
        navigationBarHeight: height,
        interactionMode: mode.interactionMode,
        type: mode.type,
      });

      setNavMode(mode);
    } catch (err) {
      console.error('Error getting navigation mode:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const checkGestureNavigation = async () => {
    try {
      const gesture = await isGestureNavigation();
      setNavMode((prev) =>
        prev ? { ...prev, isGestureNavigation: gesture } : prev
      );
    } catch (err) {
      console.error('Error checking gesture navigation:', err);
    }
  };

  const checkNavigationBarHeight = async () => {
    try {
      const height = await getNavigationBarHeight();
      setNavMode((prev) =>
        prev ? { ...prev, navigationBarHeight: height } : prev
      );
    } catch (err) {
      console.error('Error getting navigation bar height:', err);
    }
  };

  const getNavigationTypeColor = (type: string) => {
    switch (type) {
      case '3_button':
        return '#3498db';
      case '2_button':
        return '#2ecc71';
      case 'gesture':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  const getNavigationTypeIcon = (type: string) => {
    switch (type) {
      case '3_button':
        return '⚪⚪⚪';
      case '2_button':
        return '⚪⚪';
      case 'gesture':
        return '📱';
      default:
        return '❓';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🧭 Navigation Mode</Text>
          <Text style={styles.subtitle}>Detect navigation mode info</Text>
        </View>

        {/* Current Navigation Mode */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Current Navigation Mode</Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Detecting...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error.message}</Text>
            </View>
          )}

          {navMode && !loading && (
            <View style={styles.navigationInfo}>
              <View
                style={[
                  styles.navigationBadge,
                  { backgroundColor: getNavigationTypeColor(navMode.type) },
                ]}
              >
                <Text style={styles.navigationIcon}>
                  {getNavigationTypeIcon(navMode.type)}
                </Text>
                <Text style={styles.navigationTypeText}>
                  {navMode.type?.replace?.('_', '-')?.toUpperCase?.()}
                </Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gesture Navigation</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        color: navMode.isGestureNavigation
                          ? '#27ae60'
                          : '#e74c3c',
                      },
                    ]}
                  >
                    {navMode.isGestureNavigation ? '✅ Yes' : '❌ No'}
                  </Text>
                </View>

                {navMode.interactionMode !== undefined && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Interaction Mode</Text>
                    <Text style={styles.detailValue}>
                      {navMode.interactionMode}
                    </Text>
                  </View>
                )}

                {navMode.navigationBarHeight !== undefined && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Height</Text>
                    <Text style={styles.detailValue}>
                      {navMode.navigationBarHeight}dp
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Navigation Bar Visualization */}
        {navMode?.navigationBarHeight && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📏 Navigation Bar Height</Text>
            <View style={styles.visualizationContainer}>
              <View
                style={[
                  styles.navBarVisualization,
                  {
                    height: Math.max(navMode?.navigationBarHeight || 0, 20),
                    width: screenWidth * 0.7,
                  },
                ]}
              >
                <Text style={styles.visualizationText}>
                  {navMode?.navigationBarHeight}dp
                </Text>
              </View>
              <Text style={styles.visualizationLabel}>
                Actual navigation bar height
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionContainerTopPaddingView} />

        {/* Actions */}
        <View
          style={{
            ...styles.actionsContainer,
            marginBottom: (navMode?.navigationBarHeight || 0) / 2,
          }}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={checkNavigationMode}
            disabled={refreshing}
          >
            <Text style={styles.primaryButtonText}>
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh All'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={checkGestureNavigation}
            >
              <Text style={styles.secondaryButtonText}>Check Gesture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={checkNavigationBarHeight}
            >
              <Text style={styles.secondaryButtonText}>Check Height</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
