import React from "react";
import {
  Bell,
  Pill,
  FileHeart,
  BrainCircuit,
  Activity,
  ShieldAlert,
  Users,
  CalendarClock,
  Download,
} from "lucide-react";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: <Bell size={36} color="#2563eb" />,
      title: "Medicine Reminders",
      description:
        "Never miss a dose with automated medication alerts and intake logs.",
    },
    {
      icon: <Pill size={36} color="#10b981" />,
      title: "Medicine Inventory",
      description:
        "Track pill stock counts, refill warnings, and prescription frequencies.",
    },
    {
      icon: <FileHeart size={36} color="#ef4444" />,
      title: "Health Records Vault",
      description:
        "Upload and store lab reports, X-Rays, and discharge summaries securely.",
    },
    {
      icon: <BrainCircuit size={36} color="#8b5cf6" />,
      title: "AI Health Assistant",
      description:
        "Get preliminary symptom analysis and 24x7 intelligent health guidance.",
    },
    {
      icon: <Activity size={36} color="#3b82f6" />,
      title: "Health Analytics",
      description:
        "Visualize vitals, blood pressure, sugar levels, and biometric trends.",
    },
    {
      icon: <ShieldAlert size={36} color="#dc2626" />,
      title: "Emergency SOS",
      description:
        "1-click panic alert with instant SMS notifications and nearby hospital directory.",
    },
    {
      icon: <Users size={36} color="#f59e0b" />,
      title: "Family Management",
      description:
        "Monitor profiles and health metrics for children, parents, and spouses.",
    },
    {
      icon: <Download size={36} color="#06b6d4" />,
      title: "Export Health Data",
      description:
        "Download all health-related data for this member as a PDF in one click.",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-title">
        <span>OUR FEATURES</span>
        <h2>Everything Your Family Needs</h2>
        <p>
          CareCircle combines medicine tracking, AI medical assistance,
          health records vault, emergency SOS, and biometrics into one modern app.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;