import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container header-content">
        <h1>15 minute Online Monitoring of Microbiological Water Quality</h1>
        <ul>
          <li>Fully automated measurements</li>
          <li>15 minute measurement time</li>
          <li>30 minute cycle time including automatic cleaning</li>
        </ul>
        <button>Find Out More</button>
      </div>
    </section>
  );
};

export default HeroSection;
