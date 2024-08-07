import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopNav from "./Components/TopNav/TopNav";
import Home from "./Pages/Home/Home";
import Employees from "./Pages/Employees/Employees";
import Map from "./Pages/Map/Map";

const App = () => {
  return (
    <Router>
      <div>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
