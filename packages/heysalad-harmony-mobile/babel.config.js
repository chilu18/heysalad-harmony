module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Remove reanimated plugin to avoid version conflicts
    // plugins: ['react-native-reanimated/plugin'],
  };
};