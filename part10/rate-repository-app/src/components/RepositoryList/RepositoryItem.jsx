import React from "react";
import { View, StyleSheet, Image, Pressable, Linking } from "react-native";
import { useNavigate } from "react-router-native";

import theme from "../../theme";
import Text from "../Text";

const styles = StyleSheet.create({
  flexContainer: {
    backgroundColor: theme.colors.repoBackground,
    padding: 16,
  },
  flexHeader: {
    flexDirection: "row",
  },
  flexHeaderInfo: {
    paddingHorizontal: 20,
  },
  flexInfoItem: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  flexDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  fullName: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  description: {
    color: theme.colors.textSecondary,
  },
  language: {
    color: theme.colors.coloredButtonText,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  detail: {
    alignSelf: "center",
    paddingVertical: 4,
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 10,
  },
  linkButtonText: {
    alignSelf: "center",
    color: theme.colors.coloredButtonText,
    paddingVertical: 16,
  },
});

const HeaderItem = ({ style, label }) => {
  return (
    <View style={styles.flexInfoItem}>
      <Text style={style}>{label}</Text>
    </View>
  );
};

const RepoHeader = ({ repo }) => {
  return (
    <View style={styles.flexHeader}>
      <Image style={styles.tinyLogo} source={{ uri: repo.ownerAvatarUrl }} />
      <View style={styles.flexHeaderInfo}>
        <HeaderItem style={styles.fullName} label={repo.fullName} />
        <HeaderItem style={styles.description} label={repo.description} />
        <HeaderItem style={styles.language} label={repo.language} />
      </View>
    </View>
  );
};

const ItemDetail = ({ number, label }) => {
  return (
    <View>
      <Text fontWeight="bold" style={styles.detail}>
        {number >= 1000 ? `${(number / 1000).toFixed(1)}k` : number}
      </Text>
      <Text color={"textSecondary"}>{label}</Text>
    </View>
  );
};

const RepoDetails = ({ repo }) => {
  return (
    <View style={styles.flexDetails}>
      <ItemDetail number={repo.stargazersCount} label="Stars" />
      <ItemDetail number={repo.forksCount} label="Forks" />
      <ItemDetail number={repo.reviewCount} label="Reviews" />
      <ItemDetail number={repo.ratingAverage} label="Rating" />
    </View>
  );
};

const LinkButton = ({ url }) => {
  return (
    <Pressable onPress={() => Linking.openURL(url)} style={styles.linkButton}>
      <Text fontWeight="bold" style={styles.linkButtonText}>
        Open in GitHub
      </Text>
    </Pressable>
  );
};

const RepositoryItem = ({ repo, single }) => {
  const navigate = useNavigate();

  return (
    <Pressable onPress={() => navigate(`/repos/${repo.id}`)}>
      <View testID="repositoryItem" style={styles.flexContainer}>
        <RepoHeader repo={repo} />
        <RepoDetails repo={repo} />
        {single && <LinkButton url={repo.url} />}
      </View>
    </Pressable>
  );
};

export default RepositoryItem;
