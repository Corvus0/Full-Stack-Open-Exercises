import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSort = (a, b) => b.votes - a.votes;

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdotes(state, action) {
      const changedAnecdote = action.payload;
      return state
        .map((a) => (a.id !== changedAnecdote.id ? a : changedAnecdote))
        .sort(anecdoteSort);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdote(state, action) {
      return action.payload;
    },
  },
});

export const { updateAnecdotes, appendAnecdote, setAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdote(anecdotes.sort(anecdoteSort)));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const updateAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.updateAnecdote(anecdote);
    dispatch(updateAnecdote(newAnecdote));
  };
};

export default anecdoteSlice.reducer;
