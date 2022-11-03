import { FlatList, View, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import { useState } from "react";

import RepositoryItem from "./RepositoryItem";
import useRepositories from "../../hooks/useRepositories";

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  repoList: {
    marginBottom: 85,
  },
  sortPicker: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  searchbar: {
    margin: 12,
  },
});

const Sorter = ({ order, setOrder }) => {
  return (
    <Picker
      selectedValue={order}
      onValueChange={(itemValue) => setOrder(itemValue)}
      prompt="Sort By"
      style={styles.sortPicker}
    >
      <Picker.Item label={"Latest Repositories"} value="latest" />
      <Picker.Item label={"Highest Rated Repositories"} value="highest" />
      <Picker.Item label={"Lowest Rated Repositories"} value="lowest" />
    </Picker>
  );
};

const Filter = ({ filter, setFilter }) => {
  const onChangeSearch = (filter) => setFilter(filter);
  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={filter}
      style={styles.searchbar}
    />
  );
};

export const RepositoryListContainer = ({
  repositories,
  onEndReach,
  header,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <RepositoryItem repo={item} />}
      style={styles.repoList}
      ListHeaderComponent={header}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  const [order, setOrder] = useState("latest");
  const [filter, setFilter] = useState("");

  let orderBy = "CREATED_AT";
  let orderDirection = "DESC";
  if (order === "highest") {
    orderBy = "RATING_AVERAGE";
  } else if (order === "lowest") {
    orderBy = "RATING_AVERAGE";
    orderDirection = "ASC";
  }

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    orderBy,
    orderDirection,
    searchKeyword: filter,
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <View>
      <RepositoryListContainer
        repositories={repositories}
        onEndReach={onEndReach}
        header={
          <View>
            <Filter filter={filter} setFilter={setFilter} />
            <Sorter order={order} setOrder={setOrder} />
          </View>
        }
      />
    </View>
  );
};

export const ItemSeparator = () => <View style={styles.separator} />;

export default RepositoryList;
