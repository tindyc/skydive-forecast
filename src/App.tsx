// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DropzonePage from "./pages/DropzonePage";
import "./App.css";
import { slugify } from "./utils/slug";
import Preloader from "./components/Preloader";

// Restore GitHub Pages redirect if present
const redirect = sessionStorage.redirect;
if (redirect) {
  delete sessionStorage.redirect;
  window.history.replaceState(null, "", redirect);
}

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
  const [filtered, setFiltered] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1); // track which item is focused
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dropzones.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load dropzones.json: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const names = data.map((dz: { name: string }) => dz.name);
          setDropzones(names);
          setFiltered(names);
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

  useEffect(() => {
    const results = dropzones.filter((dz) =>
      dz.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setHighlightIndex(-1); // reset highlight when search changes
  }, [search, dropzones]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      navigate(`/dropzone/${slugify(filtered[highlightIndex])}`);
      setSearch(""); // clear search after navigation
    }
  };

    // Show Preloader while dropzones.json is loading
  if (loading) return <Preloader />;

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
            Start typing to quickly find a dropzone by name.
          </span>
        </span>
      </div>

      {/* 🔍 Search Bar with Dropdown + Keyboard Navigation */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search dropzones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {search && (
          <ul className="search-dropdown" ref={dropdownRef}>
            {filtered.map((dz, i) => (
              <li
                key={dz}
                className={i === highlightIndex ? "highlighted" : ""}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => {
                  navigate(`/dropzone/${slugify(dz)}`);
                  setSearch("");
                }}
              >
                {dz}
              </li>
            ))}
            {filtered.length === 0 && <li className="no-results">No results</li>}
          </ul>
        )}
      </div>

      {/* 📋 Grid of Dropzones */}
      <div className="dropzone-grid">
        {loading && <p>Loading dropzones...</p>}
        {!loading && filtered.length === 0 && <p>No dropzones available.</p>}
        {filtered.map((dz) => (
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
