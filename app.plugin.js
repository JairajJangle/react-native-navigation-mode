const { createRunOncePlugin } = require('@expo/config-plugins');

/**
 * Expo Config Plugin for react-native-navigation-mode
 * This plugin ensures the native module is properly linked in managed workflow
 */
const withNavigationMode = (config) => {
  // No additional configuration needed for this module
  // The module will be auto-linked through the Expo modules system
  return config;
};

const pkg = require('./package.json');

module.exports = createRunOncePlugin(withNavigationMode, pkg.name, pkg.version);
