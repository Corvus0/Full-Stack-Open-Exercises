import { useQuery } from "@apollo/client";

import { GET_REPO } from "../graphql/queries";

const useSingleRepo = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPO, {
    fetchPolicy: "cache-and-network",
    variables,
  });

  const handleFetchMore = () => {
    const canFetchMore =
      !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  if (loading)
    return {
      repository: { reviews: { edges: [] } },
      fetchMore: handleFetchMore,
      loading,
      ...result,
    };

  return {
    repository: data?.repository,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};

export default useSingleRepo;
