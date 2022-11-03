import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigate } from "react-router-native";
import { format } from "date-fns";

import Text from "../Text";
import theme from "../../theme";
import useDeleteReview from "../../hooks/useDeleteReview";

const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: theme.colors.repoBackground,
    padding: 10,
  },
  reviewItem: {
    flexDirection: "row",
  },
  reviewRatingContainer: {
    paddingRight: 10,
  },
  reviewRating: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.colors.primary,
    textAlign: "center",
    textAlignVertical: "center",
  },
  reviewDetailsContainer: { marginRight: 50 },
  reviewText: {
    paddingTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  reviewButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.coloredButtonText,
    fontWeight: theme.fontWeights.bold,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 3,
    marginTop: 8,
  },
});

const ReviewButtons = ({ id, refetch }) => {
  const navigate = useNavigate();
  const [deleteReview] = useDeleteReview();

  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={() => navigate(`/repos/${id}`)}>
        <Text
          style={[
            styles.reviewButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          View Repository
        </Text>
      </Pressable>
      <Pressable
        onPress={() =>
          Alert.alert(
            "Delete Review",
            "Are you sure you want to delete this review?",
            [
              { text: "CANCEL" },
              {
                text: "DELETE",
                onPress: async () => {
                  await deleteReview({ id });
                  refetch();
                },
              },
            ],
            { cancelable: true }
          )
        }
      >
        <Text
          style={[
            styles.reviewButton,
            { backgroundColor: theme.colors.delete },
          ]}
        >
          Delete Review
        </Text>
      </Pressable>
    </View>
  );
};

const ReviewItem = ({ review, myReviews, refetch }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewItem}>
        <View style={styles.reviewRatingContainer}>
          <Text color="primary" fontWeight="bold" style={styles.reviewRating}>
            {review.rating}
          </Text>
        </View>
        <View style={styles.reviewDetailsContainer}>
          <Text fontWeight="bold">
            {myReviews ? review.repository.fullName : review.user.username}
          </Text>
          <Text color="textSecondary">
            {format(new Date(review.createdAt), "yyyy-MM-dd")}
          </Text>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      </View>
      {myReviews && <ReviewButtons id={review.id} refetch={refetch} />}
    </View>
  );
};

export default ReviewItem;
