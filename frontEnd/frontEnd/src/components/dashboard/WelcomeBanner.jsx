import React from "react";
import { ShieldCheck, Activity, HeartPulse } from "lucide-react";
import "./WelcomeBanner.css";

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-badge">
          <ShieldCheck size={16} /> Encrypted Family Health Portal
        </div>
        <h1>Welcome Back 👋</h1>
        <p>
          Monitor your family's health metrics, manage daily medicines, store vault records, and send instant SOS alerts from your dashboard.
        </p>

        <div className="welcome-tags">
          <span className="welcome-tag">
            <Activity size={14} /> Live Telemetry Sync
          </span>
          <span className="welcome-tag">
            <HeartPulse size={14} /> 24/7 Vital Monitoring
          </span>
        </div>
      </div>

      <div className="welcome-graphic">
        <div className="graphic-circle outer"></div>
        <div className="graphic-circle inner"></div>
        <div className="graphic-icon-wrap">
          <HeartPulse size={54} className="pulse-icon" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;