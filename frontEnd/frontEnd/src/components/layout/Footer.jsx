import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-column">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Heart size={22} color="#ffffff" fill="#ffffff" />
            </div>

            <div>
              <h2>CareCircle</h2>
              <p>Smart Family Healthcare Portal</p>
            </div>
          </div>

          <p className="footer-description">
            CareCircle helps families securely manage medicines, health records,
            emergency contacts, appointments, and AI-assisted health advice in one
            central platform.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <Link to="/" onClick={scrollToTop}>Home</Link>
          <Link to="/app/dashboard">Dashboard</Link>
          <Link to="/app/members">Family Members</Link>
          <Link to="/app/medicine">Medicines & Refills</Link>
          <Link to="/app/records">Health Records Vault</Link>
          <Link to="/app/analytics">Health Analytics</Link>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h3>Core Modules</h3>
          <Link to="/app/ai">AI Health Assistant</Link>
          <Link to="/app/emergency">Emergency SOS</Link>
          <Link to="/app/metrics">Vitals & Metrics</Link>
          <Link to="/app/notifications">Notifications</Link>
          <Link to="/app/profile">User Profile</Link>
          <Link to="/app/settings">Settings</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Emergency Contact</h3>
          <p>📞 108 - Ambulance</p>
          <p>📞 112 - National Emergency</p>
          <p>✉ support@CareCircle.com</p>
          <p>🌐 www.CareCircle.com</p>

          <div className="social-icons">
            <a href="#" aria-label="Website">🌐</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {year} CareCircle Healthcare Management System. All Rights Reserved.
        <span>Made with ❤️ using React + Vite</span>
      </div>
    </footer>
  );
};

export default Footer;