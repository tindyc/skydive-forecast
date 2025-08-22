import "./WeatherCard.css";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
};

export default function WeatherCard({ day }: { day: ForecastDay }) {
  return (
    <div className="weather-card">
      <h3>{day.date}</h3>
      <div className="icon">☁️</div>
      <p>🌡 {day.temperature_2m_max}°C</p>
      <p>💨 {day.windspeed_10m_max} km/h</p>
      <p>☁️ {day.cloudcover_mean}%</p>
      <p>Beginner: {day.status_beginner}</p>
      <p>Experienced: {day.status_experienced}</p>
    </div>
  );
}
