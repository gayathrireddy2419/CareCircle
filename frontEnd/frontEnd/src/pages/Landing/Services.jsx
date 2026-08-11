import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  HeartPulse,
  Pill,
  BrainCircuit,
  ShieldCheck,
  Activity,
} from "lucide-react";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Stethoscope size={36} color="#2563eb" />,
      title: "Digital Healthcare Hub",
      description:
        "Manage complete family healthcare and doctor appointments from one central dashboard.",
      link: "/app/dashboard"
    },
    {
      icon: <HeartPulse size={36} color="#ef4444" />,
      title: "Biometric & Vitals Tracking",
      description:
        "Monitor blood pressure, sugar levels, BMI, sleep quality, and heart rate history.",
      link: "/app/metrics"
    },
    {
      icon: <Pill size={36} color="#10b981" />,
      title: "Medicine Management",
      description:
        "Manage prescriptions, daily dose intake logs, refill notifications, and inventory.",
      link: "/app/medicine"
    },
    {
      icon: <BrainCircuit size={36} color="#8b5cf6" />,
      title: "AI Symptom Checker",
      description:
        "Get instant preliminary symptom assessments and health recommendations.",
      link: "/app/ai"
    },
    {
      icon: <ShieldCheck size={36} color="#dc2626" />,
      title: "Emergency SOS Broadcast",
      description:
        "1-click panic alert with instant emergency contact notifications and hospital map.",
      link: "/app/emergency"
    },
    {
      icon: <Activity size={36} color="#f59e0b" />,
      title: "Health Diagnostics & Analytics",
      description:
        "Interactive trend charts and downloadable PDF medical reports for doctor visits.",
      link: "/app/analytics"
    },
  ];

  return (
    <section className="services" id="services">
      <div className="services-header">
        <span>OUR SERVICES</span>
        <h2>Healthcare Services Built for Every Family</h2>
        <p>
          CareCircle provides intelligent digital healthcare modules that simplify everyday medical management.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="service-btn" onClick={() => navigate(service.link)}>
              Explore Module
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;