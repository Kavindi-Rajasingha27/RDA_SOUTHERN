import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#contact">I want to contact Erie Water Works</a>
              </li>
              <li>
                <a href="#faqs">I want to read your FAQs</a>
              </li>
              <li>
                <a href="#manage-account">
                  I want to manage my account or pay my bill
                </a>
              </li>
              <li>
                <a href="#availability">
                  How do I know if water is available in my area?
                </a>
              </li>
              <li>
                <a href="#find-info">
                  Where can I find info on the water quality in my area?
                </a>
              </li>
              <li>
                <a href="#service-rates">
                  Where can I find the water service rates for my area?
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Information</h3>
            <ul>
              <li>24 Hour Emergency: (814) 870-8087</li>
              <li>Customer Service: (814) 870-8000 Ext. 7</li>
              <li>Quality Questions: (814) 870-8080 Ext. 4</li>
              <li>John J. McCormick Jr. Administration Building</li>
              <li>340 West Bayfront Parkway</li>
              <li>Erie, Pennsylvania 16507</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
