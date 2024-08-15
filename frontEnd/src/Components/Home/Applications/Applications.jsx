import React from "react";
import "./Applications.css";

const Applications = () => {
  return (
    <section className="applications">
      <div className="container">
        <h2>Applications</h2>
        <div className="application-cards">
          <div className="card">
            {/* <img src="/icons/drinking-water.png" alt="Drinking Water" /> */}
            <i class="fa-solid fa-faucet-drip" style={{ fontSize: "50px" }}></i>
            <h3>Drinking Water</h3>
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div className="card">
            {/* <img src="/icons/surface-water.png" alt="Surface Water" /> */}
            <i class="fa-solid fa-water" style={{ fontSize: "50px" }}></i>
            <h3>Surface Water</h3>
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div className="card">
            {/* <img src="/icons/waste-water.png" alt="Waste Water" /> */}
            <i class="fa-solid fa-recycle" style={{ fontSize: "50px" }}></i>
            <h3>Waste Water</h3>
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Applications;
