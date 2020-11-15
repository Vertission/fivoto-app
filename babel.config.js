module.exports = function (api) {
  const presets = ['module:metro-react-native-babel-preset'];
  const plugins = [['module:react-native-dotenv']];

  if (api.env('production')) {
    plugins.push('module:metro-react-native-babel-preset');
  }

  return {
    presets,
    plugins,
  };
};
