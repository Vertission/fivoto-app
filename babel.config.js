module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['module:react-native-dotenv']],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
