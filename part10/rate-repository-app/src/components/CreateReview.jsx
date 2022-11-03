import { View, Pressable, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-native";
import Toast from "react-native-toast-message";

import FormikTextInput from "./FormikTextInput";
import theme from "../theme";
import Text from "./Text";
import useCreateReview from "../hooks/useCreateReview";

const styles = StyleSheet.create({
  signInForm: {
    backgroundColor: "white",
    padding: 10,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 16,
    marginVertical: 8,
  },
  signInButtonText: {
    alignSelf: "center",
    color: "white",
  },
});

const initialValues = {
  ownerName: "",
  repositoryName: "",
  rating: 0,
  text: "",
};

const validationSchema = yup.object().shape({
  ownerName: yup.string().required("Repository owner name is required"),
  repositoryName: yup.string().required("Repository name is required"),
  rating: yup
    .number()
    .min(0, "Rating must be between 0 and 100")
    .max(100, "Rating must be between 0 and 100")
    .required("Rating is required"),
  text: yup.string().optional(),
});

const CreateReviewForm = ({ onSubmit, dirty, isValid }) => {
  const disabled = !dirty || !isValid;
  return (
    <View style={styles.signInForm}>
      <FormikTextInput name="ownerName" placeholder="Repository Owner Name" />
      <FormikTextInput name="repositoryName" placeholder="Repository Name" />
      <FormikTextInput name="rating" placeholder="Rating Between 0 and 100" />
      <FormikTextInput name="text" placeholder="Review" multiline={true} />
      <Pressable
        onPress={onSubmit}
        style={[
          styles.signInButton,
          disabled && { backgroundColor: "lightgrey" },
        ]}
        disabled={disabled}
      >
        <Text fontWeight="bold" style={styles.signInButtonText}>
          Create a Review
        </Text>
      </Pressable>
      <Toast />
    </View>
  );
};

export const CreateReviewContainer = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, dirty, isValid }) => (
        <CreateReviewForm
          onSubmit={handleSubmit}
          dirty={dirty}
          isValid={isValid}
        />
      )}
    </Formik>
  );
};

const CreateReview = () => {
  const [createReview] = useCreateReview();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { repositoryName, ownerName, rating, text } = values;

    try {
      const repoId = await createReview({
        review: {
          repositoryName,
          ownerName,
          rating: parseInt(rating),
          text,
        },
      });
      navigate(`/repos/${repoId}`);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error Creating Review",
        text2: e.message,
      });
    }
  };

  return <CreateReviewContainer onSubmit={onSubmit} />;
};

export default CreateReview;
