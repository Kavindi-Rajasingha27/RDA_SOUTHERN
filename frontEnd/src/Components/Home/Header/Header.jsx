import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">VWM</div>
        <nav className="nav">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#products">Products</a>
            </li>
            <li>
              <a href="#applications">Applications</a>
            </li>
            <li>
              <a href="#technology">Technology</a>
            </li>
            <li>
              <a href="#awards">Awards</a>
            </li>
            <li>
              <a href="#publications">Publications</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button>Register</button>
          <button>Login</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
