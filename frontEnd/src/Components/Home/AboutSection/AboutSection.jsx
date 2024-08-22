import React from "react";
import "./AboutSection.css";
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2>Who we are</h2>
        <p>
          The Road Development Authority (RDA), incorporated as a statutory body under the Ministry of
          Highways by the RDA Act No.73 of 1981, became successor to the Department of Highways in 1986.
          Since then, the RDA has become responsible for the maintenance and upgrading of the National
          Highway Network. Road Development Authority is one of the institutions under the Ministry of
          Highways which is the apex organization in Sri Lanka for the highways sector.
          The National Road Network consists of 12,255.41km of trunk (A class) and main (B class) roads
          and 312.59 km of expressways, and about 4,270 bridges as of the end of 2023. Road Development
          Authority is responsible for the maintenance and development of the National Road Network and
          planning, design, and construction of new highways, bridges, and expressways to augment the
          existing road network.
        </p>


        <Link to="/map">
          <button>Map</button>
        </Link>
        <Link to="/estimate">
          <button>Estimate</button>
        </Link>


      </div>
    </section>
  );
};

export default AboutSection;
