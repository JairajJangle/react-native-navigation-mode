import { type ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

const pkg = require('react-native-navigation-mode/package.json');

const withNavigationMode: ConfigPlugin = (config) => {
  return config;
};

export default createRunOncePlugin(withNavigationMode, pkg.name, pkg.version);
