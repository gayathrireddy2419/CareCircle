// ==========================================
// src/components/analytics/BMIChart.jsx
// ==========================================

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./BMIChart.css";

const bmiData = [
  { month: "Jan", bmi: 24.5 },
  { month: "Feb", bmi: 24.2 },
  { month: "Mar", bmi: 23.9 },
  { month: "Apr", bmi: 23.7 },
  { month: "May", bmi: 23.5 },
  { month: "Jun", bmi: 23.3 },
  { month: "Jul", bmi: 23.1 },
  { month: "Aug", bmi: 22.9 },
  { month: "Sep", bmi: 22.8 },
  { month: "Oct", bmi: 22.7 },
  { month: "Nov", bmi: 22.6 },
  { month: "Dec", bmi: 22.5 },
];

export default function BMIChart() {
  return (
    <div className="chart-card">

      <div className="chart-header">
        <h3>BMI Trend</h3>
        <span>Last 12 Months</span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={bmiData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis domain={[18, 30]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}