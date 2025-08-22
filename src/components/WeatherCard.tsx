// src/components/WeatherCard.tsx
import React from "react";
import "./WeatherCard.css";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
};

interface Props {
  day: ForecastDay;
  isBig?: boolean;
}

const WeatherCard: React.FC<Props> = ({ day, isBig = false }) => {
  const getWeatherIcon = () => {
    if (day.precipitation_sum > 2) return "🌧️";
    if (day.precipitation_sum > 0) return "🌦️";
    if (day.cloudcover_mean > 70) return "☁️";
    if (day.cloudcover_mean > 30) return "⛅";
    return "☀️";
  };

  return (
    <div className={`weather-card ${isBig ? "big" : "small"}`}>
      <h3>{day.date}</h3>
      <div className="weather-icon">{getWeatherIcon()}</div>

      {/* Shared fields */}
      <p>🌡 {day.temperature_2m_max}°C</p>
      <p>💨 {day.windspeed_10m_max} km/h</p>

      {/* Big card shows more details */}
      {isBig && (
        <>
          <p>☁️ {day.cloudcover_mean}%</p>
          <p>Beginner: {day.status_beginner}</p>
          <p>Experienced: {day.status_experienced}</p>
        </>
      )}
    </div>
  );
};

export default WeatherCard;
