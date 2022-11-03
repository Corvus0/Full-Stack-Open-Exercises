import { FlatList } from "react-native";

import ReviewItem from "./ReviewItem";
import { ItemSeparator } from "../RepositoryList";

const ReviewList = ({
  reviews,
  onEndReach,
  header,
  headerStyle,
  myReviews,
  refetch,
}) => {
  return (
    <FlatList
      data={reviews}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <ReviewItem review={item} myReviews={myReviews} refetch={refetch} />
      )}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={header}
      ListHeaderComponentStyle={headerStyle}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

export default ReviewList;
