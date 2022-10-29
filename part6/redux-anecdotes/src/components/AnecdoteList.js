import { useSelector, useDispatch } from "react-redux";
import { updateAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return filter
      ? anecdotes.filter((a) => a.content.includes(filter))
      : anecdotes;
  });
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    dispatch(updateAnecdote(changedAnecdote));
    dispatch(setNotification(`you voted for '${anecdote.content}'`, 5));
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
