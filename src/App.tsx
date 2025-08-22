import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DropzonePage from "./pages/DropzonePage";
import "./App.css";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
};

function App() {
  const [forecast, setForecast] = useState<Record<string, ForecastDay[]> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://m3dx4c3t5g.execute-api.us-east-1.amazonaws.com/default/skydiving-forecast")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecast");
        return res.json();
      })
      .then((data) => setForecast(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!forecast) return <p>Loading forecast...</p>;

  return (
    <Router>
      <div className="app">
        <h1>Skydiving Forecast</h1>
        <nav>
          {Object.keys(forecast).map((dropzone) => (
            <Link key={dropzone} to={`/dropzone/${dropzone}`} style={{ margin: "10px" }}>
              {dropzone}
            </Link>
          ))}
        </nav>

        <Routes>
          {Object.entries(forecast).map(([dropzone, days]) => (
            <Route
              key={dropzone}
              path={`/dropzone/${dropzone}`}
              element={<DropzonePage name={dropzone} forecast={days} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
