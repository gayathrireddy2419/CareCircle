import apiClient from "./apiClient";

export const chatApi = {
  // Send Chat Message with prioritized Direct Gemini AI execution
  sendMessage: async (conversationId, messageText) => {
    const geminiKey = localStorage.getItem("gemini_api_key") || "";

    // 1. Direct Call to Google Gemini AI API if Key is saved in localStorage
    if (geminiKey) {
      let lastErrorMessage = "";
      const models = ["gemini-3.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

      for (const modelName of models) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(geminiKey)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `You are CareCircle AI Healthcare Assistant & Medical Advisor. Provide compassionate, clear, medical guidance for family health.\n\nUser Question: ${messageText}`
                  }]
                }]
              })
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText && replyText.trim()) {
              return replyText;
            }
          } else {
            const errData = await geminiRes.json().catch(() => ({}));
            lastErrorMessage = errData?.error?.message || `HTTP ${geminiRes.status} (${geminiRes.statusText})`;
            console.error(`Gemini API Error for model ${modelName}:`, geminiRes.status, errData);
          }
        } catch (geminiErr) {
          console.error(`Direct Gemini API fetch error for model ${modelName}:`, geminiErr);
          lastErrorMessage = geminiErr.message;
        }
      }

      if (lastErrorMessage) {
        return `⚠️ Google Gemini API Response Error: ${lastErrorMessage}\n\nKey used: ${geminiKey.substring(0, 8)}...\n\nPlease verify or replace your Gemini API key in the top right "Set Gemini API Key" button (get a free key at https://aistudio.google.com).`;
      }
    }

    // 2. Secondary Route: API Gateway on http://localhost:8090
    try {
      const headers = { "Content-Type": "text/plain" };
      if (geminiKey) headers["X-Gemini-Api-Key"] = geminiKey;

      const response = await apiClient.post(
        `/api/chat?conversationId=${encodeURIComponent(conversationId)}`,
        messageText,
        { headers }
      );
      if (response && response.data && typeof response.data === "string" && response.data.trim()) {
        return response.data;
      }
    } catch (e) {
      console.warn("API Gateway chat route attempt failed...", e);
    }

    
    // 3. ChatApp through API Gateway
try {
  const headers = { "Content-Type": "text/plain" };
  if (geminiKey) headers["X-Gemini-Api-Key"] = geminiKey;

  const response = await apiClient.post(
    `/api/chat?conversationId=${encodeURIComponent(conversationId)}`,
    messageText,
    { headers }
  );

  if (response && response.data) {
    const text =
      typeof response.data === "string"
        ? response.data
        : response.data?.message;

    if (text && text.trim()) {
      return text;
    }
  }
} catch (gatewayErr) {
  console.warn("API Gateway ChatApp route failed.", gatewayErr);
}

    // 4. Quaternary Route: Dynamic Clinical Health Advisor Engine
    if (!geminiKey) {
      return `[Gemini API Notice]: To receive direct live AI responses from Google Gemini, please click "Set Gemini API Key" in the top bar above and paste your Gemini API Key.\n\n---\n\nClinical Advisor Answer for "${messageText}":\n\n` + generateDynamicHealthAdvisorReply(messageText);
    }

    return generateDynamicHealthAdvisorReply(messageText);
  },
};

function generateDynamicHealthAdvisorReply(queryText) {
  const lower = (queryText || "").toLowerCase();

  if (lower.includes("fever") || lower.includes("temperature") || lower.includes("chills")) {
    return "For fever management:\n\n1. Rest adequately and maintain fluid intake (water, ORS, clear broths).\n2. Monitor body temperature every 4 hours.\n3. Use over-the-counter antipyretics like Paracetamol if recommended by a physician.\n4. Seek immediate emergency care if fever exceeds 102°F (38.9°C), or if accompanied by difficulty breathing, severe neck stiffness, or confusion.";
  } else if (lower.includes("headache") || lower.includes("head pain") || lower.includes("migraine")) {
    return "For headaches:\n\n1. Rest in a quiet, dark room and stay hydrated.\n2. Apply a cool or warm compress to your forehead or neck.\n3. Track migraine triggers such as stress, lack of sleep, or screen strain.\n4. Consult a physician if the headache is sudden and unusually severe.";
  } else if (lower.includes("throat") || lower.includes("cough") || lower.includes("cold") || lower.includes("flu")) {
    return "For sore throat and respiratory symptoms:\n\n1. Gargle with warm salt water 2-3 times daily.\n2. Sip warm teas with honey and ginger.\n3. Use steam inhalation to clear nasal passages.\n4. Consult a doctor if throat pain persists beyond 3-5 days or if high fever develops.";
  } else if (lower.includes("bp") || lower.includes("blood pressure") || lower.includes("hypertension")) {
    return "Healthy adult blood pressure is generally below 120/80 mmHg.\n\n1. Reduce dietary sodium intake.\n2. Engage in 30 minutes of daily brisk activity.\n3. Record daily morning/evening readings in CareCircle Health Vitals.\n4. Seek urgent medical evaluation if BP exceeds 180/120 mmHg.";
  } else if (lower.includes("sugar") || lower.includes("diabetes") || lower.includes("glucose")) {
    return "Normal fasting blood glucose ranges between 70-99 mg/dL.\n\n1. Consume balanced low-GI carbohydrates.\n2. Log daily pre/post-meal glucose values in CareCircle Vitals.\n3. Take prescribed insulin/oral hypoglycemia medications on schedule.\n4. Keep fast-acting glucose tablets nearby for hypoglycemic episodes (<70 mg/dL).";
  } else if (lower.includes("medicine") || lower.includes("dose") || lower.includes("tablet") || lower.includes("prescription")) {
    return "Under CareCircle Medicine Manager:\n\n1. You can log doses taken, view active schedules, and track expiry dates.\n2. When you click 'Log Dose Taken', your inventory stock automatically decreases by 1 tablet.\n3. Low stock warning badges appear when quantity falls below 5 tablets.";
  } else if (lower.includes("diet") || lower.includes("food") || lower.includes("nutrition") || lower.includes("eat")) {
    return "For optimal health & nutrition:\n\n1. Prioritize whole foods, fiber-rich vegetables, lean proteins, and healthy fats.\n2. Aim for 2.5-3 liters of water daily.\n3. Limit processed sugars and ultra-processed snacks.";
  } else {
    return `Regarding your question ("${queryText}"):\n\nAs your CareCircle Medical Advisor, I recommend prioritizing restful sleep, balanced hydration, and monitoring your daily health metrics. If you are experiencing physical discomfort or concerning symptoms, please log them in CareCircle Vitals or consult a certified physician for personalized medical evaluation.`;
  }
}

export default chatApi;
