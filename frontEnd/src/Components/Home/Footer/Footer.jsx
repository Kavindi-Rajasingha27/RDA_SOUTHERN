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
                <a href="#contact">I want to contact the RDA Southern Province Office</a>
              </li>
              <li>
                <a href="#faqs">I want to read the RDA's FAQs</a>
              </li>
              <li>
                <a href="#manage-project">
                  I want to manage my road development project or make a payment
                </a>
              </li>
              <li>
                <a href="#project-availability">
                  How do I know if a road project is ongoing in my area?
                </a>
              </li>
              <li>
                <a href="#road-conditions">
                  Where can I find info on road conditions in my area?
                </a>
              </li>
              <li>
                <a href="#development-guidelines">
                  Where can I find the road development guidelines and standards?
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Information</h3>
            <ul>
              <li>24 Hour Emergency: +94 912 234 567</li>
              <li>Customer Service: +94 912 345 678 Ext. 1</li>
              <li>Quality Questions: +94 912 345 678 Ext. 2</li>
              <li>RDA Southern Provincial Office</li>
              <li>No. 123 Galle Road</li>
              <li>Matara, Sri Lanka</li>

            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
