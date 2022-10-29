import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GET_FAVORITE_GENRE } from "../queries";
import BooksTable from "./BooksTable";

const Recommend = (props) => {
  const allBooks = useQuery(ALL_BOOKS);
  let favoriteGenre = useQuery(GET_FAVORITE_GENRE);
  if (!props.show || !allBooks || !favoriteGenre) {
    return null;
  }

  favoriteGenre = favoriteGenre.data.me.favouriteGenre;

  const books = allBooks.data.allBooks.filter((b) =>
    b.genres.includes(favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favorite genre {`${favoriteGenre}`}</p>

      <BooksTable books={books} />
    </div>
  );
};

export default Recommend;
