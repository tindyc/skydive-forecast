import WeatherCard from "../components/WeatherCard";

type ForecastDay = {
  date: string;
  temperature_2m_max: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  cloudcover_mean: number;
  status_beginner: string;
  status_experienced: string;
};

export default function DropzonePage({ name, forecast }: { name: string; forecast: ForecastDay[] }) {
  return (
    <div>
      <h2>{name} Forecast</h2>
      <div className="cards-grid">
        {forecast.map((day) => (
          <WeatherCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
