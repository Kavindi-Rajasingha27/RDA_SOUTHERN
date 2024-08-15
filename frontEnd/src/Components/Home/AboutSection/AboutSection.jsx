import React from "react";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2>About Erie Water Works</h2>
        <p>
          On January 1st 1992, the Erie Water Works assumed operations of the
          City of Erie’s water system. The Erie Water Works is an independent
          organization whose goal is to operate, maintain and rehabilitate the
          water system for the Erie, Pennsylvania region, while providing
          service at an affordable cost. Working together to make a difference,
          Water Works employees stand by the community they work for and their
          Mission Statement.
        </p>
        <button>Map</button>
        <button>Estimate</button>
      </div>
    </section>
  );
};

export default AboutSection;
