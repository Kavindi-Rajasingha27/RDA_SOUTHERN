import React from "react";
import "./Applications.css";

const Applications = () => {
  return (
    <section className="applications">
      <div className="container">
        <h2>Services</h2>
        <div className="application-cards">
          <div className="card">
            <i class="fa-solid fa-road" style={{ fontSize: "50px" }}></i>
            <h3>Highway Develop</h3>
            <p>Managing the develop...</p>
          </div>
          <div className="card">
            <i class="fa-solid fa-map" style={{ fontSize: "50px" }}></i>
            <h3>Road Mapping</h3>
            <p>Creating and updati...</p>
          </div>
          <div className="card">
            <i class="fa-solid fa-tools" style={{ fontSize: "50px" }}></i>
            <h3>Road Maintenance</h3>
            <p>Ensuring regular mai...</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Applications;
