// ==========================================
// src/components/ai/ChatMessage.jsx
// ==========================================

import React from "react";
import { Bot, User } from "lucide-react";
import "./ChatMessage.css";

export default function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div className={`chat-message ${isUser ? "user" : "bot"}`}>

      <div className="chat-avatar">
        {isUser ? (
          <User size={20} />
        ) : (
          <Bot size={20} />
        )}
      </div>

      <div className="chat-content">

        <div className="chat-name">
          {isUser ? "You" : "Healthcare AI"}
        </div>

        <div className="chat-bubble">
          {message}
        </div>

        <div className="chat-time">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

      </div>

    </div>
  );
}