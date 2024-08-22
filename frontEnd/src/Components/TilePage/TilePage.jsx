import React from "react";
import { Link } from "react-router-dom";
import "./TilePage.css";

const TilePage = ({ title, linkName1, linkName2, link1, link2 }) => {
  return (
    <div className="available-titles">
      <h2>{title}</h2>
      <br />
      <br />
      <div className="titles">
        <div className="title-card">
          <div className="title-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="title-info">
            <h3>{linkName1}</h3>
            <p>Click below to add</p>
            <span className="badge">
              <Link
                style={{ color: "#ffcc00", textDecoration: "none" }}
                to={link1}
                // target="_blank"
              >
                Go to
              </Link>
            </span>
          </div>
        </div>
        <div className="title-card">
          <div className="title-icon">
            <i className="fas fa-list"></i>
          </div>
          <div className="title-info">
            <h3>{linkName2}</h3>
            <p>Click below to view</p>
            <span className="badge">
              <Link
                style={{ color: "#ffcc00", textDecoration: "none" }}
                to={link2}
                // target="_blank"
              >
                Go to
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TilePage;
