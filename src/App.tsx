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

function App() {
  const dropzones = ["Hibaldstow", "Langar", "Dunkeswell"];

  return (
    <Router basename={import.meta.env.DEV ? "/" : "/skydiving-forecast"}>
      <div className="app">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h2>Select a Dropzone</h2>
                <div className="dropzone-grid">
                  {dropzones.map((dz) => (
                    <Link key={dz} to={`/dropzone/${dz}`} className="dropzone-card">
                      {dz}
                    </Link>
                  ))}
                </div>
              </main>
            }
          />
          <Route path="/dropzone/:name" element={<DropzonePage />} />
        </Routes>

        <footer>
          <p>Designed & built by <strong>TindyC</strong> ✨</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
