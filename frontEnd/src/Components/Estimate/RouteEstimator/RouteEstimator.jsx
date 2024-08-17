import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const RoutingControl = ({ routes, onSelectRoute }) => {
  const map = useMap();
  const routingControlsRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Clean up previous routing controls and markers
    routingControlsRef.current.forEach((control) =>
      control
        ?.getPlan()
        .getWaypoints()
        .forEach(
          (waypoint) => waypoint.latLng && map.removeLayer(waypoint.latLng)
        )
    );
    routingControlsRef.current.forEach((control) => map.removeControl(control));
    routingControlsRef.current = [];

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    routes.forEach((route) => {
      const waypoints = route.waypoints.map((wp) => L.latLng(wp.lat, wp.lng));
      const routingControl = L.Routing.control({
        waypoints,
        createMarker: () => null,
        routeWhileDragging: false,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      }).addTo(map);

      const startPoint = waypoints[0];
      const marker = L.marker(startPoint, {
        icon: L.divIcon({
          className: "route-label",
          html: `<div>${route.name || "Unnamed Route"}</div>`,
          iconSize: [100, 40],
        }),
      }).addTo(map);

      // marker.on("click", () => {
      //   if (
      //     window.confirm(
      //       `Do you want to add the route "${route.name || "Unnamed Route"}"?`
      //     )
      //   ) {
      //     // onSelectRoute(route.distance);
      //   }
      // });

      routingControlsRef.current.push(routingControl);
      markersRef.current.push(marker);
    });

    return () => {
      routingControlsRef.current.forEach((control) =>
        control
          ?.getPlan()
          .getWaypoints()
          .forEach(
            (waypoint) => waypoint.latLng && map.removeLayer(waypoint.latLng)
          )
      );
      routingControlsRef.current.forEach((control) =>
        map.removeControl(control)
      );
      routingControlsRef.current = [];

      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [routes]);

  return null;
};

// Define the rates for each road type
const roadRates = {
  CONCRETE: 50,
  CARPET: 30,
  THARA: 20,
  GRANITE: 40,
};

const RouteEstimator = ({ center, zoom }) => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const [selectedRoad, setSelectedRoad] = useState("");
  const [rate, setRate] = useState(0);
  const [area, setArea] = useState(0);
  const [amount, setAmount] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const featureGroupRef = useRef(null);

  const roadRates = useMemo(
    () => ({
      CONCRETE: 50,
      CARPET: 30,
      THARA: 20,
      GRANITE: 40,
    }),
    []
  );

  const MapEventHandler = () => {
    const map = useMapEvent("click", (e) => {
      if (!startPoint) {
        setStartPoint(e.latlng);
      } else if (!endPoint) {
        setEndPoint(e.latlng);
        addRoute(map, startPoint, e.latlng);
      } else {
        // Reset points
        setStartPoint(e.latlng);
        setEndPoint(null);
        // map.eachLayer((layer) => {
        //   if (layer.options && layer.options.waypoints) {
        //     map.removeLayer(layer);
        //   }
        // });

        // setStartPoint(null);
        // setEndPoint(null);
      }
    });
    return null;
  };

  const addRoute = async (map, start, end) => {
    if (start && end) {
      const routeName = prompt("Enter a name for this route:");
      if (routeName) {
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng),
          ],
          createMarker: () => null,
        }).addTo(map);

        routingControl.on("routesfound", async function (e) {
          const routes = e.routes;
          const summary = routes[0].summary;
          const routeData = {
            name: routeName,
            start: start,
            end: end,
            distance: summary.totalDistance,
            time: summary.totalTime,
            estimate: summary.totalDistance * rate,
            waypoints: routes[0].waypoints.map((wp) => ({
              lat: wp.latLng.lat,
              lng: wp.latLng.lng,
            })),
          };

          setRouteData(routeData);
          handleClick(summary.totalDistance);
          // Save the route to the server
        });
      }
    }
  };

  const saveEstimate = async (routeData) => {
    console.log("routeData", routeData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/save-estimate`,
        routeData,
        axiosConfig
      );

      console.log("response", response);
      console.log("response.status", response.status);

      if (response.status === 201) {
        const savedRoute = response.data;
        setRoutes((prevRoutes) => [...prevRoutes, savedRoute]);
      } else {
        alert("Error saving the route. Please try again.");
      }
    } catch (error) {
      console.error("Error saving the route:", error);
      alert("Error saving the route. Please try again.");
    }
  };
  useEffect(() => {
    const fetchRoutes = async (area) => {
      try {
        const query = area ? { area: JSON.stringify(area) } : {};
        const response = await axios.get(`${API_BASE_URL}/estimated-routes`, {
          ...axiosConfig,
          params: query,
        });

        const data = response.data;
        console.log("data", data);
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
        alert("Error fetching routes. Please try again later.");
      }
    };

    fetchRoutes(selectedArea);
  }, [selectedArea]);

  const handleRoadChange = (e) => {
    const roadType = e.target.value;
    setSelectedRoad(roadType);
    setRate(roadRates[roadType]);
    setAmount(area * roadRates[roadType]);
  };

  const handleClick = (routeDistance) => {
    setArea(routeDistance);
    setAmount(routeDistance * rate);
  };

  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      const area = layer
        .getLatLngs()[0]
        .map((latLng) => [latLng.lat, latLng.lng]);
      setSelectedArea(area);
    }
  };

  return (
    <div>
      <h1>Road Cost Estimator</h1>
      <label>
        Road Type:
        <select value={selectedRoad} onChange={handleRoadChange}>
          <option value="">Select Road Type</option>
          <option value="CONCRETE">Concrete</option>
          <option value="CARPET">Carpet</option>
          <option value="THARA">Thara</option>
          <option value="GRANITE">Granite</option>
        </select>
      </label>
      <br />
      <label>Rate: {rate}</label>
      <br />
      <label>
        Area (sq. units):
        <input type="text" value={area} disabled />
      </label>
      <br />
      <label>Amount: {amount}</label>
      <button
        type="submit"
        onClick={() => {
          saveEstimate(routeData);
        }}
      >
        Submit Estimate
      </button>
      {selectedRoad && (
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEventHandler />
          <RoutingControl routes={routes} onSelectRoute={handleClick} />
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      )}
    </div>
  );
};

export default RouteEstimator;
