import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./FAQ.css";

const faqs = [
  {
    question: "What is CareCircle?",
    answer:
      "CareCircle is an all-in-one family healthcare management platform that helps manage medicines, health records, vitals tracking, appointments, AI health assistance, and 1-click emergency SOS.",
  },
  {
    question: "Is my family's medical data secure?",
    answer:
      "Yes. CareCircle uses encrypted local and cloud storage to ensure your health documents and personal information are strictly private.",
  },
  {
    question: "Can I manage multiple family members?",
    answer:
      "Yes. You can add, edit, and monitor profiles for children, spouses, parents, and elder relatives from a single administrator account.",
  },
  {
    question: "How do medicine reminders work?",
    answer:
      "You can schedule prescription dosages and frequency. CareCircle sends timely notifications and tracks inventory stock so you know when to refill.",
  },
  {
    question: "How does the Emergency SOS feature work?",
    answer:
      "Pressing the Emergency SOS button immediately sends alerts to registered emergency contacts and provides a list of nearby hospitals and trauma centers.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-header">
        <span>FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p>
          Find answers to common questions about CareCircle and how it helps families simplify medical care.
        </p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            key={index}
          >
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {activeIndex === index ? (
                <ChevronUp size={22} color="#2563eb" />
              ) : (
                <ChevronDown size={22} color="#64748b" />
              )}
            </button>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;