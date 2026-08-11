// ==========================================
// src/components/analytics/WeightChart.jsx
// ==========================================

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import "./WeightChart.css";

const weightData = [
  { month: "Jan", weight: 78 },
  { month: "Feb", weight: 77.5 },
  { month: "Mar", weight: 77 },
  { month: "Apr", weight: 76.8 },
  { month: "May", weight: 76.2 },
  { month: "Jun", weight: 75.9 },
  { month: "Jul", weight: 75.5 },
  { month: "Aug", weight: 75 },
  { month: "Sep", weight: 74.8 },
  { month: "Oct", weight: 74.5 },
  { month: "Nov", weight: 74.2 },
  { month: "Dec", weight: 74 }
];

export default function WeightChart() {

  const totalLoss =
    weightData[0].weight -
    weightData[weightData.length - 1].weight;

  return (

    <div className="weight-card">

      <div className="weight-header">

        <div>

          <h3>Weight Progress</h3>

          <p>Monthly Body Weight Tracking</p>

        </div>

        <span className="weight-badge">

          -{totalLoss.toFixed(1)} kg

        </span>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <AreaChart data={weightData}>

          <defs>

            <linearGradient
              id="weightColor"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#10b981"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#10b981"
                stopOpacity={0.05}
              />

            </linearGradient>

          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis domain={[70,80]} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#weightColor)"
          />

        </AreaChart>

      </ResponsiveContainer>

      <div className="weight-footer">

        <div className="weight-item">

          <h4>Starting</h4>

          <span>
            {weightData[0].weight} kg
          </span>

        </div>

        <div className="weight-item">

          <h4>Current</h4>

          <span>
            {weightData[11].weight} kg
          </span>

        </div>

        <div className="weight-item">

          <h4>Loss</h4>

          <span className="success">

            {totalLoss.toFixed(1)} kg

          </span>

        </div>

      </div>

    </div>

  );

}