import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import personsService from "./services/persons";

const Filter = ({ search, onChange }) => {
  return (
    <form>
      filter shown with
      <input value={search} onChange={onChange} />
    </form>
  );
};

const PersonForm = ({ addName, name, nameChange, number, numberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        <p>
          name: <input value={name} onChange={nameChange} />
        </p>
        <p>
          number: <input value={number} onChange={numberChange} />
        </p>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, delPerson }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.name} className="person">
          {person.name} {person.number}{" "}
          <button onClick={() => delPerson(person.name, person.id)}>
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ message: null, error: false });

  const hook = () => {
    personsService.getAll().then((persons) => setPersons(persons));
  };

  useEffect(hook, []);

  const addName = (event) => {
    event.preventDefault();
    const person = persons.find((person) => person.name === newName);

    if (person) {
      if (
        window.confirm(
          `${person.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...person, number: newNumber };

        personsService
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            if (!returnedPerson) {
              setMessage({
                message: `Information of ${person.name} has already been removed from server`,
                error: true,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 5000);
              setPersons(persons.filter((p) => p.id !== person.id));
            } else {
              setPersons(
                persons.map((p) => (p.id !== person.id ? p : returnedPerson))
              );
            }
          })
          .catch((error) => {
            const message = error.response.data.error;
            setMessage({ message, error: true });
            setTimeout(() => {
              setMessage({ message: null, error: false });
            }, 5000);
            console.log(message);
          });
      }
      setMessage({ message: `Updated ${person.name}`, error: false });
      setTimeout(() => {
        setMessage({ message: null, error: false });
      }, 5000);
    } else {
      personsService
        .create({ name: newName, number: newNumber })
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMessage({ message: `Added ${newName}`, error: false });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 5000);
        })
        .catch((error) => {
          const message = error.response.data.error;
          setMessage({ message, error: true });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 5000);
          console.log(message);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  const delPerson = (name, id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personsService.del(id);
      setMessage({ message: `Deleted ${name}`, error: false });
      setTimeout(() => {
        setMessage({ message: null, error: false });
      }, 5000);
      setPersons(persons.filter((p) => p.id !== id));
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const personsToShow = search
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message.message} error={message.error} />

      <Filter search={search} onChange={handleSearchChange} />

      <h2>Add a new</h2>

      <PersonForm
        addName={addName}
        name={newName}
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} delPerson={delPerson} />
    </div>
  );
};

export default App;
