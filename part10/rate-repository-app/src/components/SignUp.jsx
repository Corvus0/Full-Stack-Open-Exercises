import { View, Pressable, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-native";
import Toast from "react-native-toast-message";

import FormikTextInput from "./FormikTextInput";
import theme from "../theme";
import Text from "./Text";
import useSignIn from "../hooks/useSignIn";
import useSignUp from "../hooks/useSignUp";

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
  username: yup
    .string()
    .min(1, "Username must contain at least 1 character")
    .max(30, "Username cannot contain more than 30 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(5, "Password must contain at least 5 characters")
    .max(50, "Password cannot contain more than 50 characters")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

const SignUpForm = ({ onSubmit, dirty, isValid }) => {
  const disabled = !dirty || !isValid;
  return (
    <View style={styles.signInForm}>
      <FormikTextInput name="username" placeholder="Username" />
      <FormikTextInput name="password" placeholder="Password" secureTextEntry />
      <FormikTextInput
        name="passwordConfirm"
        placeholder="Password Confirmation"
        secureTextEntry
      />
      <Pressable
        onPress={onSubmit}
        style={[
          styles.signInButton,
          disabled && { backgroundColor: "lightgrey" },
        ]}
        disabled={disabled}
      >
        <Text fontWeight="bold" style={styles.signInButtonText}>
          Sign Up
        </Text>
      </Pressable>
      <Toast />
    </View>
  );
};

export const SignUpContainer = ({ onSubmit }) => {
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
        <SignUpForm onSubmit={handleSubmit} dirty={dirty} isValid={isValid} />
      )}
    </Formik>
  );
};

const SignUp = () => {
  const [signUp] = useSignUp();
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signUp({ username, password });
      await signIn({ username, password });
      navigate("/");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error Signing Up",
        text2: e.message,
      });
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;
