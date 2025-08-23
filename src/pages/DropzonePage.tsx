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
  description: string;
};

export default function DropzonePage() {
  const { name } = useParams<{ name: string }>();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);

  useEffect(() => {
    if (!name) return;

    // ✅ Call Lambda with ?dz=<dropzoneName>
    fetch(
      `https://m3dx4c3t5g.execute-api.us-east-1.amazonaws.com/?dz=${encodeURIComponent(
        name
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecast");
        return res.json();
      })
      .then((data) => {
        // If Lambda is behind API Gateway proxy, data might be stringified in "body"
        const parsed = data.body ? JSON.parse(data.body) : data;

        if (parsed.forecast) {
          setForecast(parsed.forecast);
          setSelectedDay(parsed.forecast[0]); // today’s forecast by default
        } else {
          setError("No forecast available for this dropzone");
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
            <WeatherCard day={day} isBig={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
