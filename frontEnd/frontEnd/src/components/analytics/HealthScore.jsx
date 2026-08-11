// ==========================================
// src/components/analytics/HealthScore.jsx
// ==========================================

import React from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";

import {
  Heart,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";

import "./HealthScore.css";

export default function HealthScore({
  score = 0,
  compliance = 0,
  completed = 0,
  pending = 0
}) {

  const data = [
    {
      name: "Health",
      value: score,
      fill: "#2563eb"
    }
  ];

  const getStatus = () => {

    if (score >= 90)
      return {
        text: "Excellent",
        color: "#16a34a"
      };

    if (score >= 75)
      return {
        text: "Good",
        color: "#2563eb"
      };

    if (score >= 60)
      return {
        text: "Fair",
        color: "#f59e0b"
      };

    return {
      text: "Poor",
      color: "#ef4444"
    };

  };

  const status = getStatus();

  return (

    <div className="health-score-card">

      <div className="health-score-header">

        <Heart size={28} />

        <div>

          <h2>Overall Health Score</h2>

          <p>
            AI generated wellness summary
          </p>

        </div>

      </div>

      <div className="health-score-body">

        <div className="health-chart">

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <RadialBarChart
              innerRadius="72%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >

              <PolarAngleAxis
                type="number"
                domain={[0,100]}
                tick={false}
              />

              <RadialBar
                background
                dataKey="value"
                cornerRadius={20}
              />

            </RadialBarChart>

          </ResponsiveContainer>

          <div className="score-center">

            <h1>{score}%</h1>

            <span
              style={{
                color: status.color
              }}
            >
              {status.text}
            </span>

          </div>

        </div>

        <div className="health-details">

          <div className="health-item">

            <Activity
              color="#2563eb"
            />

            <div>

              <h4>Medicine Compliance</h4>

              <span>
                {compliance}%
              </span>

            </div>

          </div>

          <div className="health-item">

            <CheckCircle
              color="#16a34a"
            />

            <div>

              <h4>Completed Appointments</h4>

              <span>
                {completed}
              </span>

            </div>

          </div>

          <div className="health-item">

            <Clock
              color="#f59e0b"
            />

            <div>

              <h4>Pending Appointments</h4>

              <span>
                {pending}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}