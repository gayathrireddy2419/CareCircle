import React from "react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import Services from "./Services";
import EmergencySection from "./EmergencySection";
import AISection from "./AISection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Contact from "./Contact";

import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">

      <Navbar />

      <main>

        <Hero />

        <About />

        <Features />

        <Services />

        <EmergencySection />

        <AISection />

        <Testimonials />

        <FAQ />

        <Contact />

      </main>

      <Footer />

    </div>
  );
};

export default Landing;