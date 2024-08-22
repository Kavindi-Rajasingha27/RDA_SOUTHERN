import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext/AuthContext";
import EstimatedRoutes from "./Components/Estimate/EstimatedRoutes/EstimatedRoutes";
import RouteEstimator from "./Components/Estimate/RouteEstimator/RouteEstimator";
import AddRoutes from "./Components/Map/AddRoutes/AddRoutes";
import RoutesMap from "./Components/Map/RoutesMap/RoutesMap";
import TopNav from "./Components/TopNav/TopNav";
import Employees from "./Pages/Employees/Employees";
import Estimate from "./Pages/Estimate/Estimate";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Map from "./Pages/Map/Map";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const initialCenter = [5.988, 80.505];
  const initialZoom = 10;
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
      <Route
        path="/estimate"
        element={
          <ProtectedRoute>
            <Estimate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-completed-routes"
        element={
          <ProtectedRoute>
            <AddRoutes center={initialCenter} zoom={initialZoom} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/completed-routes"
        element={
          <ProtectedRoute>
            <RoutesMap center={initialCenter} zoom={initialZoom} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estimator"
        element={
          <ProtectedRoute>
            <RouteEstimator center={initialCenter} zoom={initialZoom} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estimated-routes"
        element={
          <ProtectedRoute>
            <EstimatedRoutes center={initialCenter} zoom={initialZoom} />
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
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
