// ==========================================
// src/components/ai/SymptomChecker.jsx
// ==========================================

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

import "./SymptomChecker.css";

export default function SymptomChecker() {
  const [symptom, setSymptom] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [severity, setSeverity] = useState("");
  const [result, setResult] = useState(null);

  const analyzeSymptoms = () => {
    if (
      symptom.trim() === "" ||
      age === "" ||
      gender === "" ||
      severity === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    let assessment = "";
    let advice = "";
    let emergency = false;

    if (
      symptom.toLowerCase().includes("chest") ||
      symptom.toLowerCase().includes("heart")
    ) {
      assessment = "Possible cardiac-related symptoms.";
      advice =
        "Seek immediate medical evaluation. Avoid physical exertion until reviewed by a doctor.";
      emergency = true;
    } else if (
      symptom.toLowerCase().includes("fever") ||
      symptom.toLowerCase().includes("cold")
    ) {
      assessment = "Possible viral infection.";
      advice =
        "Stay hydrated, monitor temperature and consult a physician if symptoms persist.";
    } else if (
      symptom.toLowerCase().includes("headache")
    ) {
      assessment = "Possible tension headache or migraine.";
      advice =
        "Rest, hydrate yourself and monitor symptoms. Seek medical advice if severe.";
    } else if (
      symptom.toLowerCase().includes("cough")
    ) {
      assessment = "Possible respiratory infection.";
      advice =
        "Drink warm fluids and consult a doctor if breathing becomes difficult.";
    } else {
      assessment =
        "Unable to identify a specific condition.";
      advice =
        "Please consult a healthcare professional for an accurate diagnosis.";
    }

    setResult({
      assessment,
      advice,
      emergency,
    });
  };

  return (
    <div className="symptom-card">

      <div className="symptom-header">

        <HeartPulse size={26} />

        <div>

          <h3>AI Symptom Checker</h3>

          <p>
            Get a preliminary health assessment.
          </p>

        </div>

      </div>

      <div className="symptom-form">

        <label>Symptoms</label>

        <textarea
          rows="4"
          placeholder="Example: Fever, headache, cough..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
        />

        <label>Age</label>

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label>Gender</label>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>

          <option>Male</option>

          <option>Female</option>

          <option>Other</option>

        </select>

        <label>Severity</label>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="">Select Severity</option>

          <option>Mild</option>

          <option>Moderate</option>

          <option>Severe</option>

        </select>

        <button
          className="analyze-btn"
          onClick={analyzeSymptoms}
        >
          <Activity size={18} />

          Analyze Symptoms

        </button>

      </div>

      {result && (

        <div
          className={
            result.emergency
              ? "result emergency"
              : "result"
          }
        >

          <div className="result-title">

            {result.emergency ? (
              <AlertTriangle size={22} />
            ) : (
              <Stethoscope size={22} />
            )}

            <h4>AI Assessment</h4>

          </div>

          <p>

            <strong>Assessment :</strong>

            {result.assessment}

          </p>

          <p>

            <strong>Advice :</strong>

            {result.advice}

          </p>

          {result.emergency && (

            <div className="emergency-warning">

              ⚠ This may require immediate medical attention.

            </div>

          )}

        </div>

      )}

    </div>
  );
}