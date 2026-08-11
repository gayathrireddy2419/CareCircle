import React from "react";
import { Star } from "lucide-react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Aman Sharma",
    role: "Family Administrator",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "CareCircle has completely simplified how our family manages medicines, prescription refills, and medical records. Everything is securely accessible in one place.",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "Working Professional",
    image: "https://i.pravatar.cc/150?img=20",
    review:
      "The medicine reminders and AI Assistant keep our busy family on schedule. The interface is modern, clean, and intuitive.",
    rating: 5,
  },
  {
    name: "Rahul Patel",
    role: "Primary Caregiver",
    image: "https://i.pravatar.cc/150?img=15",
    review:
      "The 1-click Emergency SOS broadcast and family member profiles give me total peace of mind. Highly recommended for every household.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonial-header">
        <span>TESTIMONIALS</span>
        <h2>What Our Users Say</h2>
        <p>
          Thousands of families trust CareCircle to manage their everyday healthcare securely and efficiently.
        </p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <h5>{item.role}</h5>
            <div className="stars">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={18} fill="#FBBF24" color="#FBBF24" />
              ))}
            </div>
            <p>{item.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;