import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SET_BIRTHYEAR, ALL_AUTHORS } from "../queries";

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState("None");
  const [born, setBorn] = useState("");

  const [setBirthyear] = useMutation(SET_BIRTHYEAR);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name === "None") {
      return;
    }
    setBirthyear({
      variables: {
        name,
        setBornTo: Number(born),
      },
      update: (cache, response) => {
        cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
          const editedAuthor = response.data.editAuthor;
          return {
            allAuthors: allAuthors.map((a) =>
              a.name === editedAuthor.name ? editedAuthor : a
            ),
          };
        });
      },
    });

    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option key="None" value="None">
              None
            </option>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  );
};

export default AuthorForm;
