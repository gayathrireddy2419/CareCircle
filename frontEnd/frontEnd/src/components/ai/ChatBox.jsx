// src/components/ai/ChatBox.jsx
import React, { useRef, useEffect } from "react";
import { SendHorizonal, Bot, User, Sparkles, ShieldCheck } from "lucide-react";
import ChatMessage from "./ChatMessage";
import "./ChatBox.css";

export default function ChatBox({
  messages = [],
  input = "",
  setInput = () => {},
  sendMessage = () => {},
}) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  const promptSuggestions = [
    "🌡️ Mild fever & body ache",
    "💊 Check medicine dosage",
    "💓 Normal BP range"
  ];

  const handleSelectPrompt = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="chatbox focal-chatbox">
      {/* Header Banner */}
      <div className="chatbox-header">
        <div className="chatbox-title">
          <div className="bot-avatar-icon">
            <Bot size={28} />
          </div>
          <div>
            <h2>Healthcare AI Assistant & Medical Advisor</h2>
            <div className="status-badge-wrap">
              <span className="status-dot"></span>
              <span className="status-text">Online • Clinical Intelligence v2.4</span>
            </div>
          </div>
        </div>

        <div className="header-privacy-badge">
          <ShieldCheck size={16} /> 256-Bit Encrypted
        </div>
      </div>

      {/* Messages Window */}
      <div className="chatbox-messages" ref={messagesContainerRef}>
        {safeMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            message={msg.message}
          />
        ))}
      </div>

      {/* Prompt Suggestion Pills (No Scrollbar, 3 Items Only) */}
      <div className="prompt-suggestions-bar">
        <span className="suggestions-label">
          <Sparkles size={14} /> Suggestions:
        </span>
        <div className="suggestions-scroll">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="prompt-pill"
              onClick={() => handleSelectPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="chatbox-input">
        <input
          type="text"
          placeholder="Ask any health question, symptom inquiry, or prescription advice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} title="Send Message">
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}