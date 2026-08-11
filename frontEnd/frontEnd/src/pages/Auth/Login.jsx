import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHealth } from "../../context/HealthContext";
import { Phone, Lock, Eye, EyeOff, HeartPulse } from "lucide-react";
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useHealth();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
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
      await login({
        mobileNumber: form.mobileNumber,
        password: form.password,
      });
      navigate("/app/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.message || err.response?.data || "Login failed. Please verify your mobile number and password.";
      setErrorMsg(typeof msg === "string" ? msg : "Login failed. Please check your credentials.");
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
        <h2>Welcome Back</h2>
        <p>
          Login to manage medicines, family members, emergency services, vitals, and health records.
        </p>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {errorMsg && (
            <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {errorMsg}
            </div>
          )}

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
              placeholder="Password"
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

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>

          <p>
            Don't have an account? <Link to="/register">Register Family Head</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;