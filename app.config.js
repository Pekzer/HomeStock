module.exports = {
  expo: {
    name: "HomeStock",
    slug: "homestock",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.pekzer.homestock"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    extra: {
      eas: {
        projectId: "40bd542c-6ee0-4c1c-b085-ae098fe2323e"
      }
    },
    experiments: {
      baseUrl: '/HomeStock'
    }
  }
};
