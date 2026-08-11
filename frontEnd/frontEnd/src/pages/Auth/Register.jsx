import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHealth } from "../../context/HealthContext";
import { HeartPulse, User, Phone, Lock, Eye, EyeOff, Users } from "lucide-react";
import "./Login.css";

export const Register = () => {
  const navigate = useNavigate();
  const { registerHead } = useHealth();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    familyName: "",
    name: "",
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await registerHead(form);
      navigate("/app/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Mobile number may already be registered.";
      setErrorMsg(typeof msg === "string" ? msg : "Registration failed. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <HeartPulse size={50} />
          <h1>CareCircle</h1>
        </div>
        <h2>Register Family Head Account</h2>
        <p>
          Establish your primary family workspace node to manage member health records, medications, and emergency alerts.
        </p>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Register Family Head</h2>

          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fca5a5",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {errorMsg}
            </div>
          )}

          <div className="input-group">
            <Users size={20} />
            <input
              type="text"
              name="familyName"
              placeholder="Family Name (e.g. Sharma Family)"
              value={form.familyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name (e.g. Rahul Sharma)"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Phone size={20} />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number (e.g. 9876543210)"
              value={form.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register Family Head"}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;