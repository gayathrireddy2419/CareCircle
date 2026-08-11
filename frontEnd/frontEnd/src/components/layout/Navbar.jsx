import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHealth } from "../../context/HealthContext";
import { Heart, Activity, Menu, X, Sun, Moon } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, toggleTheme } = useHealth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);
  const isDarkMode = state?.userSettings?.theme === 'dark';

  const scrollToSection = (id) => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => scrollToSection("hero")}>
          <div className="logo-circle">
            <Heart size={20} color="#ffffff" fill="#ffffff" />
          </div>

          <div className="logo-text">
            <h2>CareCircle</h2>
            <span>Healthcare Management</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className={menuOpen ? "nav-links active" : "nav-links"}>
          <button className="nav-anchor-btn" onClick={() => scrollToSection("hero")}>
            Home
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("about")}>
            About
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("features")}>
            Features
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("services")}>
            Services
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("emergency")}>
            Emergency
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("ai")}>
            AI Assistant
          </button>

          <button className="nav-anchor-btn" onClick={() => scrollToSection("contact")}>
            Contact
          </button>

          <Link to="/app/dashboard" className="nav-app-link" onClick={closeMenu}>
            <Activity size={16} /> Open App
          </Link>
        </nav>

        {/* Right Side Buttons */}
        <div className="navbar-actions">
          <button
            className="theme-toggle-header-btn"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#38bdf8" />}
          </button>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;