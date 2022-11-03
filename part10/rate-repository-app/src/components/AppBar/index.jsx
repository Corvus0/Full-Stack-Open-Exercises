import { View, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";
import { useApolloClient } from "@apollo/client";

import theme from "../../theme";
import AppBarTab from "./AppBarTab";
import useUser from "../../hooks/useUser";
import useAuthStorage from "../../hooks/useAuthStorage";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.tabBackground,
    flexDirection: "row",
  },
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const { me, loading } = useUser();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  const notSignedIn = loading || me === null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab label="Repositories" link="/" />
        {!notSignedIn && <AppBarTab label="Create a Review" link="/review" />}
        {!notSignedIn && <AppBarTab label="My Reviews" link="/myReviews" />}
        {notSignedIn ? (
          <AppBarTab label="Sign In" link="/signin" />
        ) : (
          <AppBarTab label="Sign Out" link="/" onPress={signOut} />
        )}
        {notSignedIn && <AppBarTab label="Sign Up" link="/signup" />}
      </ScrollView>
    </View>
  );
};

export default AppBar;
