// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DropzonePage from "./pages/DropzonePage";
import "./App.css";
import { slugify } from "./utils/slug";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <Link to="/" className="nav-logo">🪂 Skydive Forecast</Link>
      <button className="home-button" onClick={() => navigate("/")}>
        🏠
      </button>
    </div>
  );
}

function HomePage() {
  const [dropzones, setDropzones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dropzones.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load dropzones.json: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const names = data.map((dz: { name: string }) => dz.name);
          setDropzones(names);
        } else {
          console.error("dropzones.json is not an array", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <section className="intro">
        <h1>Welcome to Skydive Forecast 🌤️</h1>
        <p>
          Planning a jump? This app gives you the latest weather forecasts for UK dropzones and tells you whether 
          it’s safe to take to the skies.
        </p>
      </section>

      <div className="title-with-info">
        <h2>Select a Dropzone</h2>
        <span className="info-icon">
          ℹ️
          <span className="tooltip">
            Select a dropzone and check the weather conditions to see if it’s safe for jumping.
          </span>
        </span>
      </div>

      <div className="dropzone-grid">
        {loading && <p>Loading dropzones...</p>}
        {!loading && dropzones.length === 0 && <p>No dropzones available.</p>}
        {dropzones.map((dz) => (
          <Link key={dz} to={`/dropzone/${slugify(dz)}`} className="dropzone-card">
            {dz}
          </Link>
        ))}
      </div>

      <section className="jump-conditions">
        <h3>Safe Jumping Conditions</h3>
        <ul>
          <li>🌬️ Beginners: max 15 mph | Experienced: max 30 mph</li>
          <li>🌧️ No jumping in rain</li>
          <li>☁️ Clear visibility required</li>
          <li>🌡️ Avoid freezing conditions</li>
        </ul>
        <p className="conditions-note">
          📖 Source:{" "}
          <a href="https://britishskydiving.org/" target="_blank" rel="noopener noreferrer">
            British Skydiving
          </a>
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router basename="/skydive-forecast">
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dropzone/:name" element={<DropzonePage />} />
        </Routes>
        <footer>
          <p> © <strong>TindyC</strong> ☁︎</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
