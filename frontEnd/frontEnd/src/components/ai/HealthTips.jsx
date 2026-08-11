// ==========================================
// src/components/ai/HealthTips.jsx
// ==========================================

import React, { useState, useEffect } from "react";
import {
  Heart,
  Apple,
  Dumbbell,
  Moon,
  Droplets,
  Brain,
  Smile,
  Pill,
  RefreshCw,
} from "lucide-react";

import "./HealthTips.css";

const tips = [
  {
    icon: <Heart size={22} />,
    title: "Heart Health",
    description:
      "Walk for at least 30 minutes daily to improve heart health and blood circulation.",
  },
  {
    icon: <Apple size={22} />,
    title: "Healthy Diet",
    description:
      "Eat fruits, vegetables, whole grains and reduce processed foods.",
  },
  {
    icon: <Droplets size={22} />,
    title: "Stay Hydrated",
    description:
      "Drink 2-3 litres of water every day to keep your body hydrated.",
  },
  {
    icon: <Moon size={22} />,
    title: "Good Sleep",
    description:
      "Sleep for 7-8 hours every night to improve immunity and concentration.",
  },
  {
    icon: <Dumbbell size={22} />,
    title: "Exercise",
    description:
      "Exercise regularly to maintain a healthy weight and strong muscles.",
  },
  {
    icon: <Brain size={22} />,
    title: "Mental Health",
    description:
      "Practice meditation or deep breathing for at least 10 minutes daily.",
  },
  {
    icon: <Smile size={22} />,
    title: "Stress Management",
    description:
      "Spend quality time with family and friends to reduce stress.",
  },
  {
    icon: <Pill size={22} />,
    title: "Medicine Reminder",
    description:
      "Take medicines exactly as prescribed and never skip doses.",
  },
];

export default function HealthTips() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="health-tips-card">

      <div className="tips-header">

        <div className="tips-title">

          <Heart size={24} />

          <h3>Daily Health Tips</h3>

        </div>

        <button
          className="refresh-tip"
          onClick={nextTip}
        >
          <RefreshCw size={18} />
        </button>

      </div>

      <div className="tip-content">

        <div className="tip-icon">

          {tips[currentTip].icon}

        </div>

        <h4>

          {tips[currentTip].title}

        </h4>

        <p>

          {tips[currentTip].description}

        </p>

      </div>

      <div className="tip-indicators">

        {tips.map((_, index) => (

          <span
            key={index}
            className={
              currentTip === index
                ? "indicator active"
                : "indicator"
            }
            onClick={() => setCurrentTip(index)}
          />

        ))}

      </div>

      <div className="quick-tips">

        <h4>Quick Wellness Checklist</h4>

        <ul>

          <li>✅ Drink enough water</li>

          <li>✅ Walk 30 minutes</li>

          <li>✅ Eat healthy meals</li>

          <li>✅ Sleep 7-8 hours</li>

          <li>✅ Take medicines on time</li>

        </ul>

      </div>

    </div>
  );
}