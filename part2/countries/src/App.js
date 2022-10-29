import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ search, onChange }) => {
  return (
    <form>
      find countries
      <input value={search} onChange={onChange} />
    </form>
  );
};

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({ temp: 0, icon: 0, wind: 0 });
  const api_key = process.env.REACT_APP_API_KEY;

  const hook = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then((response) => response.data)
      .then((weather) => {
        setWeather({
          temp: weather.main.temp,
          icon: weather.weather[0].icon,
          wind: weather.wind.speed,
        });
      });
  };

  useEffect(hook, []);

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weather.temp} Celsius</p>
      <img
        src={
          weather.icon
            ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
            : ""
        }
      ></img>
      <p>wind {weather.wind} m/s</p>
    </div>
  );
};

const CountryInfo = ({ country, show }) => {
  const [showCountry, setShowCountry] = useState(false);
  if (!showCountry && !show) {
    return (
      <p>
        {country.name.common}
        <button onClick={() => setShowCountry(!showCountry)}>show</button>
      </p>
    );
  }
  const languages = Object.values(country.languages);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png}></img>
      <Weather capital={country.capital} />
    </div>
  );
};

const Countries = ({ countries }) => {
  if (countries.length === 1) {
    const country = countries[0];
    return <CountryInfo country={country} show={true} />;
  } else if (countries.length < 10) {
    return countries.map((country) => (
      <CountryInfo key={country.cca2} country={country} show={false} />
    ));
  } else {
    return <div>Too many matches, specify another filter</div>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  const hook = () => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data));
  };

  useEffect(hook, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  let countriesToShow = [];

  if (search) {
    countriesToShow = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div>
      <Filter search={search} onChange={handleSearchChange} />
      <Countries countries={countriesToShow} />
    </div>
  );
};

export default App;
