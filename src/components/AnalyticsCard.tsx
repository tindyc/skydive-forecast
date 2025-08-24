import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./AnalyticsCard.css";

type Props = {
  analytics: {
    avg_temp: number;
    avg_wind: number;
    jumpable_days_beginner: number;
    jumpable_days_experienced: number;
    total_days: number;
  };
};

export default function AnalyticsCard({ analytics }: Props) {
  const data = [
    { name: "Beginner", days: analytics.jumpable_days_beginner },
    { name: "Experienced", days: analytics.jumpable_days_experienced },
  ];

  return (
    <div className="analytics-card">
      <div className="title-with-info">
        <h3>📊 Jump Stats (next {analytics.total_days} days)</h3>
        <span className="info-icon">
          ℹ️
          <span className="tooltip">
            This chart shows how many of the next {analytics.total_days} forecast days 
            are safe for <strong>beginners</strong> vs <strong>experienced</strong> jumpers, 
            based on wind, rain, temperature and cloud cover.
          </span>
        </span>
      </div>

      {/* ✅ Stats block with spacing */}
      <div className="stats-block">
        <p>🌡 Avg Temp: {analytics.avg_temp.toFixed(1)}°C</p>
        <p>💨 Avg Wind: {analytics.avg_wind.toFixed(1)} mph</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value: number) => [`${value} days`, "Jumpable"]} />
          <Bar dataKey="days" fill="#3b82f6">
            <LabelList
              dataKey="days"
              position="top"
              formatter={(val: number) => `${val} days`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
