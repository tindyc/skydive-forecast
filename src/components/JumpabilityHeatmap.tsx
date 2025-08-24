import React from "react";
import "./JumpabilityHeatmap.css";

type DayStatus = {
  date: string;
  beginner_ok: boolean;
  experienced_ok: boolean;
  windspeed_10m_max: number;
  temperature_2m_max: number;
  description: string;
};

type Props = {
  heatmap: DayStatus[];
  onSelectDay?: (date: string) => void;
};

export default function JumpabilityHeatmap({ heatmap, onSelectDay }: Props) {
const windColor = (wind: number) => {
  if (wind <= 10) return "#22c55e"; // green (calm, safe)
  if (wind <= 25) return "#eab308"; // yellow (moderate)
  return "#ef4444"; // red (too windy)
};

  return (
    <div className="heatmap-wrapper">
      <div className="title-with-info">
        <h3>📅 Jumpability Heatmap</h3>
        <span className="info-icon">
          ℹ️
          <span className="tooltip">
            Each box = one forecast day.<br />
            Background color shows <strong>windspeed</strong>:<br />
            🟢 Green = calm (&lt;= 10 mph)<br />
            🟡 Yellow = moderate (11–25 mph)<br />
            🔴 Red = too windy (&gt; 25 mph)<br /><br />
            <strong>B</strong> = beginner conditions<br />
            <strong>E</strong> = experienced conditions<br />
            ✅ Green border = safe<br />
            ❌ Red border = not safe
          </span>
        </span>
      </div>

      <div className="heatmap-grid">
        {heatmap.map((day) => {
          const dateLabel = new Date(day.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          });

          return (
            <div
              key={day.date}
              className="heatmap-day"
              style={{ backgroundColor: windColor(day.windspeed_10m_max) }}
              title={`${dateLabel}\n${day.description}\n🌡 ${day.temperature_2m_max}°C\n💨 ${day.windspeed_10m_max} mph`}
              onClick={() => onSelectDay && onSelectDay(day.date)}
            >
              <p className="date">{dateLabel}</p>
              <div className={`status beginner ${day.beginner_ok ? "ok" : "bad"}`}>
                B
              </div>
              <div className={`status experienced ${day.experienced_ok ? "ok" : "bad"}`}>
                E
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
