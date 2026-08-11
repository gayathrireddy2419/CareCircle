import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  PhoneCall,
  Ambulance,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import "./EmergencySection.css";

const EmergencySection = () => {
  return (
    <section className="emergency-section" id="emergency">
      <div className="emergency-overlay">
        <div className="emergency-left">
          <span className="emergency-tag">
            <ShieldAlert size={18} />
            Emergency Support 24×7
          </span>

          <h2>
            Help is Just
            <span> One Click Away</span>
          </h2>

          <p>
            CareCircle provides instant access to emergency contacts, 1-click SOS broadcast,
            critical medical profiles, and nearby hospital details for your family.
          </p>

          <div className="emergency-buttons">
            <Link to="/app/emergency" className="sos-btn">
              Emergency SOS Module
              <ArrowRight size={18} />
            </Link>

            <Link to="/app/setup-wizard" className="learn-btn">
              Setup Emergency Contacts
            </Link>
          </div>
        </div>

        <div className="emergency-right">
          <div className="info-card">
            <div className="info-item">
              <PhoneCall size={30} color="#ef4444" />
              <div>
                <h4>National Emergency Helpline</h4>
                <p>112 (National Emergency Number)</p>
              </div>
            </div>

            <div className="info-item">
              <Ambulance size={30} color="#2563eb" />
              <div>
                <h4>Ambulance Service</h4>
                <p>108 Medical Response Unit</p>
              </div>
            </div>

            <div className="info-item">
              <HeartPulse size={30} color="#10b981" />
              <div>
                <h4>Emergency Health Profile</h4>
                <p>Instant access to blood group, allergies & medical conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;