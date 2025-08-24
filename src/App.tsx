import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import DropzonePage from "./pages/DropzonePage";
import "./App.css";
import { slugify } from "./utils/slug";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 54, lng: -2 };
const DEFAULT_ZOOM = 6;

function Navbar({ onHomeClick }: { onHomeClick: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <Link
        to="/"
        className="nav-logo"
        onClick={() => {
          onHomeClick();
          navigate("/");
        }}
      >
        🪂 Skydive Forecast
      </Link>
      <button
        className="home-button"
        onClick={() => {
          onHomeClick();
          navigate("/");
        }}
      >
        🏠
      </button>
    </div>
  );
}

type Dropzone = {
  name: string;
  lat: number;
  lon: number;
};

function HomePage({ resetSignal }: { resetSignal: number }) {
  const [dropzones, setDropzones] = useState<Dropzone[]>([]);
  const [filtered, setFiltered] = useState<Dropzone[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [activeDz, setActiveDz] = useState<Dropzone | null>(null);

  const navigate = useNavigate();

  // ✅ Load Google Maps once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  // Reset on logo/home click
  useEffect(() => {
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    setActiveDz(null);
    setSearch("");
    setFiltered(dropzones);
  }, [resetSignal]);

  // Fetch dropzones
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dropzones.json`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDropzones(data);
          setFiltered(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dropzones:", err);
        setLoading(false);
      });
  }, []);

  // Search filtering
  useEffect(() => {
    const results = dropzones.filter((dz) =>
      dz.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, dropzones]);

  if (loading || !isLoaded) return <Preloader />;

  return (
    <main>
      <section className="intro">
        <h1>Welcome to Skydive Forecast 🌤️</h1>
        <p>
          Planning a jump? This app gives you the latest weather forecasts for UK
          dropzones and tells you whether it’s safe to take to the skies.
        </p>
      </section>

      {/* Search with dropdown */}
      <div className="search-container" style={{ position: "relative" }}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search dropzones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && filtered.length > 0 && (
          <ul
            className="search-dropdown"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#161b22",
              color: "#e6edf3",
              listStyle: "none",
              margin: 0,
              padding: "0.5rem 0",
              borderRadius: "6px",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {filtered.map((dz) => (
              <li
                key={dz.name}
                style={{
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setMapCenter({ lat: dz.lat, lng: dz.lon });
                  setMapZoom(9);
                  setActiveDz(dz);
                  setSearch(""); // clear search after selecting
                }}
              >
                {dz.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
          center={mapCenter}
          zoom={mapZoom}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {filtered.map((dz) => (
            <Marker
              key={dz.name}
              position={{ lat: dz.lat, lng: dz.lon }}
              onClick={() => {
                setMapCenter({ lat: dz.lat, lng: dz.lon });
                setMapZoom(9);
                setActiveDz(dz);
              }}
            />
          ))}
          {activeDz && (
            <InfoWindow
              position={{ lat: activeDz.lat, lng: activeDz.lon }}
              onCloseClick={() => setActiveDz(null)}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "12px",
                  borderRadius: "8px",
                  minWidth: "200px",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#222",
                  }}
                >
                  {activeDz.name}
                </h4>
                <button
                  style={{
                    padding: "8px 12px",
                    background: "#0077ff",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    width: "100%",
                  }}
                  onClick={() => navigate(`/dropzone/${slugify(activeDz.name)}`)}
                >
                  View Forecast →
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Bottom Info Boxes */}
      <div className="jump-conditions-howitworks-wrapper">
        <section className="jump-conditions info-box">
          <h3>✅ Safe Jumping Conditions</h3>
          <ul>
            <li>🌬️ Beginners: safe up to 15 mph wind</li>
            <li>💨 Experienced: safe up to 30 mph wind</li>
            <li>🌧️ No rain: jumps are cancelled in wet conditions</li>
            <li>☁️ Clear skies: good visibility required</li>
            <li>🌡️ Above freezing: avoid sub-zero conditions</li>
          </ul>
        </section>
        <section className="how-it-works info-box">
          <h3>⚙️ How This App Works</h3>
          <p>🪂 Scrapes official dropzones from British Skydiving.</p>
          <p>🌍 Uses Google Geocoding API for coordinates.</p>
          <p>🌤️ Fetches 10-day forecast from Open-Meteo + applies safety rules.</p>
        </section>
      </div>
    </main>
  );
}

function App() {
  const location = useLocation();
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <>
      <ScrollToTop />
      <div className="app">
        <Navbar onHomeClick={() => setResetSignal((s) => s + 1)} />
        <Routes location={location}>
          <Route path="/" element={<HomePage resetSignal={resetSignal} />} />
          <Route path="/dropzone/:name" element={<DropzonePage />} />
        </Routes>
        <footer>
          <p>
            SkydiveForecast ☁︎ <strong>TindyC</strong>
          </p>
        </footer>
      </div>
    </>
  );
}

export default function AppWrapper() {
  const basename = import.meta.env.BASE_URL;
  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
