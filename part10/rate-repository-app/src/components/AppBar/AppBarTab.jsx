import { Text, StyleSheet } from "react-native";
import { Link } from "react-router-native";
import theme from "../../theme";

const styles = StyleSheet.create({
  tab: {
    paddingVertical: theme.padding.appBarVertical,
    paddingHorizontal: theme.padding.appBarHorizontal,
  },
  label: {
    color: theme.colors.tabLabel,
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBarTab = ({ label, link, onPress }) => {
  return (
    <Link style={styles.tab} to={link} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Link>
  );
};

export default AppBarTab;
