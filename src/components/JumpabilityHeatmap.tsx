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
  onSelectDay?: (date: string) => void; // optional: to click a cell to pick that day
};

export default function JumpabilityHeatmap({ heatmap, onSelectDay }: Props) {
  // Gradient background color based on windspeed
  const windColor = (wind: number) => {
    if (wind <= 10) return "#22c55e";   // green
    if (wind <= 20) return "#eab308";   // yellow
    if (wind <= 30) return "#f97316";   // orange
    return "#ef4444";                   // red
  };

  return (
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

            <div
              className={`status beginner ${day.beginner_ok ? "ok" : "bad"}`}
            >
              B
            </div>

            <div
              className={`status experienced ${day.experienced_ok ? "ok" : "bad"}`}
            >
              E
            </div>
          </div>
        );
      })}
    </div>
  );
}
