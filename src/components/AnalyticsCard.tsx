import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
    { name: "Beginner", value: analytics.jumpable_days_beginner },
    { name: "Experienced", value: analytics.jumpable_days_experienced },
  ];

  return (
    <div className="analytics-card">
      <h3>📊 Jump Stats (next {analytics.total_days} days)</h3>
      <p>🌡 Avg Temp: {analytics.avg_temp.toFixed(1)}°C</p>
      <p>💨 Avg Wind: {analytics.avg_wind.toFixed(1)} mph</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
