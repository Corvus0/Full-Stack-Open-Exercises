import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const blogSort = (a, b) => b.likes - a.likes;

const blogSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = blogSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const blogs = await usersService.getAll();
    dispatch(setUsers(blogs.sort(blogSort)));
  };
};

export default blogSlice.reducer;
