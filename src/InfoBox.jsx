import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';
import "./InfoBox.css";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SunnyIcon from '@mui/icons-material/Sunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';


export default function InfoBox({info,unit}){
  const convertTemp = (tempC) => {
  return unit === "C" ? tempC : (tempC * 9) / 5 + 32;
};
const getLocalTime = (timezoneOffsetInSeconds) => {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + timezoneOffsetInSeconds * 1000);
  return cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};



const INIT_URL="https://images.unsplash.com/photo-1526066843114-f1623fde3476?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const HOT_URL="https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D ";

const COLD_URL="https://images.unsplash.com/photo-1643913928206-68bf59c5feec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjMzfHxjb2xkJTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D ";

const RAINY_URL="https://images.unsplash.com/photo-1603321544554-f416a9a11fcf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return(
        <div className="InfoBox">
     


        <div className='cardContainer'>

         <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={info.humidity>80? RAINY_URL : info.temp>15 ?HOT_URL: COLD_URL}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {info.city}
          {info.humidity>80? <ThunderstormIcon/> : info.temp>15 ? <SunnyIcon/>: <AcUnitIcon/>}
        </Typography>
        <Typography variant="body2"  color="text.secondary" component={"span"} >
           <p>Temperature = {convertTemp(info.temp).toFixed(1)}°{unit}</p>
<p>Humidity = {info.humidity}</p>
<p>Min Temp = {convertTemp(info.tempMin).toFixed(1)}°{unit}</p>
<p>Max Temp = {convertTemp(info.tempMax).toFixed(1)}°{unit}</p>
<p>The weather can be described as <i>{info.weather}</i> and feels like {convertTemp(info.feelslike).toFixed(1)}°{unit}</p>

{info.aqi && (
  <>
    <p><strong>Air Quality:</strong> {["Good", "Fair", "Moderate", "Poor", "Very Poor"][info.aqi - 1]}</p>
    <p>PM2.5 Concentration: {info.pm25} µg/m³</p>
  </>
)}

<p>Local Time = {getLocalTime(info.timezone)}</p>

{info.forecast && (
  <div style={{ marginTop: "1rem", color: "black", background: "#ffffffaa", padding: "1rem", borderRadius: "10px" }}>
    <h3 style={{ marginBottom: "0.5rem" }}>3-Day Forecast</h3>
    {info.forecast.map((day, index) => (
      <p key={index}>
        <strong>{day.date}</strong>: {day.temp}°C - {day.weather}
      </p>
    ))}
  </div>
)}



        </Typography>
      </CardContent>
      
    </Card>
    </div>

        </div>
    );
}