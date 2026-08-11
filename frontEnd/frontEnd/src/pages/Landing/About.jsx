import React from "react";
import {
  HeartHandshake,
  ShieldCheck,
  BrainCircuit,
  Users,
} from "lucide-react";
import "./About.css";

const About = () => {
  const features = [
    {
      icon: <HeartHandshake size={36} color="#2563eb" />,
      title: "Family Health Management",
      description:
        "Manage every family member's medicines, appointments, and medical history from one secure dashboard.",
    },
    {
      icon: <ShieldCheck size={36} color="#10b981" />,
      title: "Secure Medical Records",
      description:
        "Store prescriptions, lab reports, and health documents safely with encrypted access anytime.",
    },
    {
      icon: <BrainCircuit size={36} color="#8b5cf6" />,
      title: "AI Health Assistant",
      description:
        "Receive smart medicine reminders, health recommendations, and instant preliminary symptom analysis.",
    },
    {
      icon: <Users size={36} color="#f59e0b" />,
      title: "Caregiver Collaboration",
      description:
        "Allow family members and primary caregivers to monitor vitals and manage healthcare together seamlessly.",
    },
  ];

  return (
    <section className="about-section" id="about">
      <div className="section-header">
        <span className="section-tag">ABOUT CARECIRCLE</span>

        <h2>
          Healthcare Made Simple
          <span> For Every Family</span>
        </h2>

        <p>
          CareCircle is a modern digital healthcare management platform that helps
          families organize medicines, medical records, daily reminders,
          emergency contacts, and AI-driven health insights—all in one secure place.
        </p>
      </div>

      <div className="about-grid">
        {features.map((item, index) => (
          <div className="about-card" key={index}>
            <div className="about-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="about-bottom">
        <div className="mission-card">
          <h3>🎯 Our Mission</h3>
          <p>
            To make family healthcare management simple, accessible, secure,
            and intelligent for everyone.
          </p>
        </div>

        <div className="vision-card">
          <h3>🚀 Our Vision</h3>
          <p>
            Build the smartest digital healthcare ecosystem connecting patients,
            caregivers, doctors, and AI assistants.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;