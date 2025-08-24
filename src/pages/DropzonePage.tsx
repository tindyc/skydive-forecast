import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import "../components/WeatherCard.css";
import { deslugify } from "../utils/slug";
import Preloader from "../components/Preloader";
import JumpabilityHeatmap from "../components/JumpabilityHeatmap"; // ✅ Heatmap
import AnalyticsCard from "../components/AnalyticsCard"; // ✅ Analytics

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

type Dropzone = {
  name: string;
  lat: number;
  lon: number;
};

type Analytics = {
  avg_temp: number;
  avg_wind: number;
  jumpable_days_beginner: number;
  jumpable_days_experienced: number;
  total_days: number;
};

type HeatmapDay = {
  date: string;
  beginner_ok: boolean;
  experienced_ok: boolean;
  windspeed_10m_max: number;
  temperature_2m_max: number;
  description: string;
};

export default function DropzonePage() {
  const { name: slug } = useParams<{ name: string }>();

  const [dropzones, setDropzones] = useState<Dropzone[]>([]);
  const [dropzoneName, setDropzoneName] = useState<string>("");
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);
  const [bestDay, setBestDay] = useState<ForecastDay | null>(null);

  // ✅ Format date as DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  // ✅ Scroll helper
  const scrollToBigCard = () => {
    const bigCard = document.querySelector(".big-weather-card");
    if (bigCard) {
      bigCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ✅ Fetch dropzones.json from /public
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dropzones.json`)
      .then((res) => res.json())
      .then((data: Dropzone[]) => {
        setDropzones(data);

        if (slug) {
          const names = data.map((dz) => dz.name);
          const original = deslugify(slug, names);
          setDropzoneName(original);
        }
      })
      .catch((err) => console.error("Failed to load dropzones:", err));
  }, [slug]);

  // ✅ Fetch forecast (with analytics + heatmap) from Lambda
  useEffect(() => {
    if (!dropzoneName) return;

    fetch(
      `https://m3dx4c3t5g.execute-api.us-east-1.amazonaws.com/?dz=${encodeURIComponent(
        dropzoneName
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecast");
        return res.json();
      })
      .then((data) => {
        const parsed = data.body ? JSON.parse(data.body) : data;

        if (parsed.forecast && Array.isArray(parsed.forecast)) {
          setForecast(parsed.forecast);
          setSelectedDay(parsed.forecast[0]);
          if (parsed.analytics) setAnalytics(parsed.analytics);
          if (parsed.heatmap) setHeatmap(parsed.heatmap);
        } else if (parsed.error) {
          setError(parsed.error);
        } else {
          setError("No forecast available for this dropzone");
        }
      })
      .catch((err) => setError(err.message));
  }, [dropzoneName]);

  // ✅ Find next best day for experienced jumpers
  useEffect(() => {
    if (!forecast.length) return;

    const nextGoodDay =
      forecast.find((day) => {
        const safeForExperienced =
          day.windspeed_10m_max <= 30 &&
          day.precipitation_sum === 0 &&
          day.cloudcover_mean < 80 &&
          day.temperature_2m_max > 0;
        return safeForExperienced;
      }) || null;

    setBestDay(nextGoodDay);
  }, [forecast]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!forecast.length) return <Preloader />;

  return (
    <div className="dropzone-page forecast-wrapper">
      {/* 🎉 Next Best Jump Day Notification */}
      {bestDay ? (
        <div
          className="best-day-banner clickable"
          onClick={() => {
            setSelectedDay(bestDay);
            scrollToBigCard(); // ✅ scroll when banner clicked
          }}
        >
          🎉 Next good jump day:{" "}
          <strong>{formatDate(bestDay.date)}</strong> ({bestDay.description})
        </div>
      ) : (
        <div className="best-day-banner no-good-day">
          ⚠️ No good jump days in the next 10 days.
        </div>
      )}

      {/* Dropzone Name */}
      {dropzoneName && <h2 className="dropzone-title">{dropzoneName}</h2>}

      {/* Big selected card */}
      {selectedDay && (
        <div className="big-weather-card">
          <WeatherCard day={selectedDay} isBig={true} />
        </div>
      )}

      {/* 📅 Mini cards row title with tooltip */}
      <div
        className="title-with-info"
        style={{
          justifyContent: "flex-start",
          width: "100%",
          maxWidth: "1200px",
          marginTop: "10px",
        }}
      >
        <h3>📅 10-Day Forecast</h3>
        <span className="info-icon">
          ℹ️
          <span className="tooltip">
            👉 Scroll horizontally to view all 10 forecast days. <br />
            👉 Click on a day to see full details above.
          </span>
        </span>
      </div>

      {/* Smaller cards row */}
      <div className="small-cards-row">
        {forecast.map((day) => (
          <div
            key={day.date}
            className={`mini-weather-card ${
              selectedDay?.date === day.date ? "active" : ""
            }`}
            onClick={() => {
              setSelectedDay(day);
              scrollToBigCard(); // ✅ scroll when mini card clicked
            }}
          >
            <WeatherCard day={day} isBig={false} />
          </div>
        ))}
      </div>

      {/* 📊 Analytics + 🔥 Heatmap side by side */}
      {(analytics || heatmap.length > 0) && (
        <div className="analytics-heatmap-section">
          {analytics && (
            <div className="analytics-panel">
              <AnalyticsCard analytics={analytics} />
            </div>
          )}
          {heatmap.length > 0 && (
            <div className="heatmap-panel">
              <JumpabilityHeatmap
                heatmap={heatmap}
                onSelectDay={(date) => {
                  const found = forecast.find((d) => d.date === date);
                  if (found) {
                    setSelectedDay(found);
                    scrollToBigCard(); // ✅ scroll when heatmap card clicked
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
