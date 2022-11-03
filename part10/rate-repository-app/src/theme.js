import { Platform } from "react-native";

const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
    delete: "#d6394c",
    tabBackground: "#24292e",
    tabLabel: "white",
    mainBackground: "#e1e4e8",
    repoBackground: "white",
    coloredButtonText: "white",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: "Roboto",
      ios: "Arial",
      default: "System",
    }),
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
  padding: {
    appBarVertical: 20,
    appBarHorizontal: 12,
  },
};

export default theme;
