// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TopNav from "./Components/TopNav/TopNav";
// import Home from "./Pages/Home/Home";
// import Employees from "./Pages/Employees/Employees";
// import Map from "./Pages/Map/Map";
// import Login from "./Pages/Login/Login";

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <TopNav />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/employees" element={<Employees />} />
//           <Route path="/map" element={<Map />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TopNav from "./Components/TopNav/TopNav";
import Home from "./Pages/Home/Home";
import Employees from "./Pages/Employees/Employees";
import Map from "./Pages/Map/Map";
import Login from "./Pages/Login/Login";
import { AuthProvider, useAuth } from "./AuthContext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <TopNav />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
