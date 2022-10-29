import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import BooksTable from "./BooksTable";

const Books = (props) => {
  const [genre, setGenre] = useState("All");
  let allBooks = useQuery(ALL_BOOKS);
  let filteredBooks = useQuery(ALL_BOOKS, {
    variables: { genre: genre === "All" ? undefined : genre },
  });

  if (!props.show || !allBooks.data || !filteredBooks.data) {
    return null;
  }

  const genres = new Set();
  allBooks.data.allBooks.forEach((b) => {
    b.genres.forEach((g) => genres.add(g));
  });

  const books = filteredBooks.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      {genre !== "All" && (
        <p>
          <b>in genre {`${genre}`}</b>
        </p>
      )}

      <BooksTable books={books} />

      <h3>Filter by Genre</h3>
      <select value={genre} onChange={({ target }) => setGenre(target.value)}>
        <option key="All" value="All">
          All
        </option>
        {[...genres].sort().map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Books;
