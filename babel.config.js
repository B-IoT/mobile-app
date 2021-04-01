module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
  env: {
    production: {},
  },
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-proposal-optional-catch-binding'],
  ],
}
