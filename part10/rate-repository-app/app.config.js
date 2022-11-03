import "dotenv/config";

export default {
  expo: {
    name: "rate-repository-app",
    slug: "rate-repository-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.corvus0.rate_repo",
      buildNumber: "1.0.0",
      supportsTablet: true,
    },
    android: {
      package: "com.corvus0.rate_repo",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      env: process.env.ENV,
      apolloUri: process.env.APOLLO_URI,
      eas: {
        projectId: "a14f5b64-a2b5-480a-8286-b856b982f9cf",
      },
    },
  },
};
