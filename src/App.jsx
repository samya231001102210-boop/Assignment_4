
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Kolkata");
  const [searchCity, setSearchCity] = useState("Kolkata");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      if (!searchCity.trim()) {
        setError("Please enter a city name.");
        setWeather(null);
        return;
      }

      if (!API_KEY) {
        setError("API key is missing. Check your .env file.");
        setWeather(null);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setWeather(null);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            searchCity
          )}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("City not found. Please try again.");
          }

          if (response.status === 401) {
            throw new Error("Invalid API key or API key not activated.");
          }

          throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();
        setWeather(data);

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

  }, [searchCity, API_KEY]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setSearchCity(city.trim());
  };

  const formatTime = (timestamp) => {
    if (!weather) return "--";

    const date = new Date(
      (timestamp + weather.timezone) * 1000
    );

    return date.toISOString().slice(11, 16);
  };

  return (
    <div className="app">
      <div className="weather-container">

        <h1>Weather Dashboard</h1>

        <p className="subtitle">
          Check weather conditions in any city
        </p>

        <form onSubmit={handleSearch} className="search-box">

          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit">
            Search
          </button>

        </form>

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && !loading && (
          <p className="error">{error}</p>
        )}

        {weather && !loading && !error && (
          <div className="weather-card">

            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <h1 className="temperature">
              {Math.round(weather.main.temp)}°C
            </h1>

            <p className="description">
              {weather.weather[0].description}
            </p>

            <div className="weather-details">

              <div className="detail">
                <h3>Humidity</h3>
                <p>{weather.main.humidity}%</p>
              </div>

              <div className="detail">
                <h3>Wind Speed</h3>
                <p>{weather.wind.speed} m/s</p>
              </div>

              <div className="detail">
                <h3>Sunrise</h3>
                <p>{formatTime(weather.sys.sunrise)}</p>
              </div>

              <div className="detail">
                <h3>Sunset</h3>
                <p>{formatTime(weather.sys.sunset)}</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
