import { useMutation } from "@apollo/client";
import { DELETE_REVIEW } from "../graphql/mutations";

const useDeleteReview = () => {
  const [mutate, result] = useMutation(DELETE_REVIEW);

  const deleteReview = async (variables) => {
    await mutate({
      variables,
    });
  };

  return [deleteReview, result];
};

export default useDeleteReview;
