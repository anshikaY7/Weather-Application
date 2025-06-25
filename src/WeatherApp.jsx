import { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import SearchBox from './SearchBox';
import './App.css';

export default function WeatherApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const [weatherInfo, setWeatherInfo] = useState({
    city: "Delhi",
    feelslike: 24.84,
    temp: 25.05,
    tempMax: 25.05,
    tempMin: 25.05,
    humidity: 47,
    weather: "haze",
    timezone: 19800,
  });
  
  const [unit, setUnit] = useState("C");

  const API_KEY = "b5c5cc4e050ae118e6dd76eee225205c";
const getWeatherInfoByCoords = async (lat, lon) => {
  try {
    setIsLoading(true); // Start loading
    const [weatherRes, aqiRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    ]);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();
    const forecastData = await forecastRes.json();

    const forecast = forecastData.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .slice(0, 3)
      .map(item => ({
        date: new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
        temp: item.main.temp,
        weather: item.weather[0].description
      }));

    const result = {
      city: weatherData.name,
      temp: weatherData.main.temp,
      tempMin: weatherData.main.temp_min,
      tempMax: weatherData.main.temp_max,
      humidity: weatherData.main.humidity,
      feelslike: weatherData.main.feels_like,
      weather: weatherData.weather[0].description,
      timezone: weatherData.timezone,
      aqi: aqiData.list[0].main.aqi,
      pm25: aqiData.list[0].components.pm2_5,
      forecast
    };

    setWeatherInfo(result);
  } catch (error) {
    console.error("Error fetching weather info:", error);
  } finally {
    setIsLoading(false); 
  }
};


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherInfoByCoords(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation permission denied", err);
      }
    );
  }, []);

 const updateInfo = (newInfo) => {
  if (!newInfo || !newInfo.city) {
    setError("This place does not exist.");
    return;
  }
  setError(null); 
  setWeatherInfo(newInfo);
};


  const getBackgroundClass = () => {
    if (weatherInfo.humidity > 80) return "rainy";
    if (weatherInfo.temp < 15) return "cold";
    return "hot";
  };

  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
      <div className="center-box">
        <h1 style={{ color: "black" }}>Weather Application</h1>

        <button
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#ffffffcc",
            color: "#333",
            fontWeight: "bold",
          }}
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherInfoByCoords(latitude, longitude);
              },
              (err) => {
                alert("Location access denied or unavailable.");
                console.error("Geolocation error:", err);
              }
            );
          }}
        >
          📍 Use My Location
        </button>

        <button
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#ffffffcc",
            color: "#333",
            fontWeight: "bold",
          }}
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
        >
          Show in °{unit === "C" ? "F" : "C"}
        </button>

        <SearchBox updateInfo={updateInfo} />
  {isLoading ? (
  <p style={{ fontWeight: "bold", marginTop: "1rem" }}>Loading weather data...</p>
) : (
  <>
    {error && (
      <div style={{
        color: "white",
        backgroundColor: "#ff4444",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        fontWeight: "bold"
      }}>
        {error}
      </div>
    )}

    <InfoBox info={weatherInfo} unit={unit} />
  </>
)}


      </div>
    </div>
  );
}

