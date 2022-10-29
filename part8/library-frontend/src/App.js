import { useState, useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from "./queries";

export const updateCache = (cache, query, addedBook) => {
  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    const author = addedBook.author;
    if (allAuthors.find((a) => a.name === author.name)) {
      return {
        allAuthors: allAuthors.map((a) =>
          a.name === author.name ? { ...a, bookCount: a.bookCount + 1 } : a
        ),
      };
    } else {
      return {
        allAuthors: allAuthors.concat({ ...author }),
      };
    }
  });
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: allBooks.concat(addedBook),
    };
  });
  addedBook.genres.forEach((g) => {
    cache.updateQuery({ ...query, variables: { genre: g } }, (data) => {
      if (!data) {
        return;
      }
      return {
        allBooks: data.allBooks.concat(addedBook),
      };
    });
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(
        `New Book: ${addedBook.title} by ${addedBook.author.name} Added`
      );
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  useEffect(() => {
    if (!token) {
      const token = localStorage.getItem("library-user-token");
      setToken(token);
    }
  }, [token]); // eslint-disable-line

  const UserInformation = () => {
    if (!token) {
      return <button onClick={() => setPage("login")}>login</button>;
    }
    return (
      <button
        onClick={() => {
          if (page === "add") {
            setPage("login");
          }
          logout();
        }}
      >
        logout
      </button>
    );
  };

  if (token && page === "login") {
    setPage("authors");
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        <UserInformation />
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommend show={page === "recommend"} />

      <LoginForm show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
