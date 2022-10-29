import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSort = (a, b) => b.likes - a.likes;

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    updateBlogs(state, action) {
      const changedBlog = action.payload;
      return state
        .map((b) => (b.id !== changedBlog.id ? b : changedBlog))
        .sort(blogSort);
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlog(state, action) {
      return action.payload;
    },
    removeFromBlogs(state, action) {
      const id = action.payload;
      return state.filter((b) => b.id !== id);
    },
  },
});

export const { updateBlogs, appendBlog, setBlog, removeFromBlogs } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlog(blogs.sort(blogSort)));
  };
};

export const createBlog = (blog, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.create({ ...blog, likes: 0 });
    newBlog.user = user;
    dispatch(appendBlog(newBlog));
  };
};

export const updateBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.update(blog);
    newBlog.user = blog.user;
    dispatch(updateBlogs(newBlog));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeFromBlogs(id));
  };
};

export default blogSlice.reducer;
