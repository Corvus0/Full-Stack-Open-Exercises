import { View, Pressable, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-native";
import Toast from "react-native-toast-message";

import FormikTextInput from "./FormikTextInput";
import theme from "../theme";
import Text from "./Text";
import useSignIn from "../hooks/useSignIn";

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
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const SignInForm = ({ onSubmit, dirty, isValid }) => {
  const disabled = !dirty || !isValid;
  return (
    <View style={styles.signInForm}>
      <FormikTextInput name="username" placeholder="Username" />
      <FormikTextInput name="password" placeholder="Password" secureTextEntry />
      <Pressable
        onPress={onSubmit}
        style={[
          styles.signInButton,
          disabled && { backgroundColor: "lightgrey" },
        ]}
        disabled={disabled}
      >
        <Text fontWeight="bold" style={styles.signInButtonText}>
          Sign In
        </Text>
      </Pressable>
      <Toast />
    </View>
  );
};

export const SignInContainer = ({ onSubmit }) => {
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
        <SignInForm onSubmit={handleSubmit} dirty={dirty} isValid={isValid} />
      )}
    </Formik>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signIn({ username, password });
      navigate("/");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error Signing In",
        text2: e.message,
      });
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;
