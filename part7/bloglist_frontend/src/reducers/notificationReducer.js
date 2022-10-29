import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  timeout: null,
  error: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotification(state, action) {
      clearTimeout(state.timeout);
      return action.payload;
    },
    clearNotification() {
      return { message: null, timeout: null, error: false };
    },
  },
});

export const { updateNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, seconds, error) => {
  return (dispatch) => {
    const timeout = setTimeout(
      () => dispatch(clearNotification()),
      seconds * 1000
    );
    dispatch(updateNotification({ message, timeout, error }));
  };
};

export default notificationSlice.reducer;
