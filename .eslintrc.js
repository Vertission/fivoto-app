module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:react-native/all'],
  plugins: ['react', 'react-native'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 0,
    'react-native/no-single-element-style-arrays': 2,
    curly: 0,
    'no-shadow': 0,
    'eslint-comments/no-unused-disable': 0,
    'no-unused-vars': [1, { varsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 1,
    // 'react/prop-types': ['error'],
    // 'react/require-default-props': ['error'],
  },
};
