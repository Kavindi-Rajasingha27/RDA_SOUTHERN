import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container header-content">
        <h1>The Road Development Authority</h1>
        <ul>
          <li>
            Obtaining Permission to Damage the Road with the View to get the
            Water Connection to a House
          </li>
          <li>
            Obtaining Permission to Erect Buildings & Parapet Walls on Either
            Sides of a National Road
          </li>
          <li>
            Requesting Authorization for Road Closure to Conduct Essential
            Maintenance
          </li>
        </ul>
        <button>Find Out More</button>
      </div>
    </section>
  );
};

export default HeroSection;
