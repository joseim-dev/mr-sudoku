const { getDefaultConfig } = require("@expo/metro-config"); // ✅ 올바른 패키지
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./global.css" });
