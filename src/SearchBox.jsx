import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css";
import { useState } from 'react';

export default function SearchBox({ updateInfo }) {
  let [city, setCity] = useState("");
  let [error, setError] = useState(false);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const API_KEY = "b5c5cc4e050ae118e6dd76eee225205c";

  let getWeatherInfo = async () => {
    try {
      let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      
      if (!response.ok) {
        throw new Error("Invalid city");
      }

      let jsonResponse = await response.json();

      const lat = jsonResponse.coord.lat;
      const lon = jsonResponse.coord.lon;

      const [aqiResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);

      const aqiData = await aqiResponse.json();
      const forecastData = await forecastResponse.json();

      const forecast = forecastData.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 3)
        .map(item => ({
          date: new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
          temp: item.main.temp,
          weather: item.weather[0].description
        }));

      let result = {
        city: jsonResponse.name,
        temp: jsonResponse.main.temp,
        tempMin: jsonResponse.main.temp_min,
        tempMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelslike: jsonResponse.main.feels_like,
        weather: jsonResponse.weather[0].description,
        timezone: jsonResponse.timezone,
        aqi: aqiData.list[0].main.aqi,
        pm25: aqiData.list[0].components.pm2_5,
        forecast
      };

      return result;
    } catch (err) {
      throw err;
    }
  };

  let handleChange = (evt) => {
    setCity(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      let newInfo = await getWeatherInfo();
      updateInfo(newInfo);
      setError(false);   
      setCity("");       
    } catch (err) {
      setError(true);    
    }
  };

  return (
    <div className="SearchBox">
      <form onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
        />
        <br />
        <br />
        <Button variant="contained" type="submit">Search</Button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>No such place exists!</p>}
      </form>
    </div>
  );
}
