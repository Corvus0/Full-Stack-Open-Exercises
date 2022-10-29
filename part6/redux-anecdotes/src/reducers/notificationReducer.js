import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: "Welcome to anecdotes", timeout: null };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotification(state, action) {
      clearTimeout(state.timeout);
      return action.payload;
    },
    clearNotification(state, action) {
      return { message: "", timeout: null };
    },
  },
});

export const { updateNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    const timeout = setTimeout(
      () => dispatch(clearNotification()),
      seconds * 1000
    );
    dispatch(updateNotification({ message, timeout }));
  };
};

export default notificationSlice.reducer;
