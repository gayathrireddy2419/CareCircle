import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  CheckCircle2
} from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-header">
        <span>CONTACT US</span>
        <h2>Let's Connect With CareCircle</h2>
        <p>
          We'd love to hear from you. Whether you have questions, feedback,
          or need platform support, our dedicated healthcare support team is here to help.
        </p>
      </div>

      <div className="contact-wrapper">
        {/* Contact Information */}
        <div className="contact-info">
          <div className="info-box">
            <Phone size={26} color="#2563eb" />
            <div>
              <h3>Phone Support</h3>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="info-box">
            <Mail size={26} color="#2563eb" />
            <div>
              <h3>Email</h3>
              <p>support@carecircle.com</p>
            </div>
          </div>

          <div className="info-box">
            <MapPin size={26} color="#2563eb" />
            <div>
              <h3>Location</h3>
              <p>Pune, Maharashtra, India</p>
            </div>
          </div>

          <div className="info-box">
            <Clock size={26} color="#2563eb" />
            <div>
              <h3>Working Hours</h3>
              <p>Mon - Sat | 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          {sentSuccess && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} /> Thank you! Your message has been sent successfully.
            </div>
          )}

          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;