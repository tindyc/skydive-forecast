// src/components/WeatherCard.tsx
import React from "react";
import "./WeatherCard.css";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number; // now already in mph from Lambda
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
  description: string;
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

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "long" });
  };

  if (isBig) {
    return (
      <div className="weather-card big">
        {/* Left side: Icon + Date + Weekday */}
        <div className="weather-left">
          <div className="weather-icon">{getWeatherIcon()}</div>
          <p className="weekday">{getDayOfWeek(day.date)}</p>
          <p className="date">{day.date}</p>
        </div>

        {/* Right side: Weather Info */}
        <div className="weather-info">
          <p className="weather-description">{day.description}</p>
          <p>🌡 {day.temperature_2m_max}°C</p>
          {/* ✅ changed km/h → mph */}
          <p>💨 {day.windspeed_10m_max} mph</p>
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

  // ✅ Small card layout
  return (
    <div className="weather-card small">
      <h4>{day.date}</h4>
      <p className="weekday-mini">{getDayOfWeek(day.date)}</p>
      <div className="mini-weather-icon">{getWeatherIcon()}</div>
      <p className="weather-description">{day.description}</p>
    </div>
  );
};

export default WeatherCard;
