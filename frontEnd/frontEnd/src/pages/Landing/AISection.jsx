import React from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Bot,
  Sparkles,
  HeartPulse,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import "./AISection.css";

const AISection = () => {
  return (
    <section className="ai-section" id="ai">
      <div className="ai-left">
        <span className="ai-tag">
          <Sparkles size={18} />
          AI-Powered Healthcare
        </span>

        <h2>
          Meet Your
          <span> AI Health Assistant</span>
        </h2>

        <p>
          Get preliminary symptom assessment, medication guidance, health recommendations,
          and instant answers to your healthcare questions 24/7.
        </p>

        <div className="ai-features">
          <div className="feature">
            <BrainCircuit size={22} color="#2563eb" />
            AI Symptom Assessment
          </div>

          <div className="feature">
            <HeartPulse size={22} color="#10b981" />
            Personalized Recommendations
          </div>

          <div className="feature">
            <MessageCircle size={22} color="#8b5cf6" />
            24×7 Instant Chat
          </div>
        </div>

        <Link to="/app/ai" className="ai-btn">
          Try AI Assistant
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="ai-right">
        <div className="chat-card">
          <div className="chat-header">
            <Bot size={28} color="#2563eb" />
            <div>
              <h3>CareCircle AI</h3>
              <span>Online • Ready to Assist</span>
            </div>
          </div>

          <div className="chat-box">
            <div className="ai-message">
              👋 Hello! I am your AI Health Assistant. How can I help you today?
            </div>

            <div className="user-message">
              I missed my morning medicine dose.
            </div>

            <div className="ai-message">
              💊 Check your prescription schedule in the Medicine Manager. Your next dose is scheduled for 8:00 PM.
            </div>

            <div className="user-message">
              Analyze my symptoms: mild fever and headache.
            </div>

            <div className="ai-message">
              📊 Assessment: Stay well-hydrated, rest, and monitor body temperature. Consult a doctor if fever exceeds 102°F.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;