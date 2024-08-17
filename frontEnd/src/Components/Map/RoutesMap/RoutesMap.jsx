import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { FeatureGroup, MapContainer, TileLayer, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Custom hook to handle routing control
const RoutingControl = ({ routes, onDeleteRoute }) => {
  const map = useMap();
  const routingControlsRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return; // Guard clause if map is not initialized
    // Clean up previous routing controls
    routingControlsRef.current.forEach((control) => {
      if (control) {
        control
          .getPlan()
          .getWaypoints()
          .forEach((waypoint) => {
            if (waypoint.latLng && waypoint.latLng != null) {
              map.removeLayer(waypoint.latLng);
            }
          });
        map.removeControl(control);
      }
    });
    routingControlsRef.current = [];

    // Clean up previous markers
    markersRef.current.forEach((marker) => {
      if (marker && marker != null) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    console.log("routesroutes", routes);

    // Add new routing controls
    routes.forEach((route) => {
      console.log("routeroute", route);

      const waypoints = route.waypoints.map((wp) => L.latLng(wp.lat, wp.lng));
      const routingControl = L.Routing.control({
        waypoints,
        createMarker: () => null, // No marker for waypoints
        routeWhileDragging: false,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      }).addTo(map);

      // Add a label to the start of the route
      const startPoint = waypoints[0];
      const marker = L.marker(startPoint, {
        icon: L.divIcon({
          className: "route-label",
          html: `<div>${route.name || "Unnamed Route"}</div>`,
          iconSize: [100, 40], // Adjust size as needed
        }),
      }).addTo(map);

      // Add click event listener to the label
      marker.on("click", () => {
        if (
          window.confirm(
            `Do you want to delete the route "${
              route.name || "Unnamed Route"
            }"?`
          )
        ) {
          onDeleteRoute(route.id); // Call the parent component's function to handle deletion
        }
      });

      routingControlsRef.current.push(routingControl);
      markersRef.current.push(marker);
    });

    return () => {
      // Clean up on component unmount
      routingControlsRef.current.forEach((control) => {
        if (control) {
          control
            .getPlan()
            .getWaypoints()
            .forEach((waypoint) => {
              if (waypoint.latLng && waypoint.latLng != null) {
                map.removeLayer(waypoint.latLng);
              }
            });
          map.removeControl(control);
        }
      });
      routingControlsRef.current = [];

      markersRef.current.forEach((marker) => {
        if (marker && marker != null) {
          map.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };
  }, [routes, map, onDeleteRoute]);

  return null;
};

const RoutesMap = ({ center, zoom }) => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [routes, setRoutes] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const featureGroupRef = useRef(null);

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

  const handleDeleteRoute = async (routeId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/estimated-routes/${routeId}`,
        axiosConfig
      );

      // Remove the route from state
      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId)
      );
    } catch (error) {
      console.error("Error deleting route:", error);
    }
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
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RoutingControl routes={routes} onDeleteRoute={handleDeleteRoute} />
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
  );
};

export default RoutesMap;
