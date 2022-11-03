import { useQuery } from "@apollo/client";

import { GET_USER } from "../graphql/queries";

const useUser = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_USER, {
    fetchPolicy: "cache-and-network",
    variables,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.me.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.me.reviews.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  if (loading)
    return {
      me: { reviews: { edges: [] } },
      fetchMore: handleFetchMore,
      loading,
      ...result,
    };

  return {
    me: data?.me,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};

export default useUser;
