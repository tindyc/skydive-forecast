// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import DropzonePage from "./pages/DropzonePage";
import "./App.css";

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
  const dropzones = ["Hibaldstow", "Langar", "Dunkeswell"];

  return (
    <main>
      {/* 👋 Greeting / Intro Section */}
      <section className="intro">
        <h1>Welcome to Skydive Forecast 🌤️</h1>
        <p>
          Planning a jump? This app gives you the latest weather forecasts for UK dropzones and tells you whether 
          it’s safe to take to the skies. <br />
          From wind speeds to cloud cover, we’ve got you covered !
        </p>
      </section>

      {/* Title with info tooltip */}
      <div className="title-with-info">
        <h2>Select a Dropzone</h2>
        <span className="info-icon">
          ℹ️
          <span className="tooltip">
            Select a dropzone and check the weather conditions to see if it’s safe for jumping.
          </span>
        </span>
      </div>

      {/* Dropzone grid */}
      <div className="dropzone-grid">
        {dropzones.map((dz) => (
          <Link key={dz} to={`/dropzone/${dz}`} className="dropzone-card">
            {dz}
          </Link>
        ))}
      </div>

      {/* Jump Conditions Section */}
      <section className="jump-conditions">
        <h3>Safe Jumping Conditions</h3>
        <ul>
          <li>
            🌬️ <strong>Wind:</strong> Beginners should not jump if winds exceed <strong>15 mph (24 km/h)</strong>. 
            Experienced skydivers may jump in winds up to <strong>30 mph (48 km/h)</strong>.
          </li>
          <li>
            🌧️ <strong>Rain:</strong> Skydives are <strong>not conducted in rain</strong> as raindrops at freefall speeds can be painful and unsafe.
          </li>
          <li>
            ☁️ <strong>Cloud Cover:</strong> British skydiving rules require <strong>clear visibility</strong> and safe separation from clouds for spotting and navigation.
          </li>
          <li>
            🌡️ <strong>Temperature:</strong> Cold conditions can be managed with proper gear, but most dropzones won’t operate if freezing at altitude.
          </li>
        </ul>
        <p className="conditions-note">
          📖 Source:{" "}
          <a href="https://britishskydiving.org/" target="_blank" rel="noopener noreferrer">
            British Skydiving (UK Parachute Association)
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
