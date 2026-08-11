// ==========================================
// src/components/ai/SuggestionCard.jsx
// ==========================================

import React from "react";
import {
  Activity,
  Heart,
  Apple,
  Moon,
  Dumbbell,
  Shield,
  Pill,
  Stethoscope,
} from "lucide-react";

import "./SuggestionCard.css";

export default function SuggestionCard({
  suggestions,
  onSelect,
}) {
  const icons = [
    <Activity size={18} />,
    <Heart size={18} />,
    <Apple size={18} />,
    <Moon size={18} />,
    <Dumbbell size={18} />,
    <Shield size={18} />,
    <Pill size={18} />,
    <Stethoscope size={18} />,
  ];

  return (
    <div className="suggestion-card">

      <div className="suggestion-header">

        <h3>Suggested Questions</h3>

        <p>
          Click any question to quickly ask the AI Assistant.
        </p>

      </div>

      <div className="suggestion-list">

        {suggestions.map((item, index) => (

          <button
            key={index}
            className="suggestion-item"
            onClick={() => onSelect(item)}
          >

            <span className="suggestion-icon">
              {icons[index % icons.length]}
            </span>

            <span className="suggestion-text">
              {item}
            </span>

          </button>

        ))}

      </div>

      <div className="suggestion-footer">

        <h4>Popular Topics</h4>

        <div className="topic-tags">

          <span>Diabetes</span>

          <span>Blood Pressure</span>

          <span>Heart Care</span>

          <span>Nutrition</span>

          <span>Exercise</span>

          <span>Mental Health</span>

          <span>Vaccination</span>

          <span>BMI</span>

        </div>

      </div>

    </div>
  );
}