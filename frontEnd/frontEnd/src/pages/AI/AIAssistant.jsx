// src/pages/AI/AIAssistant.jsx
import React, { useState } from 'react';
import SymptomForm from '../../components/ai/SymptomForm';
import ChatBox from '../../components/ai/ChatBox';
import HealthTips from '../../components/ai/HealthTips';
import chatApi from '../../api/chatApi';
import { Bot, Sparkles, CheckCircle2, Key, Settings, Check } from 'lucide-react';
import './AIAssistant.css';

export default function AIAssistant() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Hello! I am your AI Health Assistant. How can I help you or your family today? Ask me any health or medical question.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');

  // Maintain or retrieve conversation ID
  const [conversationId] = useState(() => {
    let cid = localStorage.getItem('conversationId');
    if (!cid) {
      cid = 'user-session-' + Date.now();
      localStorage.setItem('conversationId', cid);
    }
    return cid;
  });

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    localStorage.setItem('gemini_api_key', trimmed);
    setGeminiKey(trimmed);
    setShowKeyInput(false);
  };

  const handleSymptomAnalyze = (formData) => {
    setAnalysisResult({
      symptoms: formData.symptoms,
      assessment: `Based on reported symptoms ("${formData.symptoms}") lasting ${formData.duration} at ${formData.severity} severity level:`,
      recommendation: "Maintain good hydration, rest, and monitor vitals daily. If discomfort or fever persists beyond 48-72 hours, schedule a doctor consultation.",
      specialty: "General Physician / Internal Medicine",
      riskLevel: formData.severity.includes('Severe') ? 'High' : formData.severity.includes('Moderate') ? 'Moderate' : 'Low'
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      message: userText
    };

    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      // POST plain text to /api/chat?conversationId=...
      const response = await chatApi.sendMessage(conversationId, userText);
      const botResponseText = typeof response === 'string' ? response : (response?.reply || response?.message || JSON.stringify(response));

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        message: botResponseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Chat API error:", err);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        message: "Sorry, I am having trouble connecting to the healthcare advisor server. Please ensure backend services are running on port 8090."
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '12px', borderRadius: '16px', color: '#ffffff', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
            <Bot size={30} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a', fontWeight: 800 }}>AI Healthcare Assistant & Diagnostic Hub</h1>
            <p style={{ margin: '3px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Real-time medical guidance and daily wellness recommendations</p>
          </div>
        </div>

        {/* Gemini API Key Configuration Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showKeyInput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1.5px solid #3b82f6', borderRadius: '12px', padding: '4px 8px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' }}>
              <Key size={16} color="#3b82f6" />
              <input
                type="password"
                placeholder="Paste Gemini API Key (AIzaSy...)"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.82rem', padding: '4px', width: '220px' }}
              />
              <button
                onClick={handleSaveKey}
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowKeyInput(false)}
                style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', padding: '5px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setTempKey(geminiKey); setShowKeyInput(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: geminiKey ? '#ecfdf5' : '#f8fafc',
                color: geminiKey ? '#047857' : '#475569',
                border: '1.5px solid ' + (geminiKey ? '#a7f3d0' : '#e2e8f0'),
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Key size={16} color={geminiKey ? '#059669' : '#64748b'} />
              {geminiKey ? 'Gemini Key Configured ✓' : 'Set Gemini API Key'}
              <Settings size={14} color="#94a3b8" />
            </button>
          )}
        </div>
      </div>

      {/* 1. HEALTHCARE AI ASSISTANT CHAT */}
      <div style={{ marginBottom: '2rem' }}>
        <ChatBox
          messages={messages}
          input={input}
          setInput={setInput}
          sendMessage={handleSendMessage}
        />
      </div>

      {/* 2. AI HEALTH ANALYZER & DAILY HEALTH TIPS */}
      <div className="ai-lower-grid">
        <div className="ai-analyzer-column">
          <SymptomForm onAnalyze={handleSymptomAnalyze} />

          {analysisResult && (
            <div style={{ background: '#f5f3ff', border: '1.5px solid #c7d2fe', padding: '1.5rem', borderRadius: '20px', marginTop: '1.25rem', boxShadow: '0 4px 18px rgba(99, 102, 241, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                  <Sparkles size={20} color="#4f46e5" /> AI Diagnostic Feedback Summary
                </h3>
                <span style={{
                  background: analysisResult.riskLevel === 'High' ? '#fef2f2' : analysisResult.riskLevel === 'Moderate' ? '#fffbe6' : '#ecfdf5',
                  color: analysisResult.riskLevel === 'High' ? '#dc2626' : analysisResult.riskLevel === 'Moderate' ? '#d97706' : '#047857',
                  border: '1px solid ' + (analysisResult.riskLevel === 'High' ? '#fca5a5' : analysisResult.riskLevel === 'Moderate' ? '#fde68a' : '#a7f3d0'),
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  Risk: {analysisResult.riskLevel}
                </span>
              </div>

              <p style={{ color: '#312e81', fontSize: '0.88rem', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                {analysisResult.assessment}
              </p>

              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', color: '#1e293b', fontSize: '0.85rem', border: '1px solid #e0e7ff', marginBottom: '10px' }}>
                <strong style={{ color: '#4f46e5', display: 'block', marginBottom: '4px' }}>Clinical Care Recommendation:</strong>
                {analysisResult.recommendation}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4338ca', fontWeight: '600' }}>
                <CheckCircle2 size={15} color="#4f46e5" /> Suggested Specialty: <strong>{analysisResult.specialty}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="ai-tips-column">
          <HealthTips />
        </div>
      </div>
    </div>
  );
}