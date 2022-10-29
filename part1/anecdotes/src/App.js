import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length));

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const getIndex = () => getRandomInt(anecdotes.length);

  const addPoint = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  const mostVotes = Math.max(...points);
  const mostIndex = points.indexOf(mostVotes);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button onClick={addPoint} text="vote" />
      <Button onClick={() => setSelected(getIndex())} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostIndex]}</p>
      <p>has {mostVotes} votes</p>
    </div>
  );
};

export default App;