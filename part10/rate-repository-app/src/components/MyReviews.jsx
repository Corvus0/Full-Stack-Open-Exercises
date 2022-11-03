import useUser from "../hooks/useUser";

import ReviewList from "./ReviewList";

const MyReviews = () => {
  const { me, loading, fetchMore, refetch } = useUser({
    includeReviews: true,
    first: 8,
  });

  const onEndReach = () => {
    fetchMore();
  };

  let reviews = me.reviews.edges.map((edge) => edge.node);

  if (loading) return;

  return (
    <ReviewList
      reviews={reviews}
      onEndReach={onEndReach}
      myReviews
      refetch={refetch}
    />
  );
};

export default MyReviews;
