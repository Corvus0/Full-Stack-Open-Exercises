import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "../graphql/mutations";

const useCreateReview = () => {
  const [mutate, result] = useMutation(CREATE_REVIEW);

  const createReview = async (variables) => {
    const { data } = await mutate({
      variables,
    });
    return data.createReview.repositoryId;
  };

  return [createReview, result];
};

export default useCreateReview;
