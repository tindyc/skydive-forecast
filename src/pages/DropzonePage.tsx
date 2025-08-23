// src/pages/DropzonePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import "../components/WeatherCard.css";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
  description: string;   // 👈 add here
};

export default function DropzonePage() {
  const { name } = useParams<{ name: string }>();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);

  useEffect(() => {
    fetch(
      "https://m3dx4c3t5g.execute-api.us-east-1.amazonaws.com/default/skydiving-forecast"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecast");
        return res.json();
      })
      .then((data) => {
        const dzData = data[name || ""];
        if (dzData) {
          setForecast(dzData);
          setSelectedDay(dzData[0]); // show today’s forecast by default
        }
      })
      .catch((err) => setError(err.message));
  }, [name]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!forecast.length) return <p>Checking the sky for you...</p>;

  return (
    <div className="dropzone-page forecast-wrapper">
      {/* Dropzone Name */}
      {name && (
        <h2 className="dropzone-title">
          {decodeURIComponent(name).replace(/-/g, " ")}
        </h2>
      )}

      {/* Big selected card */}
      {selectedDay && (
        <div className="big-weather-card">
          <WeatherCard day={selectedDay} isBig={true} />
        </div>
      )}

      {/* Smaller cards row */}
      <div className="small-cards-row">
        {forecast.map((day) => (
          <div
            key={day.date}
            className={`mini-weather-card ${
              selectedDay?.date === day.date ? "active" : ""
            }`}
            onClick={() => setSelectedDay(day)}
          >
            {/* Simplified WeatherCard for mini cards */}
            <WeatherCard day={day} isBig={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
