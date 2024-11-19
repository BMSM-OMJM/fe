const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"), // svg 제외
  sourceExts: [...resolver.sourceExts, "svg"], // svg 추가
  assetExts: [
    ...resolver.assetExts.filter((ext) => ext !== "svg"),
    "otf",
    "ttf",
  ], // otf, ttf 추가
};

module.exports = config;
