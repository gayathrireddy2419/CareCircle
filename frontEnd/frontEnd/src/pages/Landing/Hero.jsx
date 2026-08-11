import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Users,
  Pill,
  ArrowRight,
  Activity
} from "lucide-react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <span className="badge">
          ❤️ Trusted Family Healthcare Platform
        </span>

        <h1>
          Your Family's
          <span> Digital Health Companion</span>
        </h1>

        <p>
          Manage medicines, health records, emergency contacts,
          appointments, reminders, and AI health assistance
          in one secure, centralized platform.
        </p>

        <div className="hero-buttons">
          <Link to="/app/dashboard" className="primary-btn">
            Open Dashboard
            <ArrowRight size={18} />
          </Link>

          <Link to="/register" className="secondary-btn">
            Get Started
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <Users size={30} color="#2563eb" />
            <h2>Connected</h2>
            <p>Families</p>
          </div>

          <div className="stat-card">
            <HeartPulse size={30} color="#10b981" />
            <h2>Tracked</h2>
            <p>Health Records</p>
          </div>

          <div className="stat-card">
            <Pill size={30} color="#f59e0b" />
            <h2>Organized</h2>
            <p>Medicines Managed</p>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <ShieldCheck size={56} color="#2563eb" />

          <h2>CareCircle AI</h2>

          <p>
            Securely manage your family's health with AI-powered medicine
            reminders, 1-click emergency SOS, health reports, and biometrics.
          </p>

          <div className="feature-list">
            <div>✔ AI Symptom Checker & Advisor</div>
            <div>✔ Prescription & Refill Reminders</div>
            <div>✔ 1-Click Emergency SOS Broadcast</div>
            <div>✔ Family Medical Records Vault</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;