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
  description: string; // 👈 ensure backend sends this
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

  // ✅ Big Card layout: icon left, info right
  if (isBig) {
    return (
      <div className="weather-card big">
        <div className="weather-icon">{getWeatherIcon()}</div>
        <div className="weather-info">
          <h3>{day.date}</h3>
          <p className="weather-description">{day.description}</p>
          <p>🌡 {day.temperature_2m_max}°C</p>
          <p>💨 {day.windspeed_10m_max} km/h</p>
          <p>☁️ {day.cloudcover_mean}%</p>
          <p>
            Beginner: {day.status_beginner}{" "}
            {day.status_beginner.toLowerCase().includes("no") ? "❌" : "✅"}
          </p>
          <p>
            Experienced: {day.status_experienced}{" "}
            {day.status_experienced.toLowerCase().includes("no") ? "❌" : "✅"}
          </p>
        </div>
      </div>
    );
  }

  // ✅ Small Card layout (default)
  return (
    <div className="weather-card small">
      <h4>{day.date}</h4>
      <div className="mini-weather-icon">{getWeatherIcon()}</div>
      <p className="weather-description">{day.description}</p>
    </div>
  );
};

export default WeatherCard;
