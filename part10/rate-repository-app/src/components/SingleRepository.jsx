import { useParams } from "react-router-native";
import { StyleSheet } from "react-native";

import RepositoryItem from "./RepositoryList/RepositoryItem";
import ReviewList from "./ReviewList";
import useSingleRepo from "../hooks/useSingleRepo";

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
});

const RepositoryInfo = ({ repository }) => {
  return <RepositoryItem repo={repository} single />;
};

const SingleRepositoryContainer = ({ reviews, repository, onEndReach }) => {
  return (
    <ReviewList
      reviews={reviews}
      header={<RepositoryInfo repository={repository} />}
      headerStyle={styles.header}
      onEndReach={onEndReach}
    />
  );
};

const SingleRepository = () => {
  const id = useParams().id;
  const { repository: repo, fetchMore } = useSingleRepo({
    first: 8,
    id,
  });

  const onEndReach = () => {
    fetchMore();
  };

  const reviews = repo.reviews.edges.map((edge) => edge.node);

  return (
    <SingleRepositoryContainer
      reviews={reviews}
      repository={repo}
      onEndReach={onEndReach}
    />
  );
};

export default SingleRepository;
