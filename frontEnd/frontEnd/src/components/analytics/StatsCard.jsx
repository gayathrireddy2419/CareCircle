// ==========================================
// src/components/analytics/StatsCard.jsx
// ==========================================

import React from "react";
import CountUp from "react-countup";
import "./StatsCard.css";

export default function StatsCard({
  title,
  value,
  icon,
  color
}) {
  return (
    <div
      className="stats-card"
      style={{
        borderTop: `5px solid ${color}`
      }}
    >
      <div className="stats-icon">
        <div
          className="icon-circle"
          style={{
            background: color
          }}
        >
          {icon}
        </div>
      </div>

      <div className="stats-content">

        <h4>{title}</h4>

        <h2>
          <CountUp
            end={value}
            duration={2}
          />
        </h2>

        <span>
          Updated just now
        </span>

      </div>

    </div>
  );
}